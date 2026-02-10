/**
 * Schema: faq-section (faq-section)
 * -----------------------------------------------------------------------------
 * Section settings for faq-section component.
 *
 */
module.exports = {
  name: 'Faq-Section',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Frequently asked questions',
    },
  ],
  blocks: [
    {
      name: 'FAQ',
      type: 'faq',
      settings: [
        {
          type: 'text',
          id: 'question',
          label: 'Question',
        },
        {
          type: 'richtext',
          id: 'answer',
          label: 'Answer',
        },
      ],
    },
  ],
  max_blocks: 20,
  presets: [
    {
      name: 'Faq-Section',
    },
  ],
  disabled_on: {
    groups: ['*'],
  },
}
