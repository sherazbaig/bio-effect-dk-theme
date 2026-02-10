<template>
  <div class="predictive-search container grid">
    <button
      type="button"
      class="predictive-search__close"
      @click.prevent="() => closeOverlay('predictiveSearchOverlay')"
    >
      <icon-close />
    </button>

    <div class="predictive-search__header col xs6 l3-12">
      <form
        :action="$variable('routes.search')"
        method="get"
        role="search"
        class="predictive-search__form"
      >
        <label
          class="visually-hidden"
          for="predictive-search"
          v-text="$string('search.placeholder')"
        />

        <input
          id="predictive-search"
          ref="search"
          v-model="query"
          class="predictive-search__input text-h3"
          type="text"
          name="q"
          :placeholder="$string('search.placeholder')"
          required
        >

        <btn
          class="predictive-search__submit"
          :label="$string('search.submit')"
          class-label="predictive-search__submit--label text-p-small"
          type="submit"
          show-icon
          modifiers="text center"
        >
          <template #icon>
            <link-arrow />
          </template>
        </btn>
      </form>

      <p
        v-if="results.length === 0 && searchStatus === 'done'"
        class="predictive-search__count text-p"
        v-html="noResultsString"
      />
    </div>

    <div class="predictive-search__body  col xs6 l3-12">
      <div
        v-if="results.length === 0 && searchStatus === 'loading'"
        class="predictive-search__results"
      >
        <div
          v-for="(_, index) of Array(3)"
          :key="index"
        >
          <inline-card :card-data="false" />
        </div>
      </div>

      <transition-group
        v-else
        tag="div"
        name="card-fade"
        appear
        class="predictive-search__results"
      >
        <div
          v-for="(product, index) of results"
          :key="index"
          :style="{'--animation-step': index }"
        >
          <inline-card :card-data="product" />
        </div>
      </transition-group>

      <div
        v-if="upSellProduct && (results.length || searchStatus === 'loading')"
        class="predictive-search__upsell"
      >
        <product-card :product="upSellProduct" />
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: search (search-native)
 * -----------------------------------------------------------------------------
 * Native search component with input and results.
 *
 * @param {Boolean} isActive - Is Predictive search overlay active.
 * @param {Boolean|Object} upSellProduct - up sell products.
 */
import { nextTick } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import IconClose from '~icons/directional-navigation/close.svg'
import LinkArrow from '~icons/directional-navigation/link-arrow.svg'

import ProductCard from '~global/product-card/product-card'
import InlineCard from '~async/inline-card/inline-card'
import Btn from '~global/btn/btn'
import { debounce } from '~/helpers/general'
import predictiveSearchQuery from '~graphql/predictive-search.gql'
import { formatArticle, formatPage, formatProduct } from '~/helpers/format'

export default {
  name: 'PredictiveSearch',

  components: {
    ProductCard,
    InlineCard,
    Btn,
    IconClose,
    LinkArrow,
  },

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    upSellProduct: {
      type: [Boolean, Object],
      default: false,
    },
  },

  data() {
    return {
      query: '',
      results: [],
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      settings: (state) => state.index.settings,
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Map Vuex Getters.
     */
    ...mapGetters({
      searchStatus: 'search/getSearchStatus',
    }),

    /**
     * Transforms the string for no results to include the query
     * @returns {String}
     */
    noResultsString() {
      return this.$string('search.no_results_html')
        .replace('{query}', this.query)
    },
  },

  watch: {

    /**
     * Watches isMobile value and closes overlay if isMobile true
     */
    isMobile() {
      if (this.isMobile) {
        this.closeOverlay('predictiveSearchOverlay')
      }
    },

    /**
     * Watches the query value and when it changes call the
     * debounceSearch function
     */
    query() {
      this.setSearchStatus('loading')

      if (this.query === '') {
        this.results = []
        this.setSearchStatus('ready')
        return
      }

      this.debounceSearch()
    },

    isActive() {
      if (this.isActive) {
        nextTick().then(() => {
          this.$refs.search.focus()
        })

        return
      }

      nextTick().then(() => {
        this.query = ''
      })
    },
  },

  mounted() {
    this.debounceSearch = debounce(this.performSearch, this.settings.throttle)
  },

  methods: {
    ...mapActions({
      setSearchStatus: 'search/setSearchStatus',
      closeOverlay: 'overlays/close',
    }),

    /**
     * Performs the search and sets the results
     */
    performSearch() {
      return new Promise(async(resolve, reject) => {
        try {
          const response = await cnvs.Query({
            query: predictiveSearchQuery,
            variables: {
              country: cnvs.store.country,
              language: cnvs.store.language,
              query: this.query,
            },
          })

          if (cnvs.settings.disableComponentReadyState || !this.query) {
            resolve()
            return
          }

          const { products, articles, pages } = response.predictiveSearch

          const formattedProducts = products.map((product) => formatProduct({ product }))
          const formattedArticles = articles.map((article) => formatArticle({ article }))
          const formattedPages = pages.map((page) => formatPage({ page }))
          this.results = [...formattedProducts, ...formattedArticles, ...formattedPages]

          this.setSearchStatus('done')
          resolve()

        } catch (error) {
          cnvs.ReportError('Failed to load menu', error)
          this.setSearchStatus('ready')
          reject(error)
        }
      })
    },
  },
}
</script>

<style lang="scss">
  @import './predictive-search';
</style>
