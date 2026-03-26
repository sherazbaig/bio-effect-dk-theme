<!-- eslint-disable vue/no-restricted-html-elements -->
<template>
  <a
    :href="product.url"
    class="product-card"
    :class="[
      {
        [$class('loading')]: !product,
      }
    ]"
  >
    <div class="product-card__header">
      <p
        class="product-card__title text-h6 text-h5-desktop"
        v-text="cleanedTitle"
      />

      <div
        v-if="!product.badge && product.badge_text"
        class="product-card__badgeText"
        :style="{ backgroundColor: product.badge_color }"
      >
        <span
          class="text-tags"
          v-text="product.badge_text"
        />
      </div>
    </div>
    <div class="product-card__image-container">
      <responsive-image
        class="product-card__primary-image"
        :image="selectedVariant?.image?.src
          ? selectedVariant?.image
          : product.featuredImage"
        :lazy-load="false"
        min-max="100-1200"
        :padding="padding"
        ratio="100:85"
      />

      <div
        v-if="product.badge"
        class="product-card__badge"
        :style="{ backgroundColor: product.badge_color }"
      >
        <responsive-image
          lazyload
          :padding="false"
          :image="product.badge"
          min-max="124-124"
          ratio="1:1"
        />
      </div>

      <div
        v-if="product.awards"
        class="product-card__awards"
        :class="product?.variants?.length > 1 ? 'product-card__awards-with-variant' : ''"
      >
        <div
          v-for="(award, index) of product.awards"
          :key="index"
          class="product-card__award"
        >
          <responsive-image
            lazyload
            :padding="false"
            :image="award"
            min-max="60-120"
            ratio="1:1"
          />
        </div>
      </div>
    </div>
    <div class="product-card__footer">
      <div
        class="product-card__variant-selector"
        v-if="variantTags.length"
      >
        <a
          v-for="(tag, index) in variantTags"
          :key="tag + index"
          :href="`/products/${encodeURIComponent(tag.replace('variant: ', '').toLowerCase())}`"
          class="product-card__variantProduct"
        >
          {{ formatVariantTag(tag) }}
        </a>
      </div>
      <div
        class="product-card__variant-selector"
        :class="{
          [$class('hidden')]: product?.variants?.length < 2
        }"
      >
        <div
          v-for="(variant, index) of product.variants"
          :key="variant.id"
          class="product-card__variant-choice"
          :class="{
            'active': index === selectedVariantIndex,
          }"
          @click.prevent="() => selectedVariantIndex = index"
        >
          {{ variant.title }}
        </div>
      </div>
      <button
        type="button"
        class="product-card__add-button button text-button"
        :class="{
          [$class('disabled')]: !selectedVariant?.available,
          [$class('loading')]: state === 'adding',
          /**
           * Only add secondary modifier if product is set.
           * - Otherwise, secondary styling messes with `::after` styling on
           *   loading state.
           */
          'button--secondary': product,
        }"
        @click.prevent="addItemToCart"
      >
        <div
          class="product-card__button-label button__label"
          :class="{
            'text-center': !selectedVariant?.available
          }"
        >
          <p
            v-if="selectedVariant?.available"
            class="text-button"
            v-text="$string('product.cta.add_to_cart')"
          />
          <p
            v-else
            class="text-button"
            v-text="$string('product.form.sold_out')"
          />

          <div
            v-if="selectedVariant?.available"
            class="product-card__price text-button"
          >
            <span
              v-if="product.variants?.size > 1"
              v-text="$string('product.prices.from')"
            />

            <product-prices
              class="product-card__prices"
              element="span"
              :compare-at-price="selectedVariant?.compareAtPrice?.amount"
              :price="selectedVariant?.price?.amount"
            />
          </div>
        </div>
      </button>
    </div>
  </a>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import responsiveImage from '~global/images/responsive-image.vue'
import ProductPrices from '~global/product-prices/product-prices.vue'

/**
 * Vue: Product card
 * -----------------------------------------------------------------------------
 * Product card used throughout the site.
 *
 * @param {Boolean|Object} product - Product object, false shows loading state.
 *
 */
export default {
  name: 'ProductCard',

  components: {
    ResponsiveImage: responsiveImage,
    ProductPrices,
  },

  props: {
    product: {
      type: [Boolean, Object],
      default: false,
      required: true,
    },
    padding: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      selectedVariantIndex: 0,
      state: 'ready',
      selectedVariant: false,
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getComponentExists: 'components/getExists',
    }),
    cleanedTitle() {
      if (!this.product || !this.product.title) return ''
      // Remove trailing number + "ml"
      return this.product.title.replace(/\s\d+\s*ml$/, '')
    },
    variantTags() {
      if (!this.product?.tags) return []
      return this.product.tags.filter(tag =>
        tag.toLowerCase().startsWith('variant:')
      )
    },
  },

  watch: {
    selectedVariantIndex() {
      const selectedVariant = this.product.variants[this.selectedVariantIndex]

      if (!selectedVariant) {
        return
      }

      this.selectedVariant = selectedVariant
    },
  },

  mounted() {
    if (!this.product) {
      return
    }

    /**
     * Set component data on mount:
     *   - selectedVariantIndex
     *   - selectedVariant
     */
    const firstVariant = this.product.variants[0]
    const firstAvailableVariantIndex = this.product.variants.findIndex(variant => variant.available)
    const firstAvailableVariant = this.product.variants[firstAvailableVariantIndex]
    this.selectedVariantIndex = firstAvailableVariantIndex || 0
    this.selectedVariant = firstAvailableVariant || firstVariant
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      openOverlay: 'overlays/open',
      fetchUpsellProduct: 'upsell/fetchProduct',
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

    formatVariantTag(tag) {
      if (!tag) return ''
      // Remove "variant: " prefix
      let t = tag.replace(/^variant:\s*/i, '')
      // Extract last part matching your regex
      const match = t.match(/((\d+-x-\d+|\d+)-?[a-zA-Z]+|[a-zA-Z]+)$/)
      return (match?.[0] || '').replace(/-/g, ' ')
    },

    /**
     * Add to cart handler
     */
    async addItemToCart() {
      if (!this.selectedVariant) {
        return
      }

      if (!this.selectedVariant.available) {
        return
      }

      clearTimeout(this.timeout)
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
          id: this.selectedVariant.id,
          quantity: 1,
        },
      ]

      if (this.product.upsellType !== null) {
        if (typeof this.product.upsellProduct === 'string') {
          await this.fetchUpsellProduct(this.product.upsellProduct)
        } else {
          this.setUpsellProduct(this.product.upsellProduct)
        }

        this.setUpsellType(this.product.upsellType)
        this.setTitle(this.product.upsellTitle)
        this.setDescription(this.product.upsellDescription)

        if (this.product.upsellType === 'true' || this.product.upsellType === true) {
          this.setOriginalItemProperties(items)
          this.openOverlay({
            component: 'upsell-popup',
            ignoreDismissed: true,
            namespace: 'upsellPopup',
          })
          this.state = 'added'

          return
        }
      }

      try {
        await this.addItem(items)
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
