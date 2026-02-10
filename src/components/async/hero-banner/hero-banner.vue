<template>
  <div />
</template>

<script>

/**
 * Vue: Hero banner (hero-banner)
 * -----------------------------------------------------------------------------
 * Carousel of images or video with text.
 * - Static section.
 *
 * @param {String} sectionId - Section ID.
 */
import { Splide } from '@splidejs/splide'
import { values } from '~/config/breakpoints'
import classes from '~/config/classes'
import { CustomHeroBannerTransition } from './hero-banner-transition'

export default {
  name: 'HeroBanner',

  props: {
    sectionId: {
      type: String,
      default: '',
    },
    autoplaySpeed: {
      type: [String, Number],
      default: '4500',
    },
    paginationIcon: {
      type: String,
      default: '',
    },
    slideCountToShow: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      carousel: false,
      config: {
        autoHeight: true,
        classes: {
          page: 'splide__pagination__page hero-banner__page',
        },
        height: '100%',
        pagination: true,
        type: 'fade',
        autoplay: true,
        drag: false,
        arrows: true,
        perPage: 1,
        rewind: true,
        interval: this.autoplaySpeed,
        speed: 0,
        pauseOnHover: false,
        pauseOnFocus: false,
        resetProgress: false,
        breakpoints: {
          [values.l]: {
            drag: true,
            noDrag: 'a, p, h2, span, .no-drag, div.hero-banner__slide-content-wrapper',
            autoplay: true,
            arrows: false,
            type: 'fade',
            perPage: 1,
            interval: this.autoplaySpeed,
          },
        },
      },
      selectors: {},
    }
  },

  mounted() {
    this.setSelectors()
    this.initCarousel()
    this.setVideoAutoplay()
    this.renderAutoplayProgress()
  },

  methods: {

    /**
     * Set selectors.
     */
    setSelectors() {
      const container =
        document.querySelector(`#vue-element [js-hero-slider="${this.sectionId}"]`)

      this.selectors = {
        container,
        bannerWrapper: container.querySelector('.hero-banner'),
        carousel: container.querySelector('[js-splide="carousel"]'),
        autoplay: container.querySelector('[js-splide="autoplay"]'),
        pagination: container.querySelector('.splide__pagination'),
        arrows: container.querySelector('[js-splide="arrows"]'),
        video: container.querySelector('[js-hero-banner="video"]'),
      }
    },

    /**
     * Turns autoplay on and off depending on reduced motion settings.
     */
    setVideoAutoplay() {
      if (!this.prefersReducedMotion) {
        return
      }

      if (!this.selectors.video || typeof this.selectors.video.forEach !== 'function') {
        return
      }

      this.selectors.video.forEach(video => {
        video.setAttribute('autoplay', false)
      })
    },

    /**
     * Returns the reduced motion settings.
     * @returns {Boolean}
     */
    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },

    /**
     * Toggles whether the carousel arrows are displayed or not.
     */
    showArrows() {
      if (!this.selectors.arrows) {
        return
      }

      this.selectors.arrows.classList.remove(classes.hidden)
    },

    /**
     * Toggles whether the carousel pagination is displayed or not.
     */
    showPagination() {
      if (!this.selectors.pagination) {
        return
      }

      this.selectors.pagination.classList.remove(classes.hidden)
    },

    /**
     * Toggles carousel visibility.
     */
    showCarousel() {
      this.selectors.carousel.style.opacity = 1

      setTimeout(() => {
        this.selectors.bannerWrapper.style.backgroundColor = 'inherit'
      }, 500)
    },

    /**
     * Pagination update event.
     */
    renderAutoplayProgress() {
      this.carousel.event.on('pagination:updated', (data) => {
        this.renderPaginationIcons(data)
      })
    },

    /**
     * Pagination mount event.
     */
    paginationMounted() {
      this.carousel.event.on('pagination:mounted', (data) => {
        this.renderPaginationIcons(data)
      })
    },

    /**
     * Find slide by required classname
     * @param {Array} slides - Array of slides objects.
     * @param {String} classname - Classname of slide.
     * @return {Array}
     */
    findSlide(slides, classname) {
      return slides.filter(element => {
        const classList = element.classList.toString().split(' ')
        return classList.includes(classname)
      })
    },

    /**
     * Render carousel pagination icons
     * @param {Object} data - Pagination element.
     */
    renderPaginationIcons(data) {
      if (!data.items) {
        return
      }

      data.items.forEach((item) => {
        item.button.innerHTML = this.paginationIcon

        if (item.button.classList.contains(classes.active)) {
          const svg = item.button.querySelector('svg')
          const circle = svg.querySelector('circle.stroke-circle')

          this.carousel.event.on('autoplay:playing', (rate) => {
            const dashArray = `${rate * 100} ${100 - (rate * 100)}`
            circle.setAttribute('stroke-dasharray', dashArray)
            circle.setAttribute('stroke', 'green')
            circle.style.stroke = 'var(--color-bio)'
            circle.style.opacity = '0.8'
          })
        }
      })
    },

    /**
     * Initialize Splide carousel.
     */
    initCarousel() {
      if (!this.selectors.carousel) {
        return
      }

      this.carousel = new Splide(this.selectors.carousel, this.config)

      if (this.slideCountToShow <= 1) {
        this.carousel.mount({})
        this.showCarousel()

        return
      }

      this.paginationMounted()
      this.showCarousel()
      this.carousel.mount({}, CustomHeroBannerTransition)
      this.showArrows(this.carousel)
      this.showPagination()
    },
  },
}
</script>

<style lang="scss">
@import '@/components/splide';
@import './hero-banner';
</style>
