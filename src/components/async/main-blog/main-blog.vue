<template>
  <div class="main-blog__grid grid container">
    <div
      v-for="(article, index) of articles"
      :key="index"
      class="col xs-span m3"
      :class="articleWidth(index + 1)"
    >
      <article-card
        :article="article"
        class="main-blog__article"
        :layout="articleWidth(index + 1)"
      />
    </div>
  </div>

  <div
    v-if="showMoreButtonVisible"
    class="main-blog__load-container container"
  >
    <button
      class="main-blog__load button button--primary"
      type="button"
      @click.prevent="loadBlogs"
    >
      <span v-text="$string('blog.load_more')" />
    </button>
  </div>
</template>

<script>

/**
 * Vue: Main blog (main-blog)
 * -----------------------------------------------------------------------------
 * Blog page section.
 * - Initialises blog tags functionality.
 *
 */
import ArticleCard from '~async/main-blog/article-card'
import blogsQuery from '~graphql/blogs.gql'

export default {
  name: 'MainBlog',

  components: { ArticleCard },

  data() {
    return {
      blogLoadCount: 10,
      currenPageIndex: 1,
      showMoreButtonVisible: false,
      articles: [],
    }
  },

  created() {
    this.loadBlogs()
  },

  methods: {

    /**
     * Loads blogs once page loaded and when show more button clicked
     *
     */
    loadBlogs() {
      return new Promise(async(resolve, reject) => {
        try {
          const variables = {
            page: this.currenPageIndex * this.blogLoadCount,
            handle: window.location.pathname.split('blogs/').pop().split('/')[0],
          }
          const currentTagPath = window.location.pathname.split('tagged/').pop()

          if (window.location.pathname.includes('tagged/') && currentTagPath !== '') {
            variables.tag = `tag:${currentTagPath}`

            if (currentTagPath.includes('badge-')) {
              variables.tag = `tag:"${currentTagPath.replace('badge-', 'badge:')}"`
            }
          }

          const response = await cnvs.Query({
            query: blogsQuery,
            variables,
          })

          if (cnvs.settings.disableComponentReadyState) {
            return
          }

          const arrayOfArticlePages = response.blogs.nodes
          const currentPageData = arrayOfArticlePages[0].articles

          this.articles = currentPageData.nodes
          this.showMoreButtonVisible = currentPageData.pageInfo.hasNextPage
          this.currenPageIndex++

          resolve()

        } catch (error) {
          cnvs.ReportError('Failed to load blog list', error)
          reject(error)
        }
      })
    },

    /**
     * Article value in terms of grid layout
     *
     * @return {String}
     */
    articleWidth(index) {
      const remainder = index % 10
      let articleWidth = 'l4'

      if (remainder === 1) {
        articleWidth = 'l2-9'
      } else if (remainder === 7) {
        articleWidth = 'l6-13'
      } else if (remainder === 3 || remainder === 8 || remainder === 6) {
        articleWidth = 'l2-5'
      }

      return articleWidth
    },
  },
}
</script>

<style lang="scss">
@import '@/components/pagination';
@import './article-card';
@import '~async/utils/selection-tab/selection-tab';
@import './blog-tags';
// Blog tags' styles imported in blog tags components
@import './main-blog';
</style>
