<template>
  <div class="article-item">
    <a :href="article.url">
      <div class="article-item__image mb-l mb-xl-desktop">
        <responsive-image
          :image="article.image"
          ratio="10:11"
        />
      </div>
    </a>

    <ul
      v-if="badges.length > 0"
      class="article-item__badges"
    >
      <li
        v-for="(badge, index) of badges"
        :key="`article-${article.handle}-badge-${index}`"
      >
        <a
          class="article-item__badge text-tags"
          :href="badge.url"
          v-text="badge.title"
        />
      </li>
    </ul>

    <a
      class="article-item__title mt-m"
      :href="article.url"
    >
      <h3
        class="text-h6 text-h5-desktop"
        v-text="article.title"
      />

      <div
        class="article-item__excerpt text-mobile-p text-p-desktop mt-m mt-l-desktop"
        v-html="article.excerpt"
      />
    </a>
  </div>
</template>

<script>

/**
 * Vue: Article item (article-item)
 * -----------------------------------------------------------------------------
 * Blog article snippet.
 *
 * @param {Object} article - Liquid article.
 */
import ResponsiveImage from '~global/images/responsive-image'

import { convertToHandle } from '~/helpers/convert'

export default {
  name: 'ArticleItem',

  components: {
    ResponsiveImage,
  },

  props: {
    article: {
      type: Object,
      required: true,
    },
  },

  computed: {

    /**
     * Compute badges from article tags.
     * @returns {Array}
     */
    badges() {
      if (!this.article || !this.article.tags || this.article.tags.length === 0) {
        return []
      }

      const badges = []
      this.article.tags.forEach((tag) => {
        if (tag.startsWith('badge:')) {
          const tmpTitle = tag.split('badge:').pop()
          const title = tmpTitle.charAt(0).toUpperCase() + tmpTitle.slice(1)
          const handle = convertToHandle(tag)
          const url = `${this.blogUrl}/tagged/${handle}`
          badges.push({ title, url })
        }
      })

      return badges
    },

    /**
     * Compute blog url from article.
     * @returns {String}
     */
    blogUrl() {
      const linkToArray = this.article.url.split('/')
      linkToArray.pop()
      return linkToArray.join('/')
    },
  },
}
</script>

<style lang="scss">
@import './article-item';
</style>
