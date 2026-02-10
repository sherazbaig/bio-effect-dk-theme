<template>
  <div
    class="main-product critical-component-clear mt-s"
    :class="{ [$class('loading')]: state === 'loading' }"
  >
    <div class="grid">
      <div
        id="product-gallery"
        class="col xs-span l8"
        data-sign-post-location="main"
        js-sign-post
      >
        <div
          class="main-product__featured-images"
          :class="animationClass"
        >
          <responsive-image
            v-if="activeImageIndex === false"
            class="main-product__main-image"
            :image="featuredImage"
            min-max="343-770"
            ratio="7:5"
          />

          <responsive-image
            v-for="(media, index) of product.media"
            v-show="activeImageIndex === index && !featuredImage"
            :key="`${media.id}-main`"
            class="main-product__main-image"
            :lazyload="false"
            :image="media.image"
            min-max="343-770"
            ratio="7:5"
          />

          <div
            v-if="product.badge && !freeGiftBadge"
            class="main-product__badge"
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
            v-else-if="freeGiftBadge || product.badge_text"
            class="main-product__badgeText"
            :style="{ backgroundColor: freeGiftBadge.badge_color || product.badge_color }"
          >
            <span
              class="text-tags"
              v-text="freeGiftBadge.badge_text || product.badge_text"
            />
          </div>

          <div class="main-product__awards">
            <div
              v-for="(award, index) of liquid.awards"
              :key="index"
              class="main-product__award"
            >
              <responsive-image
                lazyload
                :padding="false"
                :image="award"
                min-max="64-120"
                ratio="1:1"
              />
            </div>
          </div>
        </div>

        <div
          v-if="product.media?.length > 1"
          class="main-product__images mt-m"
          :style="[product.media.length > 5 ?
            { gridTemplateColumns:`repeat(${product.media.length}, 1fr)` } :
            { gridTemplateColumns: 'repeat(5, 1fr)'}
          ]"
        >
          <responsive-image
            v-for="(media, index) of product.media"
            :key="media.id"
            class="main-product__image"
            :class="{
              'main-product__image--active':
                activeImageIndex === index ||
                (activeImageIndex === false && index === 0),
            }"
            :image="media.image"
            tabindex="0"
            :aria-label="$string('product.images.change_image')"
            role="button"
            :ratio="isMobile ? '1:1' : '8:5'"
            @click="handleImageClick(index)"
            @keyup.enter.space="handleImageClick(index)"
          />
        </div>
      </div>

      <div class="col xs-span l5">
        <breadcrumbs
          v-if="categories"
          class="mb-xl mt-xs"
          :items="categories"
          :state="state"
          :title="product.title || liquid.title"
        />

        <star-rating
          :product="product"
          :star-rating-id="starRatingId"
        />

        <div class="main-product__details">
          <h1
            id="template-title"
            class="
              main-product__title
              text-mobile-titles
              text-h2-desktop
            "
            v-text="product.title || liquid.title"
          />

          <div
            class="main-product__description text-p-desktop text-mobile-p rte"
            v-html="product.description || liquid.description"
          />

          <product-prices
            ref="prices"
            class="main-product__prices-container"
            :available="variant.available"
            :compare-at-price="variant.compareAtPrice?.amount"
            class-compare-at-price="main-product__compare-price"
            class-price="main-product__price"
            :price="variant.price?.amount || liquid.selectedOrFirstAvailableVariant?.price?.amount"
            :varies="variant.price?.varies || liquid.selectedOrFirstAvailableVariant?.price?.varies"
          />
        </div>

        <product-form
          class="main-product__form"
          :product="product || liquid"
          :variant="variant"
          @update-variant="handleVariantUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Main product
 * -----------------------------------------------------------------------------
 * Main product page component.
 *
 * @param {Object|Array} categories - Categories for the product.
 * @param {Object} liquid - Formatted product Liquid object.
 * @param {Object|Boolean} product - Canvas formatted product object.
 * @param {Object|Boolean} variant - Canvas formatted variant object.
 *
 * @emits updateRequestObject - Emit new product object.
 *
 */
import { mapState } from 'vuex'

import Breadcrumbs from '~async/breadcrumbs/breadcrumbs'
import StarRating from '~async/star-rating/star-rating'
import ResponsiveImage from '~global/images/responsive-image'
import ProductForm from '~async/product-form/product-form'
import ProductPrices from '~global/product-prices/product-prices'

import productQuery from '~graphql/product.gql'
import { formatProduct } from '~/helpers/format'
import { emitUpdateRequestObject } from '~/helpers/vue'

export default {
  name: 'MainProduct',

  components: {
    Breadcrumbs,
    StarRating,
    ProductForm,
    ProductPrices,
    ResponsiveImage,
  },

  props: {
    categories: {
      type: [Boolean, Array],
      default: false,
    },
    liquid: {
      type: Object,
      default: () => ({
        description: '',
        price: 0,
        title: '',
      }),
    },
    product: {
      type: [Boolean, Object],
      default: false,
    },
    variant: {
      type: [Boolean, Object],
      default: false,
    },
    starRatingId: {
      type: String,
      default: '',
    },
  },

  emits: {
    'update-request-object': emitUpdateRequestObject,
  },

  data() {
    return {
      animationClass: '',
      currentIndex: 0,
      currentNamespace: 'gallery',
      featuredImage: this.product.featuredImage,
      activeImageIndex: false,
      handle: cnvs.page.handle,
      state: 'loading',
      imageChangeInProgress: false,
      freeGiftBadge: false,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      isMobile: (state) => state.index.screen.mobile,
    }),
  },

  watch: {

    /**
     * Watch handle for update to load new product.
     */
    handle() {
      this.queryProduct(this.handle)
    },

    product() {
      this.featuredImage = this.product.featuredImage

      this.setRecentlyViewed()
    },

    variant() {
      this.setVariantFeaturedImage()
      this.setFreeGiftBadge()
    },
  },

  mounted() {
    this.setProduct()
    this.setPricesPlace()
    this.setRecentlyViewed()
  },

  methods: {

    /**
     * Sets viewed products to local storage.
     */
    setRecentlyViewed() {
      if (!this.product) {
        return
      }

      const viewed = JSON.parse(
        localStorage.getItem('recentlyViewed'),
      ) || []

      if (viewed.some((item) => item.url === this.product.url)) {
        return
      }

      if (viewed.length >= 4) {
        viewed.shift()
      }

      const details = {
        name: this.product.title,
        image: this.product.featuredImage.src,
        url: this.product.url,
      }

      viewed.unshift(details)

      localStorage.setItem('recentlyViewed', JSON.stringify(viewed))
    },

    /**
     * Sets variant image as featured image.
     */
    setVariantFeaturedImage() {
      if (!Object.keys(this.variant.image).length) {
        return
      }

      this.featuredImage = this.variant.image
      this.activeImageIndex = false
    },

    /**
     * Set Liquid product object to product.
     */
    setProduct() {
      if (!this.liquid.handle) {
        this.queryProduct()
        return
      }

      this.$emit('update-request-object', {
        response: this.liquid,
        type: 'product',
      })

      this.state = 'ready'
    },

    /**
     * Change place of the prices component.
     * Can't change it via Vue.
     * Because of product form includes variants and button.
     */
    setPricesPlace() {
      const button = document.querySelector('#product-form .button')

      if (!button) {
        return
      }

      button.insertAdjacentElement('beforebegin', this.$refs.prices.$el)
    },

    /**
     * Handle image update.
     * @param {number} index - New image index to show.
     */
    handleImageClick(index) {
      if (this.imageChangeInProgress) {
        return
      }

      this.imageChangeInProgress = true
      this.animationClass = 'enter-image'

      setTimeout(() => {
        this.imageChangeInProgress = false
        this.animationClass = ''
      }, 700)

      setTimeout(() => {
        this.featuredImage = false
        this.activeImageIndex = index
      }, 350)
    },

    /**
     * Loads product from GraphQL.
     * @param {String} [handle] - Product handle to load.
     */
    async queryProduct(handle = this.handle) {
      if (handle === false || this.product.handle === handle) {
        return
      }

      this.state = 'loading'

      try {
        const response = await cnvs.Query({
          query: productQuery,
          variables: {
            country: cnvs.store.country,
            handle,
            language: cnvs.store.language,
          },
        })

        if (cnvs.settings.disableComponentReadyState) {
          return
        }

        this.$emit('update-request-object', {
          response: formatProduct(response),
          type: 'product',
        })

        this.state = 'ready'

      } catch (error) {
        cnvs.ReportError('Failed to load product', error)
      }
    },

    /**
     * Update current carousel index.
     * @param {Number} newIndex - New carousel index.
     */
    handleUpdateCurrentIndex(newIndex) {
      if (newIndex === this.currentIndex) {
        return
      }

      this.currentIndex = newIndex
    },

    /**
     * Update current carousel namespace.
     * @param {String} newNamespace - New carousel namespace.
     */
    handleUpdateCurrentNamespace(newNamespace) {
      this.currentNamespace = newNamespace
    },

    /**
     * Handle variant update from product form.
     * @param {Object} variant - Selected variant.
     */
    handleVariantUpdate(variant) {
      this.$emit('update-request-object', {
        response: variant,
        type: 'variant',
      })

      const params = new URLSearchParams(document.location.search.substring(1))

      if (variant?.id) {
        params.set('variant', variant.id)
      }

      const variants = this.liquid?.variants || []

      // Do not add variant id as url param if product has only one variant.
      if (variants?.length < 2) {
        return
      }

      const url = variant?.id
        ? `${location.origin}${location.pathname}?${params.toString()}`
        : `${location.origin}${location.pathname}`

      history.replaceState({
        html: '',
      }, '', url)
    },

    /**
     * Add free gift badge
     */
    setFreeGiftBadge() {
      if (this.variant.fgwp && !this.variant.fgwp.thresholds) {
        this.freeGiftBadge = {
          badge_text: this.$string('cart.free_gift_with_purchase.fgwp'),
          badge_color: 'var(--color-bio)',
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import './main-product';
</style>
