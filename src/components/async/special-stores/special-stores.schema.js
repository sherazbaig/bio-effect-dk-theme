/**
 * Schema: Special stores (special-stores)
 * -----------------------------------------------------------------------------
 * Section settings for special stores component.
 *
 */
module.exports = {
  name: 'Special Stores',
  settings: [
    {
      type: 'header',
      content: 'Special Stores Settings',
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Online Stores.',
    },
  ],
  blocks: [
    {
      name: 'Store',
      type: 'store',
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Store Name',
        },
        {
          type: 'text',
          id: 'cta_label',
          label: 'CTA Label',
          default: 'Visit Store',
        },
        {
          type: 'url',
          id: 'cta_url',
          label: 'CTA URL',
        },
      ],
    },
  ],
  presets: [
    {
      name: 'Special Stores',
    },
  ],
  enabled_on: {
    templates: ['page'],
  },
}
