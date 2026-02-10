<template>
  <div
    class="images"
    :class="{ 'images--no-padding': !padding }"
  >
    <span
      v-if="padding"
      :key="`spacer-${aspectRatio}`"
      class="images__spacer"
      :style="{ paddingBottom }"
      aria-hidden="true"
    />

    <picture
      v-if="sources.length"
      class="images__picture"
    >
      <source
        v-for="(source) of sources"
        :key="`source-${source.breakpoint}`"
        class="images__image"
        :media="source.media"
        :srcset="source.src"
      >

      <!-- eslint-disable-next-line vue/no-restricted-html-elements -->
      <img
        v-if="image.src || image.url"
        class="images__image"
        :class="{ [$class('loading')]: imageLoading }"
        :alt="altAttribute"
        decoding="async"
        :loading="lazyload ? 'lazy' : null"
        :role="altAttribute ? null : 'presentation'"
        :src="srcAttribute"
        :style="styleAttribute"
        @load="setImageLoaded"
      >
    </picture>
  </div>
</template>

<script>

/**
 * Vue: Art direction (images)
 * -----------------------------------------------------------------------------
 * Base template for art direction image.
 * - Designed for images which change based on breakpoint.
 * - Stylesheet imported in responsive image component.
 * - image.src comes from formatted product response.
 * - image.url comes from unformatted cart.js response.
 *
 * @param {String} [alt] - Override image alt.
 * @param {String} [breakpointSizes] - Image size to use at each breakpoint in
 * the format [xs]-[s]-[m]-[l]-[xl].
 * @param {String} [desktopBreakpoint] - Breakpoint to use desktop image and
 * ratio at, if not set then it uses the mobileBreakpoints configuration.
 * @param {Object} image - Image object formatted from Shopify response.
 * @param {Object} [imageDesktop] - Override image object for desktop.
 * @param {Boolean} [lazyload] - Lazyload image, defaults to true.
 * @param {Boolean} [padding] - Add padding based on image ratio or supplied
 * ratio, default to true, disable to make image fill its parent container.
 * @param {Boolean|Number|String} [ratio] - Aspect ratio of image in
 * `width:height`, `width / height`, or decimal ratio format (width/height),
 * will use the original ratio of image if set to false or 'image'.
 * @param {String} [ratioDesktop] - Override image ratio for desktop, pass
 * 'image' or false to use image's original aspect ratio, pass true or '' to
 * use existing value of ratio calculated using mobile image.
 *
 * @emits imageLoaded - Emit image loaded.
 *
 */
import { mapState } from 'vuex'

import { values as breakpoints } from '~/config/breakpoints'

import {
  computeAspectRatio,
  computePaddingBottom,
  validateImage,
  validateRatio,
} from '~/helpers/vue'

export default {
  name: 'ArtDirection',

  props: {
    alt: {
      type: String,
      default: '',
    },
    breakpointSizes: {
      type: String,
      default: '',
      validator: (value) => {
        return (
          value === '' ||
          value?.split('-').length === Object.keys(breakpoints).length
        )
      },
    },
    desktopBreakpoint: {
      type: String,
      default: '',
      validator: (value) => {
        return value === '' || Object.keys(breakpoints).includes(value)
      },
    },
    image: {
      type: Object,
      default: () => ({}),
      required: true,
      validator: validateImage,
    },
    imageDesktop: {
      type: Object,
      default: () => ({}),
      validator: validateImage,
    },
    lazyload: {
      type: Boolean,
      default: true,
    },
    padding: {
      type: Boolean,
      default: true,
    },
    ratio: {
      type: [Boolean, Number, String],
      default: false,
      validator: validateRatio,
    },
    ratioDesktop: {
      type: [Boolean, Number, String],
      default: false,
      validator: (value) => validateRatio(value, true),
    },
  },

  emits: {
    'image-loaded': () => true,
  },

  data() {
    return {
      cnvsGlobal: true,
      imageLoading: true,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      currentBreakpoint: (state) => state.index.screen.breakpoint,
      mobileBreakpoints: (state) => state.index.settings.mobileBreakpoints,
    }),

    /**
     * Compute alt.
     * @returns {String}
     */
    altAttribute() {
      const imageAlt = this.alt || this.image.alt
      return imageAlt ? imageAlt : ''
    },

    /**
     * Compute aspect ratio.
     * @returns {Number|String}
     */
    aspectRatio() {
      if (!this.padding) {
        return null
      }

      /**
       * If ratioDesktop isn't set then it fallbacks to the mobile spacer.
       */
      const desktopRatioNotSet =
        this.ratioDesktop === true ||
        this.ratioDesktop === ''

      const ratio = this.desktop && !desktopRatioNotSet
        ? this.ratioDesktop
        : this.ratio

      const imageObject = this.desktop && (this.imageDesktop.src || this.imageDesktop.url)
        ? this.imageDesktop
        : this.image

      return computeAspectRatio(ratio, imageObject)
    },

    /**
     * Compute whether desktop ratio/image should be used.
     * @returns {Boolean}
     */
    desktop() {
      return this.getDesktop(this.currentBreakpoint)
    },

    /**
     * Get padding bottom.
     * @returns {String|Null}
     */
    paddingBottom() {
      if (!this.padding) {
        return null
      }

      return computePaddingBottom(this.aspectRatio)
    },

    /**
     * Compute images array for <source> elements.
     * @returns {Array}
     */
    sources() {
      const breakpointKeys = Object.keys(breakpoints)

      return breakpointKeys.map((key, index) => {
        let imageObject = this.image
        const lastBreakpoint = index === (breakpointKeys.length - 1)
        let mediaQuerySize = 0

        /**
         * Use desktop image when key is equal to what's considered desktop.
         */
        if (
          (this.imageDesktop.src || this.imageDesktop.url) &&
          this.getDesktop(key)
        ) {
          imageObject = this.imageDesktop
        }

        /**
         * Early return if image object is missing image.
         */
        if (!imageObject.src && !imageObject.url) {
          return false
        }

        /**
         * Use next breakpoint size to determine max-width and image size.
         * - Unless it's the last breakpoint.
         */
        if (!lastBreakpoint) {
          const nextBreakpointKey = breakpointKeys[index + 1]
          mediaQuerySize = breakpoints[nextBreakpointKey]
        }

        let size = mediaQuerySize || '1024'

        if (lastBreakpoint) {
          size = imageObject.width || '2048'
        }

        if (this.breakpointSizes) {
          size = Number(this.breakpointSizes.split('-')[index])
        }

        return {
          breakpoint: key,
          media: lastBreakpoint ? '' : `(max-width: ${Number(mediaQuerySize) - 1}px)`,
          size,
          src: this.$formatImageUrl(imageObject.src || imageObject.url, { width: size }),
        }
      }).filter(Boolean)
    },

    /**
     * Compute src attribute.
     * @returns {String}
     */
    srcAttribute() {
      return this.$formatImageUrl(
        this.image.src || this.image.url,
        { width: 100 },
      )
    },

    /**
     * Compute style attribute.
     * - Used to apply image focal point styles.
     * - If desktop image exists and doesn't have a focal point then don't
     *   fallback to mobile image's focal point.
     * @returns {String|Null}
     */
    styleAttribute() {
      let imageObject = this.image

      if (this.desktop && (this.imageDesktop.src || this.imageDesktop.url)) {
        imageObject = this.imageDesktop
      }

      return imageObject.presentation?.focalPoint
        ? { objectPosition: imageObject.presentation.focalPoint }
        : null
    },
  },

  methods: {

    /**
     * Get if current breakpoint should be treated as desktop.
     * @param {String} breakpoint - Breakpoint to test.
     * @returns {Boolean}
     */
    getDesktop(breakpoint) {
      if (this.desktopBreakpoint) {
        const desktopBreakpointIndex = Object.keys(breakpoints).indexOf(this.desktopBreakpoint)
        const currentBreakpointIndex = Object.keys(breakpoints).indexOf(breakpoint)

        return currentBreakpointIndex >= desktopBreakpointIndex
      }

      return !this.mobileBreakpoints.includes(breakpoint)
    },

    /**
     * Set image as loaded.
     */
    async setImageLoaded() {
      await this.$nextTick()
      this.imageLoading = false
      this.$emit('image-loaded')
    },
  },
}
</script>
