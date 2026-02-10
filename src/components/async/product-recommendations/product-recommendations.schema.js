/**
 * Schema: Product recommendations (product-recommendations)
 * -----------------------------------------------------------------------------
 * Section settings for product recommendations component.
 *
 */
const productRecommendations = require('#fragments/product-recommendations')

module.exports = {
  name: 'Product Recommendations',
  settings: [
    {
      type: 'paragraph',
      content: 'Shopify powered product recommendations based on current product on product page or contents of cart on the cart page',
    },
    ...productRecommendations(),
    {
      type: 'header',
      content: 'Optional button',
    },
    {
      type: 'text',
      id: 'button_text',
      label: 'Button text',
      info: 'Leave blank to hide button.',
    },
    {
      type: 'url',
      id: 'button_url',
      label: 'Button URL',
    },
  ],
  presets: [
    {
      name: 'Product Recommendations',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
