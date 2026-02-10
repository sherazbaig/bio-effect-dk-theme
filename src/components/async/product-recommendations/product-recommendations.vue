<template>
  <div
    class="product-recommendations critical-component-hide"
    :js-product-recommendations="liquid.sectionId"
  >
    <div class="container grid">
      <div class="col xs6 m6 l2-13">
        <h2
          v-if="liquid.title"
          :id="`section-title-${liquid.sectionId}`"
          class="
            product-recommendations__title
            text-mobile-titles text-h2-desktop
            mb-l mb-3xl-desktop
          "
          v-text="liquid.title"
        />

        <div
          class="splide"
          js-splide="carousel"
        >
          <div class="splide__track">
            <ul class="product-recommendations__carousel splide__list">
              <li
                v-for="(localProduct, index) of localProducts"
                :key="`recommendations-${state === 'loading' ? index : localProduct.handle}`"
                class="product-recommendations__slide splide__slide"
              >
                <product-card :product="localProduct" />
              </li>
            </ul>

            <div class="product-recommendations__footer mt-l">
              <div class="product-recommendations__button-wrapper">
                <btn
                  v-if="liquid.buttonText"
                  :label="liquid.buttonText"
                  :url="liquid.buttonUrl"
                />
              </div>

              <div class="splide__arrows">
                <btn
                  class="splide__arrow splide__arrow--prev"
                  :label="$string('accessibility.carousel.previous')"
                  modifiers="light reversed"
                  show-icon
                >
                  <template #icon>
                    <icon-arrow-left />
                  </template>
                </btn>

                <btn
                  class="splide__arrow splide__arrow--next"
                  :label="$string('accessibility.carousel.next')"
                  modifiers="light reversed"
                  show-icon
                >
                  <template #icon>
                    <icon-arrow-right />
                  </template>
                </btn>
              </div>
            </div>
          </div>

          <ul class="splide__pagination" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Product recommendations (product-recommendations)
 * -----------------------------------------------------------------------------
 * Product recommendations section powered by Shopify recommendations API,
 * product list from dynamic source and section settings.
 * - Queries recommendations API for each product in cart and pulls a
 *   recommended product for each product in cart until product count is
 *   reached.
 *
 * @param {Object} [containerRef] - Component container reference.
 * @param {Boolean} [displayEmptyCart] - Display component on cart page when
 * cart is empty.
 * @param {Number|Array} liquid.productId - Product ID.
 * @param {String} liquid.sectionId - Section's Liquid ID.
 * @param {String} liquid.title - Section title.
 * @param {Number} [overrideProductId] - Overriding product ID, used instead of
 * current product or cart IDs when provided.
 * @param {Object|Boolean} product - Canvas formatted product object.
 * @param {Number} [productCount] - Number of products to display.
 * @param {Object} products - Object to define fallback products.
 * @param {Object} recommendations - Recommendation settings.
 *
 */
import { mapState } from 'vuex'
import Splide from '@splidejs/splide'
import productRecommendationsQuery from '~graphql/product-recommendations.gql'

import Btn from '~global/btn/btn'
import ProductCard from '~global/product-card/product-card'

import IconArrowLeft from '~icons/directional-navigation/arrow/left.svg'
import IconArrowRight from '~icons/directional-navigation/arrow/right.svg'

import { values as breakpoints } from '~/config/breakpoints'
import productQuery from '~graphql/product.gql'
import { formatProduct } from '~/helpers/format'

export default {
  name: 'ProductRecommendations',

  components: {
    Btn,
    IconArrowLeft,
    IconArrowRight,
    ProductCard,
  },

  props: {
    containerRef: {
      type: Object,
      default: () => ({}),
    },
    displayEmptyCart: {
      type: Boolean,
      default: false,
    },
    liquid: {
      type: Object,
      default: () => ({
        productId: 0,
        sectionId: '',
        title: '',
        buttonText: '',
        buttonUrl: '',
      }),
      required: true,
    },
    overrideProductId: {
      type: Number,
      default: 0,
    },
    product: {
      type: [Boolean, Object],
      default: false,
    },
    productCount: {
      type: Number,
      default: 4,
      required: true,
    },
    products: {
      type: Object,
      default: () => ({
        count: 0,
        dynamic: [],
        section: [],
      }),
      required: true,
    },
    recommendations: {
      type: Object,
      default: () => ({
        enable: true,
        type: 'RELATED',
      }),
      required: true,
    },
  },

  data() {
    return {
      carousel: false,
      config: {
        arrows: false,
        breakpoints: {
          [breakpoints.m]: {
            fixedWidth: null,
            gap: 'var(--layout-tablet-gutter)',
            perMove: 2,
            perPage: 2,
            speed: this.$timing('normal'),
          },
          [breakpoints.l]: {
            arrows: true,
            fixedWidth: null,
            gap: 'var(--spacing-xl)',
            keyboard: true,
            perMove: 3,
            perPage: 3,
          },
        },
        fixedWidth: '282px',
        gap: 'var(--layout-mobile-gutter)',
        mediaQuery: 'min',
        speed: this.$timing('slow'),
        type: 'slide',
        perMove: 1,
      },

      /**
       * If recommendations are disabled then use the correct number of
       * placeholder products.
       */
      localProducts: Array(
        !this.recommendations.enable && this.products.count < this.productCount
          ? this.products.count
          : this.productCount,
      ).fill(false),
      recommendedProducts: [],
      selectors: {},
      state: 'loading',
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
    }),

    /**
     * Compute cart handles.
     * @returns {Array}
     */
    cartHandles() {
      return this.isCart
        ? this.cart.items.map((item) => item.handle)
        : []
    },

    /**
     * Compute fallback products array.
     * @returns {Array}
     */
    fallbackProducts() {
      return [
        ...this.products.dynamic,
        ...this.products.section,
      ]
    },

    /**
     * Compute if on cart page.
     * @returns {Boolean}
     */
    isCart() {
      return cnvs.page.type === 'cart'
    },

    /**
     * Compute product ID.
     * @returns {Array}
     */
    productIds() {
      if (this.overrideProductId) {
        return [this.overrideProductId]
      }

      return this.isCart
        ? this.cart.items.map((item) => item.product_id)
        : [this.product?.id || this.liquid?.productId]
    },
  },

  watch: {

    /**
     * Watch local products and refresh the carousel.
     */
    async localProducts() {
      await this.$nextTick()
      this.carousel.refresh()
    },

    /**
     * Watch recommendation products to local products.
     * - Reduces down to product count if too many, no way to limit
     *   recommendation results in the storefront API query.
     * - If too few uses fallback products to meet product count.
     */
    recommendedProducts() {
      this.updateLocalProducts()
    },

    /**
     * Watch product IDs to update recommendations.
     * @param {Array} newValue - New value to compare.
     * @param {Array} oldValue - Old value.
     */
    productIds(newValue, oldValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
        return
      }

      this.queryRecommendations()
    },
  },

  mounted() {
    this.queryRecommendations()
    this.setSelectors()
    this.initCarousel()
  },

  methods: {

    /**
     * Query Shopify recommendations API.
     * - Hide component if recommendations are disabled and no fallback products
     *   have been provided.
     * - Can't query recommendations based on an array of product IDs so a query
     *   is made for each product in cart or a single product on PDP.
     * - Queries JSON API to retrieve custom URL parameters for analytics.
     */
    async queryRecommendations() {
      if (!this.recommendations.enable && !this.products.count) {
        this.hideComponent()
        return
      }

      this.containerRef.classList?.remove(this.$class('hidden'))
      this.state = 'loading'

      /**
       * If recommendations aren't enabled or product IDs array is empty then
       * load fallback products.
       */
      if (
        !this.recommendations.enable ||
        !this.productIds.filter(Boolean).length
      ) {
        this.updateLocalProducts()
        return
      }

      try {

        /**
         * Build array of recommendation arrays.
         * - Recommendation array exists for each product ID queried.
         */
        let queue = this.productIds.map((productId) => {
          return cnvs.Query({
            query: productRecommendationsQuery,
            variables: {
              country: cnvs.store.country,
              language: cnvs.store.language,
              productId: `gid://shopify/Product/${productId}`,
              intent: this.recommendations.type.toUpperCase(),
            },
          })
        })

        const promises = await Promise.allSettled(queue)

        queue = promises.map((promise) => {
          if (promise.status !== 'fulfilled') {
            return false
          }

          return promise.value.productRecommendations
        }).filter(Boolean)

        const recommendationArrays = await Promise.all(queue)

        if (cnvs.settings.disableComponentReadyState) {
          return
        }

        this.recommendedProducts = this.flattenRecommendationArrays(recommendationArrays)

      } catch (error) {
        cnvs.ReportError('Failed to load recommendations', error)
      }
    },

    /**
     * Flatten recommendations array.
     * @param {Array} arrays - Array of recommendations array for each product.
     * @returns {Array}
     */
    flattenRecommendationArrays(arrays) {
      const recommendations = []
      let index = 0

      /**
       * Go through each recommendation array pulling a product from each until
       * the product count is reached or recommendation arrays are empty.
       */
      while (recommendations.length < this.productCount && arrays.length) {
        arrays.forEach((array, arrayIndex) => {
          if (!array[index]) {
            arrays.splice(arrayIndex, 1)
            return
          }

          const alreadyExists = recommendations.find((product) => {
            return product.handle === array[index].handle
          })

          if (alreadyExists || this.cartHandles.includes(array[index].handle)) {
            return
          }

          if (array[index]?.hidden?.value === '1') {
            return
          }

          recommendations.push(formatProduct({ product: array[index] }))
        })

        index++
      }

      return recommendations
    },

    /**
     * Update local products.
     * - Runs when recommended products updates or recommendations are disabled.
     */
    async updateLocalProducts() {
      let localProducts = []

      if (
        this.recommendedProducts.length >= this.productCount ||
        !this.fallbackProducts.length
      ) {
        localProducts = this.recommendedProducts

      } else {
        localProducts = typeof this.fallbackProducts[0] === 'object'
          ? this.buildLocalProductsFromObjects()
          : await this.buildLocalProductsFromHandles()
      }

      this.localProducts = localProducts.slice(0, this.productCount)

      /**
       * Hide component if no local products after all products are loaded.
       * - Or if cart is empty and setting not enabled.
       */
      if (
        !this.localProducts.length ||
        (cnvs.page.type === 'cart' && !this.cart.item_count && !this.displayEmptyCart)
      ) {
        this.hideComponent()
        return
      }

      this.state = 'ready'
    },

    /**
     * Build local products when this.fallbackProducts is an array of objects.
     * - Assumes that objects are correctly formatted.
     * - Builds array of unique objects and removes products which match base
     *   product ID.
     * @returns {Array}
     */
    buildLocalProductsFromObjects() {
      const objects = [
        ...this.recommendedProducts,
        ...this.fallbackProducts,
      ]

      const uniqueObjects = Array
        .from(new Set(objects))
        .filter((product) => {
          return !this.productIds.includes(product.id)
        })

      return uniqueObjects
    },

    /**
     * Build local products when this.fallbackProducts is an array of strings.
     * - Assumes that strings are product handles.
     * - Builds array of unique handles
     * - Loads only those that need loading.
     * @returns {Promise}
     */
    buildLocalProductsFromHandles() {
      return new Promise(async(resolve, reject) => {
        try {
          const products = this.recommendedProducts

          /**
           * Go through fallback products.
           * - Ensure the product does not exist already.
           * - Load product.
           * - Ensure product does not match base product ID.
           */
          for (const fallbackHandle of this.fallbackProducts) {
            if (products.length === this.productCount) {
              break
            }

            const alreadyExists = products.find((product) => {
              return fallbackHandle === product.handle
            })

            if (alreadyExists) {
              continue
            }

            // eslint-disable-next-line no-await-in-loop
            const response = await cnvs.Query({
              query: productQuery,
              variables: {
                country: cnvs.store.country,
                handle: fallbackHandle,
                language: cnvs.store.language,
              },
            })

            const fallbackProduct = formatProduct(response)

            if (this.productIds.includes(fallbackProduct.id)) {
              continue
            }

            products.push(fallbackProduct)
          }

          resolve(products)

        } catch (error) {
          reject(error)
        }
      })
    },

    /**
     * Hide component when it's empty.
     */
    hideComponent() {
      this.containerRef.classList?.add(this.$class('hidden'))
      this.state = 'ready'
    },

    /**
     * Set selectors.
     */
    setSelectors() {
      const container = document.querySelector(`#vue-element [js-product-recommendations="${this.liquid.sectionId}`)

      this.selectors = {
        container,
        carousel: container.querySelector('[js-splide="carousel"]'),
      }
    },

    /**
     * Init Splide carousel.
     */
    initCarousel() {
      if (!this.selectors.carousel) {
        return
      }

      this.carousel = new Splide(this.selectors.carousel, this.config)
      this.carousel.mount()
    },
  },
}
</script>

<style lang="scss">
@import '@/components/splide';
@import './product-recommendations';
</style>
