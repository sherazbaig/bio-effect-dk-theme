<template>
  <div />
</template>

<script>

/**
 * Vue: Product upsell carousel (product-upsell-carousel)
 * -----------------------------------------------------------------------------
 * Carousel of product cards with heading and optional CTA.
 * - Limited interactivity section.
 * - Modified from Canvas Library Liquid Carousel component.
 *
 */
import Splide from '@splidejs/splide'

import { values as breakpoints } from '~/config/breakpoints'

export default {
  name: 'ProductUpsellCarousel',

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
            arrows: true,
            gap: 'var(--spacing-xl)',
            perPage: 2,
          },
          [breakpoints.l]: {
            keyboard: true,
            perPage: 3,
          },
        },
        drag: 'free',
        gap: 'var(--spacing-m)',
        mediaQuery: 'min',
        pagination: false,
        perMove: 1,
        perPage: 1,
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
      const container = document.querySelector(`#vue-element [js-product-upsell-carousel="${this.sectionId}`)

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
@import '@/components/carousel';
@import './product-upsell-carousel';
</style>
