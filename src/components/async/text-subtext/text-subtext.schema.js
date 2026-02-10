/**
 * Schema: Text&Subtext (text-subtext)
 * -----------------------------------------------------------------------------
 * Section settings for text&subtext component.
 *
 */
module.exports = {
  name: 'Text & Subtext',
  settings: [],
  blocks: [
    {
      type: 'text-and-subtext',
      name: 'Text and subtext',
      settings: [
        {
          type: 'header',
          content: 'Text and subtext content',
        },
        {
          type: 'inline_richtext',
          id: 'title',
          label: 'Title',
        },
        {
          type: 'richtext',
          id: 'subtext',
          label: 'Subtext',
          info: ' No underline option appears in the rich text component. Merchants can underline text using the CMD+U or CTRL+U keyboard shortcut.',
        },
        {
          type: 'url',
          id: 'cta_url',
          label: 'CTA Link',
        },
        {
          type: 'text',
          id: 'cta_text',
          label: 'CTA Text',
        },
      ],
    },
  ],
  max_blocks: 6,
  presets: [
    {
      name: 'Text & Subtext',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
