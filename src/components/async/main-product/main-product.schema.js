/**
 * Schema: Main product
 * -----------------------------------------------------------------------------
 * Section settings for main product component.
 *
 */
module.exports = {
  name: 'Product',
  settings: [
    {
      type: 'header',
      content: 'Star Rating Settings',
    },
    {
      type: 'text',
      id: 'star_rating_id',
      label: 'Star Rating Instance Id',
      default: '474887',
    },
  ],
}
