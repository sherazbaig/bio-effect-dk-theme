<template>
  <component
    :is="element"
    class="product-prices"
  >
    <span
      v-if="varies"
      class="product-prices__varies"
      :class="classPrice"
      v-text="$string('product.prices.from')"
    />

    <span
      v-if="formattedValuePrice && !priceFirst"
      class="product-prices__compare-at-price"
      :class="classCompareAtPrice"
      v-text="formattedValuePrice"
    />

    <span
      v-if="available"
      class="product-prices__price"
      :class="[
        classPrice,
        { 'product-prices__price--on-sale': formattedCompareAtPrice },
      ]"
      v-text="formattedPrice"
    />

    <span
      v-if="formattedValuePrice && priceFirst"
      class="product-prices__compare-at-price"
      :class="classCompareAtPrice"
      v-text="formattedValuePrice"
    />

    <span
      v-if="available === false"
      class="product-prices__sold-out"
      :class="classPrice"
      v-text="$string('product.prices.sold_out')"
    />
  </component>
</template>

<script>

/**
 * Vue: Product prices (product-prices)
 * -----------------------------------------------------------------------------
 * Global product prices template.
 *
 * @param {Boolean} [available] - If the product is available.
 * @param {String} [classCompareAtPrice] - Comare at price text classes.
 * @param {String} [classPrice] - Price text classes.
 * @param {Number|Boolean} compareAtPrice - Compare at price, in cents format.
 * @param {Number|Boolean} originalLinePrice - Original line item price,
 * in cents format.
 * @param {String} [element] - Custom element override.
 * @param {Number} price - Product price, in cents format.
 * @param {Boolean} [priceFirst] - Display price before compare at price.
 * @param {Boolean} [varies] - Product variants vary in price.
 *
 */
export default {
  name: 'ProductPrices',

  props: {
    available: {
      type: Boolean,
      default: true,
    },
    classCompareAtPrice: {
      type: String,
      default: 'text-other-sale-s text-other-sale-l-desktop',
    },
    classPrice: {
      type: String,
      default: 'text-body-s-regular text-body-m-regular-desktop',
    },
    compareAtPrice: {
      type: [Boolean, Number],
      default: false,
      required: true,
    },
    originalLinePrice: {
      type: [Boolean, Number],
      default: false,
      required: false,
    },
    element: {
      type: String,
      default: 'p',
    },
    price: {
      type: [Boolean, Number],
      default: 0,
      required: true,
    },
    priceFirst: {
      type: Boolean,
      default: false,
    },
    varies: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cnvsGlobal: true,
    }
  },

  computed: {

    /**
     * Compute compare at price template.
     * @returns {String}
     */
    formattedCompareAtPrice() {
      return this.compareAtPrice && this.price < this.compareAtPrice
        ? this.$formatMoney(this.compareAtPrice)
        : ''
    },

    /**
     * Compute Line Item Original Price template.
     * @returns {String}
     */
    formattedOriginalPrice() {
      return this.originalLinePrice && this.price < this.originalLinePrice
        ? this.$formatMoney(this.originalLinePrice)
        : ''
    },

    /**
     * Compute Value Price, either:
     *   - Line item original price.
     *   - Variant compare at price.
     * @returns {String}
     */
    formattedValuePrice() {
      return this.formattedOriginalPrice || this.formattedCompareAtPrice
    },

    /**
     * Compute price template.
     * @returns {String}
     */
    formattedPrice() {
      if (this.price === false) {
        return this.$string('accessibility.loading')
      }

      if (this.price <= 0) {
        return this.$string('product.prices.free')
      }

      return this.price ? this.$formatMoney(this.price) : ''
    },
  },
}
</script>
