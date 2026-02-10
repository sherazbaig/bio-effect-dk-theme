/**
 * Schema: Quote and image (quote-and-image)
 * -----------------------------------------------------------------------------
 * Section settings for quote and image component.
 *
 */
const backgroundColour = require('../../../schemas/fragments/background-colour')

module.exports = {
  name: 'Quote And Image',
  settings: [
    {
      type: 'header',
      content: 'Section Settings',
    },
    backgroundColour(),
  ],
  blocks: [
    {
      type: 'quote-with-logos',
      name: 'Quote with logos',
      settings: [
        {
          type: 'header',
          content: 'Main Quote with Image Content',
        },
        {
          type: 'richtext',
          id: 'logo_quote',
          label: 'Quote text',
        },
        {
          type: 'image_picker',
          id: 'logo_image',
          label: 'Logo image',
        },
      ],
    },
    {
      type: 'quote-with-image',
      name: 'Quote with large image',
      settings: [
        {
          type: 'header',
          content: 'Main Quote with Image Content',
        },
        {
          type: 'richtext',
          id: 'image_quote',
          label: 'Quote text',
        },
        {
          type: 'text',
          id: 'sub_quote_text',
          label: 'Sub quote text',
        },
        {
          type: 'image_picker',
          id: 'mobile_image',
          label: 'Mobile image',
        },
        {
          type: 'image_picker',
          id: 'desktop_image',
          label: 'Desktop image',
        },
      ],
    },
  ],
  max_blocks: 8,
  presets: [
    {
      name: 'Quote And Image',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
