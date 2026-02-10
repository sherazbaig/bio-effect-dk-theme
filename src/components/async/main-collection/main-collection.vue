<template>
  <transition-group
    name="fade"
    appear
  >
    <div
      v-if="banner"
      class="main-collection__banner col xs6 l1-14"
      :class="[
        {
          [$class('loading')]: !banner,
        }
      ]"
    >
      <art-direction
        :image="banner.mobileImage"
        :image-desktop="banner.desktopImage"
        ratio="340:213"
        ratio-desktop="1371:286"
      />

      <div
        class="main-collection__bannerCopy"
        :class="banner.textTheme"
      >
        <h6
          class="main-collection__bannerTitle text-h2-desktop text-h6"
          v-text="banner.title"
        />

        <p
          class="main-collection__bannerDescription text-p-desktop text-p-xs-bold"
          v-text="banner.description"
        />

        <btn
          v-if="!(banner && (!banner.ctaText || !banner.ctaURL))"
          class="main-collection__bannerCTA text-button"
          :label="banner.ctaText"
          :url="banner.ctaURL"
        />
      </div>
    </div>
  </transition-group>

  <main-collection-filter-sidebar
    v-if="filtersLayout === 'yes' && collectionColumns === '3'"
    :filters="filters"
    :featured-collections="featuredCollections"
    :collection="collection"
    :collection-columns="collectionColumns"
    :applied-filters="appliedFilters"
    @toggle-filter="toggleFilter"
    @clear-filters="clearFilters"
  />

  <div
    class="main-collection__content col xs6"
    :class="collectionColumns === '3' ? 'l3-14' : 'l1-14'"
  >
    <div
      class="main-collection__header grid"
      :class="{ 'main-collection__header--four-columns': collectionColumns === '4' }"
    >
      <h1
        class="
          main-collection__title
          text-mobile-titles
          text-h1-desktop
          col xs6 l14
        "
        v-text="collection.title"
      />

      <div
        class="
          main-collection__description
          text-mobile-p
          text-h6-desktop
          col xs6 l14
          rte
        "
        :class="{ 'main-collection__horizontal-description': collectionColumns === '4' }"
        v-text="collection.description"
      />

      <div
        v-if="filteredBannerCards?.length"
        class="main-collection__link-cards col xs6 l14"
      >
        <div
          class="splide"
          js-splide="banner-carousel"
        >
          <div class="splide__track">
            <ul class="main-collection__link-cards-list splide__list">
              <li
                v-for="(bannerCard, index) of filteredBannerCards"
                :key="index"
                class="main-collection__link-card splide__slide"
              >
                <a
                  :href="bannerCard.url"
                  class="main-collection__link-card-link"
                >
                  <art-direction
                    v-if="bannerCard.image"
                    :image="bannerCard.image"
                    ratio="1:1"
                  />
                  <span
                    class="main-collection__link-card-title"
                  >
                    {{ bannerCard.title }}
                  </span>
                </a>
              </li>
            </ul>

            <div
              v-if="(collectionColumns === '4' && filteredBannerCards.length > 7)
                || (collectionColumns === '3' && filteredBannerCards.length > 4)"
              class="main-collection__carousel-footer mt-2"
            >
              <div class="splide__arrows">
                <btn
                  class="splide__arrow splide__arrow--prev"
                  modifiers="light reversed"
                  show-icon
                >
                  <template #icon>
                    <icon-arrow-left />
                  </template>
                </btn>

                <btn
                  class="splide__arrow splide__arrow--next"
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
      <main-collection-filter-sidebar
        v-if="filtersLayout === 'yes' && collectionColumns === '4'"
        class="main-collection__sidebar--horizontal-filter"
        :filters="filters"
        :featured-collections="featuredCollections"
        :collection="collection"
        :collection-columns="collectionColumns"
        :applied-filters="appliedFilters"
        @toggle-filter="toggleFilter"
        @clear-filters="clearFilters"
      />
    </div>

    <div
      v-if="status === 'loading' && !contentList.length"
      :class="`main-collection__grid main-collection__grid--${collectionColumns}`"
    >
      <div
        v-for="(placeholder, index) of loadingPlaceholders"
        :key="index"
        :class="[
          {
            'full-width': placeholder?.cardType === 'full-width-promo',
          }
        ]"
      >
        <product-card
          v-if="placeholder?.cardType === 'product'"
          :product="false"
        />

        <promo-card
          v-else-if="placeholder?.cardType === 'promo'"
          :card-data="false"
        />

        <full-width-promo
          v-else
          :card-data="false"
        />
      </div>
    </div>
    <transition-group
      v-else
      tag="div"
      name="card-fade"
      :class="`main-collection__grid main-collection__grid--${collectionColumns}`"
      appear
      :style="{ '--total': contentList.length }"
    >
      <div
        v-for="(content, index) of contentList"
        :key="index"
        :style="{'--animation-step': index - animationOffsetIndex }"
        :class="[
          {
            'full-width': content?.cardType === 'full-width-promo',
          }
        ]"
      >
        <product-card
          v-if="content?.cardType === 'product'"
          :product="content"
        />

        <promo-card
          v-else-if="content?.cardType === 'promo'"
          :card-data="content"
        />

        <full-width-promo
          v-else
          :card-data="content"
        />
      </div>
    </transition-group>

    <btn
      v-if="page.hasNextPage"
      class="main-collection__loadMore text-button"
      :class="[
        {
          [$class('loading')]: status === 'loading',
        },
      ]"
      :label="$string('collection.load_more')"
      type="button"
      @click="loadMore"
    />
  </div>
</template>

<script>

/**
 * Vue: Main collection (main-collection)
 * ----------------------------------------------------------------------------
 * Main collection page component.
 * - Static section.
 *
 * @param {Array} filters - Collection filters.
 * @param {Array} featuredCollections - Featured collections (PLP Nav).
 * @param {Boolean|Object} banner - Collection banner data.
 * @param {Boolean|Object} collection - Collection data.
 * @param {Boolean|Array} promos - Array of promos data.
 * @param {Boolean|Array} fullWidthPromos - Array of full width promos data.
 * @param {Boolean|Array} bannerCards - Array of link card data.
 * @param {Number} productsPerPage - Number of products to show in each page.
 *
 */

import { mapState } from 'vuex'
import collectionQuery from '~graphql/collection.gql'
import { debounce } from '~/helpers/general'
import { transformEdges } from '~/helpers/graphql'
import { formatProduct } from '~/helpers/format'
import { emitUpdateRequestObject } from '~/helpers/vue'

import ProductCard from '~global/product-card/product-card'
import ArtDirection from '~global/images/art-direction'
import Btn from '~global/btn/btn'
import PromoCard from '~async/promo-card/promo-card'
import FullWidthPromo from '~async/full-width-promo/full-width-promo'

import Splide from '@splidejs/splide'
import { values as breakpoints } from '~/config/breakpoints'
import IconArrowLeft from '~icons/directional-navigation/arrow/left.svg'
import IconArrowRight from '~icons/directional-navigation/arrow/right.svg'
import MainCollectionFilterSidebar from '~async/main-collection-filter-sidebar/main-collection-filter-sidebar.vue'

export default {
  name: 'MainCollection',

  components: {
    ProductCard,
    ArtDirection,
    Btn,
    PromoCard,
    FullWidthPromo,
    IconArrowLeft,
    IconArrowRight,
    MainCollectionFilterSidebar,
  },

  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    featuredCollections: {
      type: Array,
      default: () => [],
    },
    banner: {
      type: [Boolean, Object],
      default: false,
    },
    collection: {
      type: [Boolean, Object],
      default: false,
    },
    promos: {
      type: [Boolean, Array],
      default: false,
    },
    fullWidthPromos: {
      type: [Boolean, Array],
      default: false,
    },
    bannerCards: {
      type: [Boolean, Array],
      default: false,
    },
    productsPerPage: {
      type: Number,
      default: 12,
    },
    collectionColumns: {
      type: String,
      default: '4',
    },
    filtersLayout: {
      type: String,
      default: 'yes',
    },
  },

  emits: {
    'update-request-object': emitUpdateRequestObject,
  },

  data() {
    return {
      products: [],
      contentList: [],
      page: {
        hasNextPage: false,
      },
      appliedFilters: [],
      status: 'loading',
      animationOffsetIndex: 0,
      bannerCarousel: false,
      carouselConfig: {
        arrows: false,
        breakpoints: {
          [breakpoints.m]: {
            fixedWidth: null,
            gap: 'var(--layout-tablet-gutter)',
            perMove: 2,
            perPage: 2,
            speed: this.$timing ? this.$timing('normal') : 300,
          },
          [breakpoints.l]: {
            arrows: true,
            fixedWidth: null,
            keyboard: true,
            perMove: 4,
            perPage: 4,
          },
          [breakpoints.xl]: {
            arrows: true,
            fixedWidth: null,
            keyboard: true,
            perMove: 6,
            perPage: 6,
          },
        },
        mediaQuery: 'min',
        speed: this.$timing ? this.$timing('slow') : 500,
        type: 'slide',
        perMove: 1,
      },
      selectors: {},
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      headerState: (state) => state.index.scroll.header,
      settings: (state) => state.index.settings,
    }),

    filteredBannerCards() {
      return this.bannerCards?.filter(
        (bannerCard) => bannerCard.url && bannerCard.image && bannerCard.title,
      ) || []
    },

    /**
     * Loading placeholders for:
     *  - Product card.
     *  - Promo card.
     *  - Full width promo.
     */
    loadingPlaceholders() {
      const arr = [...Array(this.productsPerPage)]
      const placeholders = []
      let inGridPromosCount = 0

      arr.forEach((_, index) => {
        if (!this.appliedFilters.length) {
          inGridPromosCount =
            this.injectPromo(placeholders, index, inGridPromosCount)
          inGridPromosCount =
            this.injectFullWidthPromo(placeholders, index, inGridPromosCount)
        }

        placeholders.push({
          cardType: 'product',
        })
      })

      return placeholders
    },
  },

  watch: {

    /**
     * Watches the query value and when it changes call the
     * debounceCollectionQuery function
     */
    'appliedFilters.length'() {
      this.status = 'loading'
      this.products = []
      this.contentList = []
      this.page = {}
      this.animationOffsetIndex = 0

      this.debounceCollectionQuery()
    },

    /**
     * Watch filtered banner cards and refresh carousel
     */
    filteredBannerCards() {
      this.$nextTick().then(() => {
        this.refreshCarousel()
      })
    },
  },

  mounted() {
    this.debounceCollectionQuery =
      debounce(this.fetchCollection, this.settings.throttle)
    this.debounceCollectionQuery()

    // Initialize carousel after component is mounted
    this.$nextTick().then(() => {
      this.setSelectors()
      this.initCarousel()
    })
  },

  methods: {

    /**
     * Load More Button Click Handler.
     */
    loadMore() {
      this.status = 'loading'
      this.animationOffsetIndex = this.contentList.length
      this.debounceCollectionQuery()
    },

    /**
     * PLP filter toggle handler.
     * @param {Object} filter - filter object from filters array.
     */
    toggleFilter(filter) {
      const filterIndex = this.appliedFilters.indexOf(filter.value)
      if (filterIndex < 0) {
        this.appliedFilters.push(filter.value)
        return
      }

      this.appliedFilters.splice(filterIndex, 1)
    },

    /**
     * Clear all applied filters.
     */
    clearFilters() {
      this.appliedFilters = []
      this.products = []
      this.contentList = []
      this.page = {}

      this.debounceCollectionQuery()
    },

    /**
     * Fetch collection using collection handle.
     */
    fetchCollection() {
      const formattedFilters = this.appliedFilters.map(appliedFilter => {
        return {
          productType: appliedFilter,
        }
      })

      return new Promise(async(resolve, reject) => {
        try {
          const response = await cnvs.Query({
            query: collectionQuery,
            variables: {
              country: cnvs.store.country,
              language: cnvs.store.language,
              handle: this.collection.handle,
              after: this.page.cursor,
              first: this.productsPerPage,
              filters: [
                ...formattedFilters, {
                  productMetafield: {
                    namespace: 'seo',
                    key: 'hidden',
                    value: '0',
                  },
                },
              ],
            },
          })

          if (cnvs.settings.disableComponentReadyState) {
            resolve()
            return
          }

          const { products } = response?.collection ?? {}
          this.page.hasNextPage = products?.pageInfo?.hasNextPage
          this.page.cursor = products?.pageInfo?.endCursor
          this.contentList = this.formatContent(products)
          this.status = 'done'

          this.$emit('update-request-object', {
            response: true,
            type: 'collection',
          })

          resolve()

        } catch (error) {
          cnvs.ReportError('Failed to load menu', error)
          reject(error)
        }
      })
    },

    /**
     * Format PLP content - products & promos
     * @param {Object} products - Graphql products data.
     */
    formatContent(products) {
      const nodes = transformEdges(products)

      const formattedProductsNodes = nodes.map((node) => {
        return formatProduct({ product: node })
      })

      this.products = this.products.concat(formattedProductsNodes)
      const list = []
      let inGridPromosCount = 0

      this.products.forEach((product, index) => {
        if (!this.appliedFilters.length) {
          inGridPromosCount = this.injectPromo(list, index, inGridPromosCount)
          inGridPromosCount =
            this.injectFullWidthPromo(list, index, inGridPromosCount)
        }

        list.push({
          ...product,
          cardType: 'product',
        })
      })

      return list
    },

    /**
     * Inject Full Width Promo.
     */
    injectFullWidthPromo(list, productIndex, inGridPromosCount) {
      let count = inGridPromosCount
      const fullWidthPromoByIndex = this.fullWidthPromos
        .find(promo => promo.rowIndex * 3 === (productIndex + count))

      if (fullWidthPromoByIndex) {
        count += 3

        list.push(
          {
            ...fullWidthPromoByIndex,
            cardType: 'full-width-promo',
          },
        )

        return this.injectFullWidthPromo(list, productIndex, count)
      }

      return count
    },

    /**
     * Inject Promo Card.
     */
    injectPromo(list, productIndex, inGridPromosCount) {
      let count = inGridPromosCount
      const promoByIndex = this.promos
        .find(promo => promo.positionIndex === (productIndex + count))

      if (promoByIndex) {
        count += 1

        list.push(
          {
            ...promoByIndex,
            cardType: 'promo',
          },
        )

        return this.injectPromo(list, productIndex, count)
      }

      return count
    },

    /**
     * Set selectors for carousel
     */
    setSelectors() {
      const container = document.querySelector('#vue-element')

      if (!container) {
        return
      }

      this.selectors = {
        carousel: container.querySelector('[js-splide="banner-carousel"]'),
      }
    },

    /**
     * Initialize the banner carousel
     */
    initCarousel() {
      if (!this.selectors.carousel) {
        return
      }

      this.bannerCarousel = new Splide(this.selectors.carousel, this.carouselConfig)
      this.bannerCarousel.mount()
    },

    /**
     * Refresh carousel when data changes
     */
    refreshCarousel() {
      if (this.bannerCarousel) {
        this.$nextTick().then(() => {
          if (this.selectors.carousel && document.contains(this.selectors.carousel)) {
            this.bannerCarousel.refresh()
            const slides = this.selectors.carousel.querySelectorAll('.splide__slide')
            slides.forEach(slide => {
              slide.style.display = 'none'
              slide.style.display = ''
            })
          } else {
            this.setSelectors()
            this.initCarousel()
          }
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/components/splide';
@import './main-collection';
</style>
