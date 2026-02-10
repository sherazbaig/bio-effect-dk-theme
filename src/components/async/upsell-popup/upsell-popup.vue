<template>
  <div class="upsell-popup critical-component-hide">
    <div class="upsell-popup__grid grid">
      <div class="col xs-span l1-6">
        <h2
          v-if="title"
          class="upsell-popup__title text-h2-desktop text-mobile-titles ml-l-desktop mb-m"
          v-text="title"
        />

        <p
          class="upsell-popup__description"
          v-html="description"
        />

        <btn
          v-if="productPrice"
          class="upsell-popup__add-to-cart mt-3xl-desktop mt-l"
          :label="$string('product.cta.add_to_bag')"
          name="addToCart"
          :show-loading="state === 'adding'"
          modifiers="secondary center"
          multiple-labels
          :secondary-label="$formatMoney(productPrice)"
          type="button"
          @click="addToCart"
        />
      </div>

      <div class="upsell-popup__image col l7-10">
        <responsive-image
          v-if="productImage"
          :image="productImage"
          :padding="false"
        />
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Upsell popup (upsell-popup)
 * -----------------------------------------------------------------------------
 * Upsell/Cross-sell popup to be used across the theme.
 *
 * @param {String} liquid.sectionId - Section's Liquid ID.
 *
 */

import { nextTick } from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

import { clearAllBodyScrollLocks } from 'body-scroll-lock'

import classes from '~/config/classes'
import timings from '~/config/timings'

import Btn from '~global/btn/btn.vue'
import ResponsiveImage from '~global/images/responsive-image.vue'

export default {
  name: 'UpsellPopup',

  components: {
    ResponsiveImage,
    Btn,
  },

  props: {
    isActive: {
      type: Boolean,
      default: null,
    },
  },

  data() {
    return {
      state: 'ready',
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      upsellType: (state) => state.upsell.upsellType,
      title: (state) => state.upsell.title,
      description: (state) => state.upsell.description,
      product: (state) => state.upsell.product,
      originalItemProperties: (state) => state.upsell.originalItemProperties,
    }),

    /**
     * Computes the product id whether it's from liquid or graphQL.
     * @return {String|Number}
     */
    productId() {
      return (this.product?.variants || [])[0]?.id || this.product?.id
    },

    /**
     * Computes the product image whether it's from liquid or graphQL.
     * @return {String}
     */
    productImage() {
      return (this.product?.media || [])[0]?.src
        ? this.product?.media[0]
        : this.product.featuredImage
    },

    /**
     * Computes the product price whether it's from liquid or graphQL.
     * @return {String|Number}
     */
    productPrice() {
      return this.product?.price_min || this.product?.price?.min
    },
  },

  watch: {
    isActive(val) {
      if (!val) {
        clearAllBodyScrollLocks()
      }

      this.toggleActiveClass()
    },
  },

  mounted() {
    this.toggleActiveClass()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      closeOverlay: 'overlays/close',
    }),

    /**
     * Map Vuex mutations.
     */
    ...mapMutations({
      setOriginalItemProperties: 'upsell/setOriginalItemProperties',
      resetState: 'upsell/resetState',
    }),

    /**
     * Toggle active class on the upsell popup.
     */
    toggleActiveClass() {
      const modalContainer = document.querySelector('.upsell-popup__container')

      if (!modalContainer) {
        return
      }

      if (!this.isActive) {
        modalContainer.classList.remove(classes.active)

        return
      }

      setTimeout(() => {
        modalContainer.classList.add(classes.active)
      }, timings.normal)
    },

    async addToCart() {
      this.state = 'adding'
      const item = [
        {
          id: this.productId,
          quantity: 1,
        },
      ]

      try {
        await this.addItem(item)
      } catch (err) {
        this.state = 'error'
      } finally {
        nextTick().then(() => {
          this.resetState()
          this.state = 'ready'
          this.closeOverlay('upsellPopup')
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import './upsell-popup';
</style>
