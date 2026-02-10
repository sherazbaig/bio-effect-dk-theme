/**
 * Schema: Image with Link Carousel (image-link-carousel)
 * -----------------------------------------------------------------------------
 * Section settings for image with link carousel component.
 *
 */
const backgroundColour = require('../../../schemas/fragments/background-colour')

module.exports = {
  name: 'Image with Link Carousel',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
    },
    backgroundColour(),
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
  ],
  blocks: [
    {
      type: 'image-with-link',
      name: 'Image with Link',
      settings: [
        {
          type: 'image_picker',
          id: 'image',
          label: 'Image',
        },
        {
          type: 'text',
          id: 'name',
          label: 'Name',
        },
        {
          type: 'url',
          id: 'url',
          label: 'Link',
        },
      ],
    },
  ],
  max_blocks: 20,
  presets: [
    {
      name: 'Images With Links Carousel',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
