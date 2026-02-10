/**
 * Schema: Yotpo reviews widget (reviews-widget)
 * -----------------------------------------------------------------------------
 * Section settings for yotpo reviews widget component.
 *
 */
module.exports = {
  name: 'Yotpo Reviews Widget',
  settings: [
    {
      type: 'header',
      content: 'Reviews Widget Settings',
    },
    {
      type: 'text',
      id: 'reviews_widget_id',
      label: 'Reviews Widget Instance Id',
      default: '474888',
    },
  ],
  presets: [
    {
      name: 'Yotpo Reviews Widget',
    },
  ],
  enabled_on: {
    templates: ['product'],
  },
}
