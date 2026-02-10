/**
 * Schema: Product upsell carousel (product-upsell-carousel)
 * -----------------------------------------------------------------------------
 * Section settings for product upsell carousel component.
 *
 */
module.exports = {
  name: 'Product Upsell Carousel',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Best sellers',
    },
    {
      type: 'checkbox',
      id: 'make_title_h1',
      label: 'Make the title as H1',
      default: false,
    },
    {
      type: 'text',
      id: 'cta_text',
      label: 'CTA Text',
    },
    {
      type: 'url',
      id: 'cta_url',
      label: 'CTA URL',
    },
    {
      type: 'header',
      content: 'Non-JS version of Upsell Carousel',
    },
    {
      type: 'checkbox',
      id: 'enable_non_js_carousel',
      label: 'Enable non-JS version of Upsell Carousel',
      default: false,
    },
  ],
  max_blocks: 8,
  blocks: [
    {
      name: 'Product',
      type: 'product',
      settings: [
        {
          type: 'product',
          id: 'product',
          label: 'Product',
        },
      ],
    },
  ],
  presets: [
    {
      name: 'Product Upsell Carousel',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
