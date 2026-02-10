<template>
  <div />
</template>

<script>

/**
 * Vue: Image with Link Carousel (image-link-carousel)
 * -----------------------------------------------------------------------------
 * Carousel of images and links with heading and optional CTA.
 * - Limited interactivity section.
 *
 * @param {String} sectionId - Section ID.
 *
 */
import Splide from '@splidejs/splide'
import { values as breakpoints } from '~/config/breakpoints'

export default {
  name: 'ImageLinkCarousel',

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
        type: 'slide',
        arrows: false,
        drag: 'free',
        gap: 'var(--spacing-m)',
        mediaQuery: 'min',
        pagination: false,
        perMove: 1,
        fixedWidth: '250px',
        speed: this.$timing('normal'),
        omitEnd: true,
        breakpoints: {
          [breakpoints.s]: {
            fixedWidth: '15rem',
          },
          [breakpoints.l]: {
            arrows: true,
            keyboard: true,
            gap: 'var(--spacing-xl)',
          },
        },
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
      const container = document.querySelector(`#vue-element [js-image-link-carousel="${this.sectionId}`)

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
@import './image-link-carousel';
</style>
