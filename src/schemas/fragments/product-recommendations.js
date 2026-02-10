/**
 * Fragment: Product recommendations
 * -----------------------------------------------------------------------------
 * Shared section settings for product recommendations and product upsell.
 * @param {Boolean} [productRecommendations] - Settings fragment is being used
 * in the product recommendations section and requires all settings.
 * @returns {Object}
 *
 */
module.exports = (productRecommendations = true) => {
  const settings = [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      info: 'Leave blank to not show',
      default: 'You might also like',
    },
    {
      type: 'checkbox',
      id: 'enable_recommendations',
      label: 'Enable recommendations',
      info: 'Loads Shopify recommendations for product(s)',
      default: true,
    },
    {
      type: 'select',
      id: 'recommendation_type',
      label: 'Recommendation type',
      info: 'Related products are best used in \'you might also like\' sections, whereas complementary is designed for a \'pair it with\' sections, see [documentation](https://help.shopify.com/en/manual/online-store/search-and-discovery/product-recommendations)',
      options: [
        {
          label: 'Complementary',
          value: 'COMPLEMENTARY',
        },
        {
          label: 'Related',
          value: 'RELATED',
        },
      ],
      default: 'RELATED',
    },
    {
      type: 'range',
      id: 'product_count',
      label: 'Product count',
      info: 'Number of products to display, dynamic products and then section products are used if Shopify doesn\'t return enough recommendations',
      min: 4,
      max: 12,
      step: 4,
      default: 4,
    },
    productRecommendations
      ? {
        type: 'product',
        id: 'override_product',
        label: 'Override product',
        info: 'Product to load recommendations on instead of current product or cart items',
      }
      : null,
    productRecommendations
      ? {
        type: 'checkbox',
        id: 'display_empty_cart',
        label: 'Display when cart is empty',
        info: 'Show product recommendations when the cart is empty and fallback products have been set',
      }
      : null,
    {
      type: 'header',
      content: 'Products',
      info: 'Product recommendations to display when recommendations are disabled, also used as fallback when recommendations are enabled, duplicates will not be shown',
    },
    productRecommendations
      ? {
        type: 'product_list',
        id: 'dynamic_products',
        label: 'Dynamic products',
        info: 'Use Shopify dynamic source to connect to product metafield',
      }
      : null,
    {
      type: 'product_list',
      id: 'section_products',
      label: 'Section products',
      info: productRecommendations
        ? 'Used if current resource doesn\'t have any products set in its dynamic product setting metafield'
        : 'Fallback section products',
    },
  ]

  return settings.filter(Boolean)
}
