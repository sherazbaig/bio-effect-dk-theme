<template>
  <div class="star-rating">
    <div
      class="yotpo-widget-instance"
      :data-yotpo-image-url="product.featured_image"
      :data-yotpo-instance-id="starRatingId"
      :data-yotpo-product-id="product.id"
      :data-yotpo-name="product.title"
      :data-yotpo-url="product.url"
      :data-yotpo-description="product.description"
      data-yotpo-section-id="product"
    />
  </div>
</template>

<script>

/**
 * Vue: Yotpo star rating (star-rating)
 * -----------------------------------------------------------------------------
 * Shows product rating (Powered by Yotpo).
 *
 * @param {Boolean|Object} product - Shopify product.
 *
 */
export default {
  name: 'StarRating',

  props: {
    product: {
      type: [Boolean, Object],
      default: false,
    },
    starRatingId: {
      type: Number,
      default: null,
    },
  },

  mounted() {

    /**
     * Make sure start rating widget is initialized.
     */
    if (window?.yotpoWidgetsContainer?.initWidgets) {
      window.yotpoWidgetsContainer.initWidgets()
    }
  },
}
</script>

<style lang="scss">
@import './star-rating';
</style>
