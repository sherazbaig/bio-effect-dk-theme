/**
 * Schema: info-stamps (info-stamps)
 * -----------------------------------------------------------------------------
 * Section settings for info-stamps component.
 *
 */
module.exports = {
  name: 'Info-Stamps',
  max_blocks: 5,
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
    },
    {
      type: 'text',
      id: 'subtext',
      label: 'Subtext',
    },
    {
      type: 'url',
      id: 'link',
      label: 'Link',
    },
  ],
  blocks: [
    {
      type: 'Stamp',
      name: 'Stamp',
      settings: [
        {
          type: 'image_picker',
          id: 'stamp',
          label: 'Stamp',
        },
      ],
    },
  ],
  presets: [
    {
      name: 'Info-Stamps',
    },
  ],
  disabled_on: {
    groups: ['*'],
  },
}
