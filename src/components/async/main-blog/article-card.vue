<template>
  <div class="article-card">
    <a
      :href="article.onlineStoreUrl"
      tabindex="-1"
    >
      <responsive-image
        class="article-card__image-container"
        :image="getUsableImage"
        min-max="300-800"
        :lazy-load="false"
        :ratio="ratio"
      />
    </a>

    <div class="article-card__footer">
      <ul
        v-if="badges.length > 0"
        class="article-card__badges"
      >
        <li
          v-for="(badge, index) of badges"
          :key="index"
        >
          <a
            class="article-card__badge text-tags"
            :href="getBadgeLink(badge, index)"
            v-text="badge"
          />
        </li>
      </ul>

      <h2
        class="
          article-card__title
          text-h5-desktop
          text-h6
        "
        :class="badges.length > 0 ? '' : 'mt-xl-desktop mt-l'"
        v-text="article.title"
      />

      <p
        class="
          article-card__excerpt
          text-p-desktop
          text-mobile-p
        "
        v-text="excerpt"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResponsiveImage from '~global/images/responsive-image'

/**
 * Vue: Blog tags (main-blog)
 * -----------------------------------------------------------------------------
 * Scrolls active blog tag into view.
 *
 * @param {Object} [article] - Current article value.
 * @param {String} [layout] - Article image layout.
 *
 */
export default {
  name: 'ArticleCard',

  components: { ResponsiveImage },

  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
    layout: {
      type: String,
      default: 'l4',
    },
  },

  data() {
    return {
      landscapeRatio: {
        desktop: '2:1',
        mobile: '4:3',
      },
      portraitRatio: {
        desktop: '1:1',
        mobile: '1:1',
      },
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Get Image ratio for current grid item
     *
     * @return {String}
     */
    ratio() {
      if (this.layout === 'l2-9' || this.layout === 'l6-13') {
        return this.isMobile ? this.landscapeRatio.mobile : this.landscapeRatio.desktop
      }

      return this.isMobile ? this.portraitRatio.mobile : this.portraitRatio.desktop
    },

    /**
     * Get Excerpt for current blog grid item
     *
     * @return {String}
     */
    excerpt() {
      const slicedContent = this.stripHtml(this.article.content).slice(0, 120)
      const slicedExcerpt = this.stripHtml(this.article.excerpt).slice(0, 120)

      if (slicedExcerpt.length > 0) {
        return `${slicedExcerpt}...`
      }

      if (slicedContent.length > 0) {
        return `${slicedContent}...`
      }

      return ''
    },

    /**
     * Refines and returns badges/tags.
     *
     * @return {Array}
     */
    badges() {
      const rawTags = this.article.tags
      const badges = []

      if (rawTags.length) {
        rawTags.forEach((tag) => {
          if (tag.includes('badge:')) {
            badges.push(tag.split('badge:')[1])

            return
          }

          badges.push(tag)
        })
      }

      return badges
    },

    /**
     * Return image object to be used for blog grid item.
     * Uses image from metafield for landscape image,
     * featured image for portrait.
     *
     * @return {Object}
     */
    getUsableImage() {
      if ((this.layout === 'l2-9' || this.layout === 'l6-13') && this.article.ladnscape_image) {
        return this.article.ladnscape_image.reference.field.reference.previewImage
      }

      return this.article.image
    },
  },

  methods: {

    /**
     * Badge link to be used on article card badges
     *
     * @return {String}
     */
    getBadgeLink(badge, index) {
      const blogHandle = window.location.pathname.split('blogs/').pop().split('/')[0]

      if (this.article.tags[index].includes('badge:')) {
        return `/blogs/${blogHandle}/tagged/badge-${badge.toLowerCase()}`
      }

      return `/blogs/${blogHandle}/tagged/${badge.toLowerCase()}`
    },

    /**
     * Strip article content of HTLM tags
     *
     * @return {String}
     */
    stripHtml(html) {
      const temporalDivEl = document.createElement('div')
      temporalDivEl.innerHTML = html

      return temporalDivEl.textContent || temporalDivEl.innerText || ''
    },
  },
}
</script>
