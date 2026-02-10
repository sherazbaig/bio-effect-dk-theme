<template>
  <div />
</template>

<script>

/**
 * Vue: Articles slider (articles-slider)
 * -----------------------------------------------------------------------------
 * Example component using Liquid to render and Vue to init carousel.
 * - Static section.
 *
 * @param {String} sectionId - Section ID.
 */
import Splide from '@splidejs/splide'

import { values as breakpoints } from '~/config/breakpoints'

export default {
  name: 'ArticlesSlider',

  props: {
    sectionId: {
      type: String,
      default: '',
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
          },
          [breakpoints.l]: {
            arrows: true,
            fixedWidth: null,
            gap: 'var(--spacing-xl)',
            keyboard: true,
            perMove: 1,
            perPage: 3,
          },
        },
        fixedWidth: '283px',
        gap: 'var(--layout-mobile-gutter)',
        mediaQuery: 'min',
        speed: this.$timing('normal'),
        type: 'slide',
      },
      selectors: {},
    }
  },

  mounted() {
    this.setSelectors()
    this.initCarousel()
  },

  methods: {

    /**
     * Set selectors.
     */
    setSelectors() {
      const container = document.querySelector(`#vue-element [js-articles-slider="${this.sectionId}`)

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
@import '../article-item/article-item';
@import './articles-slider';
</style>
