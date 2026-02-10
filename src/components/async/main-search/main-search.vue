<template>
  <div class="main-search__header">
    <form
      :action="$variable('routes.search')"
      method="get"
      role="search"
      class="main-search__form"
    >
      <label
        class="visually-hidden"
        for="search-input"
        v-text="$string('search.placeholder')"
      />

      <input
        id="search-input"
        ref="search"
        v-model="query"
        class="main-search__input text-h2-desktop text-h6"
        type="text"
        name="q"
        :placeholder="$string('search.placeholder')"
        required
      >

      <btn
        class="main-search__submit"
        :label="$string('search.submit')"
        class-label="main-search__submit--label text-p-small"
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
      v-if="query && status === 'done'"
      class="main-search__description text-p"
      v-text="$string('search.result_count', {
        pluralise: resultsCount,
        replace: { count: resultsCount }
      })"
    />
    <p
      v-if="!query"
      class="main-search__description text-p"
      v-text="$string('search.empty_html')"
    />
  </div>

  <div class="main-search__body">
    <div
      v-if="query && results.length === 0 && status === 'loading'"
      class="main-search__results"
    >
      <inline-card
        v-for="(_, index) of Array(12)"
        :key="index"
        :card-data="false"
      />
    </div>
    <transition-group
      v-else
      tag="div"
      name="card-fade"
      class="main-search__results"
      appear
    >
      <div
        v-for="(result, index) of results"
        :key="result.id"
        :style="{'--animation-step': index - animationOffsetIndex }"
      >
        <inline-card :card-data="result" />
      </div>
    </transition-group>

    <div
      v-if="showUpSellProducts"
      class="main-search__upsell"
    >
      <product-card
        v-for="upSellProduct of liquid.upSellProducts"
        :key="upSellProduct.id"
        :product="upSellProduct"
      />
    </div>

    <div class="main-search__load-more-wrapper">
      <btn
        v-if="page.hasNextPage"
        class="main-search__load-more text-button"
        :class="[
          {
            [$class('loading')]: status === 'loading',
          },
        ]"
        :label="$string('search.load_more')"
        type="button"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script>

/**
 * Vue: Main search (main-search)
 * -----------------------------------------------------------------------------
 * Main search page component.
 * - Static section.
 *
 */
import { nextTick } from 'vue'
import { mapState } from 'vuex'
import searchQuery from '~graphql/search.gql'
import { debounce } from '~/helpers/general'
import { transformEdges } from '~/helpers/graphql'
import { formatProduct } from '~/helpers/format'

import ProductCard from '~global/product-card/product-card'
import InlineCard from '~async/inline-card/inline-card'
import LinkArrow from '~icons/directional-navigation/link-arrow.svg'
import Btn from '~global/btn/btn'

export default {
  name: 'MainSearch',

  components: {
    ProductCard,
    InlineCard,
    Btn,
    LinkArrow,
  },

  props: {
    liquid: {
      type: Object,
      default: () => ({
        upSellProducts: false,
      }),
    },
  },

  data() {
    return {
      query: '',
      results: [],
      resultsCount: 0,
      page: {
        hasNextPage: false,
      },
      status: 'loading',
      animationOffsetIndex: 0,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      settings: (state) => state.index.settings,
    }),

    /**
     * Boolean flag to show up sell products.
     */
    showUpSellProducts() {
      return this.query &&
        this.liquid.upSellProducts?.length &&
        (this.results.length || this.status === 'loading')
    },
  },

  watch: {

    /**
     * Watches the query value and when it changes call the
     * debounceSearch function
     */
    query() {
      if (this.query === '') {
        this.resetSearch()
        return
      }

      this.results = []
      this.page = {}
      this.status = 'loading'
      this.animationOffsetIndex = 0
      this.debounceSearch()
    },
  },

  mounted() {
    this.debounceSearch = debounce(this.performSearch, this.settings.throttle)
    this.query = new URLSearchParams(document.location.search).get('q')

    nextTick().then(() => {
      this.$refs.search.focus()
    })
  },

  methods: {

    /**
     * Load More Button Click Handler.
     */
    loadMore() {
      this.status = 'loading'
      this.animationOffsetIndex = this.results.length
      // Passing true to set loadMore arg to true.
      this.debounceSearch(true)
    },

    /**
     * Reset Search State
     */
    resetSearch() {
      this.results = []
      this.page = {}
      this.status = 'ready'
      this.animationOffsetIndex = 0
    },

    /**
     * Performs the search and sets the results
     */
    performSearch(loadMore = false) {
      return new Promise(async(resolve, reject) => {
        try {
          const response = await cnvs.Query({
            query: searchQuery,
            variables: {
              country: cnvs.store.country,
              language: cnvs.store.language,
              query: this.query,
              after: this.page.cursor,
              first: 10,
            },
          })

          if (cnvs.settings.disableComponentReadyState || !this.query) {
            this.resetSearch()
            resolve()
            return
          }

          const { search } = response ?? {}
          const newResults = this.formatResults(search)
          this.results = loadMore ? this.results.concat(newResults) : newResults
          this.resultsCount = search?.totalCount

          this.page.hasNextPage = search?.pageInfo?.hasNextPage
          this.page.cursor = search?.pageInfo?.endCursor
          this.status = 'done'
          resolve()
        } catch (error) {
          cnvs.ReportError('Failed to load menu', error)
          reject(error)
        }
      })
    },

    /**
     * Format Search Results.
     */
    formatResults(search) {
      const nodes = transformEdges(search)

      return nodes.map((node) => {
        if (node.nodeType !== 'Product') {
          return node
        }

        return formatProduct({ product: node })
      })
    },
  },
}
</script>

<style lang="scss">
@import './main-search';
</style>
