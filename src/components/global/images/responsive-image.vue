<template>
  <div
    class="images"
    :class="paddingClass"
    :style="{ paddingBottom }"
  >
    <!-- eslint-disable-next-line vue/no-restricted-html-elements -->
    <img
      v-if="image && (image.src || image.url)"
      class="images__image"
      :class="{ [$class('loading')]: imageLoading }"
      :alt="altAttribute"
      decoding="async"
      :loading="lazyload ? 'lazy' : null"
      :role="altAttribute ? null : 'presentation'"
      :sizes="sizes"
      :src="srcAttribute"
      :srcset="srcsetAttribute.srcset"
      :style="styleAttribute"
      @load="setImageLoaded"
    >
  </div>
</template>

<script>

/**
 * Vue: Responsive image (images)
 * -----------------------------------------------------------------------------
 * Base template for responsive images.
 * - image.src comes from formatted product response.
 * - image.url comes from unformatted cart.js response.
 *
 * @param {String} [alt] - Override image alt.
 * @param {Object} image - Image object formatted from Shopify response.
 * @param {Boolean} [lazyload] - Lazyload image, defaults to true.
 * @param {String} [minMax] - Min and max size for srcset in `min-max` format.
 * @param {Boolean} [padding] - Add padding based on image ratio or supplied
 * ratio, default to true, disable to make image fill its parent container.
 * @param {Boolean|Number|String} [ratio] - Aspect ratio of image in
 * `width:height`, `width / height`, or decimal ratio format (width/height),
 * will use the original ratio of image if set to false or 'image'.
 * @param {String} [sizes] - Value for sizes attribute.
 *
 * @emits imageLoaded - Emit image loaded.
 *
 */
import {
  computeAspectRatio,
  computePaddingBottom,
  validateImage,
  validateRatio,
} from '~/helpers/vue'

export default {
  name: 'ResponsiveImage',

  props: {
    alt: {
      type: String,
      default: '',
    },
    image: {
      type: Object,
      default: () => ({}),
      required: true,
      validator: validateImage,
    },
    lazyload: {
      type: Boolean,
      default: true,
    },
    minMax: {
      type: String,
      default: '200-1000',
      validator: (value) => {
        return value.match(/^\d+-\d+$/g)
      },
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
    sizes: {
      type: String,
      default: 'auto',
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
     * Compute alt attribute.
     * @returns {String}
     */
    altAttribute() {
      const altAttribute = this.alt || this.image.alt
      return altAttribute ? altAttribute : ''
    },

    /**
     * Compute aspect ratio.
     * @returns {String|Null}
     */
    aspectRatio() {
      if (!this.padding) {
        return null
      }

      return computeAspectRatio(this.ratio, this.image)
    },

    /**
     * Compute padding bottom.
     * @returns {String|Null}
     */
    paddingBottom() {
      if (!this.padding) {
        return null
      }

      return computePaddingBottom(this.aspectRatio)
    },

    /**
     * Compute image padding class.
     * @returns {String}
     */
    paddingClass() {
      return this.padding ? '' : 'images--no-padding'
    },

    /**
     * Compute src attribute.
     * @returns {String}
     */
    srcAttribute() {
      return this.$formatImageUrl(
        this.image.src || this.image.url,
        { width: this.srcsetAttribute.placeholder },
      )
    },

    /**
     * Compute srcset attribute.
     * @returns {Object}
     */
    srcsetAttribute() {
      if (!this.image.src && !this.image.url) {
        return {
          srcset: null,
        }
      }

      const min = Number(this.minMax.split('-')[0])
      const max = Number(this.minMax.split('-')[1])

      const range = max - min
      const increment = range / 5

      const array = [...Array(5)].map((_, index) => {
        const step = increment * (index + 1)
        const value = min + step

        return value
      })

      const srcset = array.map((step) => {
        const roundedSize = Math.ceil(step)

        const sizedImageUrl = this.$formatImageUrl(
          this.image.src || this.image.url,
          { width: roundedSize },
        )

        return `${sizedImageUrl} ${roundedSize}w`
      })

      return {
        array,
        max,
        min,
        placeholder: min / 2,
        srcset,
      }
    },

    /**
     * Compute style attribute.
     * - Used to apply image focal point styles.
     * @returns {String|Null}
     */
    styleAttribute() {
      return this.image.presentation?.focalPoint
        ? { objectPosition: this.image.presentation.focalPoint }
        : null
    },
  },

  methods: {

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
