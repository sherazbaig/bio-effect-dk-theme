<template>
  <div
    id="product-form"
    class="product-form"
    data-sign-post-location="main"
    js-sign-post
  >
    <form
      class="product-form__form"
      @submit.prevent="handleAddToCart"
    >
      <div
        v-show="!product.hasOnlyDefaultVariant"
        class="product-form__variants"
      >
        <selection-tab
          v-for="(variantObject, index) of productVariants"
          :id="`variant-${variantObject.id}`"
          :key="`variant-${index}-${variantObject.id}`"
          v-model="currentVariantId"
          class="product-form__variant"
          :label="getVariantTitle(variantObject)"
          :loading="loading"
          name="id"
          :value="variantObject.id"
        />
      </div>

      <btn
        v-show="variant.available"
        class="product-form__add-to-cart"
        :class="{ 'product-form__add-to-cart--loading': state === 'adding' }"
        :label="addToCartText"
        :show-loading="state === 'adding'"
        modifiers="primary center"
        type="submit"
      />
    </form>

    <notification-panel
      v-if="error"
      class-container="product-form__error"
      :show-close="false"
      :text="error"
      type="error"
    />
  </div>
</template>

<script>

/**
 * Vue: Product form (product-form)
 * -----------------------------------------------------------------------------
 * Product form to handle variant selection and adding to cart.
 *
 * @param {Boolean} [loading] - Loading state.
 * @param {Object|Boolean} product - Canvas formatted product object.
 * @param {Object|Boolean} variant - Canvas formatted variant object.
 *
 * @emits updateVariant - Emit new variant object.
 *
 */
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import Btn from '~global/btn/btn'
import NotificationPanel from '~async/utils/notification-panel/notification-panel'
import SelectionTab from '~async/utils/selection-tab/selection-tab'

export default {
  name: 'ProductForm',

  components: {
    Btn,
    NotificationPanel,
    SelectionTab,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    product: {
      type: [Boolean, Object],
      default: false,
      required: true,
    },
    variant: {
      type: [Boolean, Object],
      default: false,
      required: true,
    },
  },

  emits: {
    'update-variant': (payload) => typeof payload === 'object',
  },

  data() {
    return {
      addedVariant: false,
      currentVariantId: this.variant?.id || 0,
      error: '',
      lineItemProperties: {},
      quantity: 1,
      state: 'ready',
      timeout: {},
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getComponentExists: 'components/getExists',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Compute add to cart text.
     * @returns {String}
     */
    addToCartText() {
      if (this.state === 'adding') {
        return ''
      }

      return this.state === 'added'
        ? this.$string('product.cta.added')
        : this.$string('product.cta.add_to_bag')
    },

    /**
     * Compute product variants to iterate over.
     * @returns {Array}
     */
    productVariants() {
      if (this.loading) {
        return [false, false, false, false, false]
      }

      return this.product.variants
    },
  },

  watch: {

    /**
     * Watch currentVariantId to update Canvas variant when select changes.
     */
    currentVariantId() {
      if (this.variant.id === this.currentVariantId) {
        return
      }

      const variant = this.getVariantFromId(this.currentVariantId)

      if (!variant) {
        return
      }

      this.$emit('update-variant', variant)
    },

    /**
     * Watch product to update selected variant when product data is loaded.
     */
    product() {
      this.getCurrentVariant()
      this.quantity = 1
    },
  },

  mounted() {
    this.getCurrentVariant()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      openOverlay: 'overlays/open',
    }),

    /**
     * Map mutations.
     */
    ...mapMutations({
      setOriginalItemProperties: 'upsell/setOriginalItemProperties',
      setTitle: 'upsell/setTitle',
      setDescription: 'upsell/setDescription',
      setUpsellProduct: 'upsell/setUpsellProduct',
      setUpsellType: 'upsell/setUpsellType',
    }),

    /**
     * Get current variant on page load or product update.
     */
    getCurrentVariant() {
      if (!this.product || !this.product?.variants?.length) {
        return
      }

      if (this.product.hasOnlyDefaultVariant) {
        this.currentVariantId = this.product.variants[0].id
        return
      }

      /**
       * Pick the first in stock variant.
       * - If no variants are in stock use first.
       * - Or use variant from URL if set.
       */
      const inStockVariants = this.product.variants.filter((variant) => {
        return variant.available
      })

      const defaultVariant = inStockVariants.length
        ? inStockVariants[0]
        : this.product.variants[0]

      const variant = this.getVariantFromUrl() || defaultVariant

      this.currentVariantId = variant.id
    },

    /**
     * Get initial variant from URL parameter.
     * @returns {Object}
     */
    getVariantFromUrl() {
      const params = new URLSearchParams(document.location.search.substring(1))
      const variantId = Number(params.get('variant'))
      return this.getVariantFromId(variantId)
    },

    /**
     * Get variant object from variant ID.
     * @returns {Object}
     */
    getVariantFromId(variantId) {
      return this.product.variants.find((variant) => {
        return variant.id === variantId
      })
    },

    /**
     * Get variant title.
     * @param {Object} variant - Variant object.
     * @returns {String}
     */
    getVariantTitle(variant) {
      if (!variant) {
        return this.$string('accessibility.loading')
      }

      return variant.available
        ? variant.title
        : `${variant.title} <span class="visually-hidden">${this.$string('product.form.sold_out')}</span>`
    },

    /**
     * Handle add to cart submission.
     */
    async handleAddToCart() {
      if (!this.variant) {
        return
      }

      clearTimeout(this.timeout)
      this.error = ''
      this.state = 'adding'

      if (cnvs.storybook) {
        this.timeout = setTimeout(() => {
          this.state = 'added'
        }, this.$timing('slow'))

        this.timeout = setTimeout(() => {
          this.state = 'ready'
        }, this.$timing('message'))

        return
      }

      const items = [
        {
          id: this.variant.id,
          properties: this.lineItemProperties,
          quantity: this.quantity,
        },
      ]

      if (this.product.upsellType !== null) {
        this.setUpsellType(this.product.upsellType)
        this.setTitle(this.product.upsellTitle)
        this.setDescription(this.product.upsellDescription)
        this.setUpsellProduct(this.product.upsellProduct)

        if (this.product.upsellType === 'true' || this.product.upsellType === true) {
          this.setOriginalItemProperties(items)
          this.openOverlay({
            component: 'upsell-popup',
            ignoreDismissed: true,
            namespace: 'upsellPopup',
          })
          this.state = 'ready'

          return
        }
      }

      try {
        await this.addItem(items)
        this.addedVariant = this.variant
        this.state = 'added'

        if (
          this.product.upsellType === null &&
          cnvs.settings.autoOpenCartDrawer &&
          this.getComponentExists('cart-drawer')
        ) {
          this.openOverlay({
            component: 'cart-drawer',
            ignoreDismissed: true,
            namespace: 'cartDrawer',
          })
        }

        this.state = 'ready'

        if (this.product.upsellType !== null) {
          this.openOverlay({
            component: 'upsell-popup',
            ignoreDismissed: true,
            namespace: 'upsellPopup',
          })
        }

      } catch (error) {
        this.state = 'error'

        if (error?.description) {
          this.error = error.description
          return
        }

        cnvs.ReportError('Failed to add product to cart', error)
      }
    },
  },
}
</script>

<style lang="scss">
@import './product-form';
</style>
