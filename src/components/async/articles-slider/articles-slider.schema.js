/**
 * Schema: Articles slider (articles-slider)
 * -----------------------------------------------------------------------------
 * Section settings for articles slider component.
 *
 */
module.exports = {
  name: 'Articles Slider',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Articles Slider',
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
  blocks: [
    {
      name: 'Item',
      type: 'item',
      settings: [
        {
          type: 'article',
          id: 'article',
          label: 'Article',
        },
      ],
    },
  ],
  max_blocks: 8,
  presets: [
    {
      name: 'Articles Slider',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
