<template>
  <div />
</template>

<script>

/**
 * Vue: Quote and image (quote-and-image)
 * -----------------------------------------------------------------------------
 * Section used to show quotes with images.
 * - Limited interactivity section.
 *
 * @param {String} sectionId - Section ID.
 */
import { Splide } from '@splidejs/splide'
import breakpoints from '~/config/breakpoints'

export default {
  name: 'QuoteAndImage',

  props: {
    sectionId: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      mainCarousel: false,
      thumbnailCarousel: false,
      mainConfig: {
        arrows: false,
        rewind: true,
        pagination: false,
        type: 'fade',
        perPage: 1,
        autoHeight: true,
      },
      thumbnailConfig: {
        arrows: false,
        autoWidth: true,
        gap: 50,
        rewind: true,
        pagination: false,
        isNavigation: true,
        perPage: 6,
        breakpoints: {
          [breakpoints.l]: {
            gap: 35,
            perPage: 3,
          },
        },
      },
      selectors: {},
    }
  },

  mounted() {
    this.setSelectors()

    /**
     * Early return if not enough slides.
     * - Matches logic in liquid section that does not apply the splide classes
     *   if less than 2 slides.
     */
    if (this.selectors?.mainCarouselSlide.length < 2) {
      return
    }

    this.initCarousel()
    this.adjustSliderHeight()

    this.mainCarousel.on('move resize', () => {
      this.adjustSliderHeight()
    })
  },

  methods: {

    /**
     * Set selectors.
     */
    setSelectors() {
      const container = document.querySelector(`#vue-element [js-quote-slider="${this.sectionId}"]`)

      this.selectors = {
        container,
        mainCarousel: container.querySelector('[js-splide="main-carousel"]'),
        thumbnailCarousel: container.querySelector('[js-splide="thumbnails-carousel"]'),
        mainCarouselList: container.querySelector('[js-splide="main-carousel-list"]'),
        mainCarouselSlide: container.querySelectorAll('[js-splide="main-carousel-slide"]'),
      }
    },

    /**
     * Init Splide carousel.
     */
    initCarousel() {
      if (this.selectors.thumbnailCarousel) {
        this.thumbnailCarousel = new Splide(this.selectors.thumbnailCarousel, this.thumbnailConfig)
        this.thumbnailCarousel.mount()
      }

      if (this.selectors.mainCarousel) {
        this.mainCarousel = new Splide(this.selectors.mainCarousel, this.mainConfig)

        if (this.thumbnailCarousel) {
          this.mainCarousel.sync(this.thumbnailCarousel)
        }

        this.mainCarousel.mount()
      }
    },

    /**
     * Set slider height based on slider content height.
     */
    adjustSliderHeight() {
      const activeIndex = this.mainCarousel.index
      const activeSlide = this.selectors.mainCarouselSlide[activeIndex]

      if (!activeSlide) {
        return
      }

      const activeQuote = activeSlide.childNodes[0]
      const quoteHeight = activeQuote.offsetHeight
      this.selectors.mainCarouselList.style.height = `${quoteHeight}px`
    },
  },
}
</script>

<style lang="scss">
@import '@/components/splide';
@import './quote-and-image';
</style>
