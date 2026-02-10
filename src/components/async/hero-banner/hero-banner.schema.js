/**
 * Schema: Hero banner (hero-banner)
 * -----------------------------------------------------------------------------
 * Section settings for hero banner component.
 *
 */
const textColour = require('../../../schemas/fragments/text-colour')

module.exports = {
  name: 'Hero Banner',
  settings: [
    {
      type: 'header',
      content: 'Carousel Settings',
    },
    {
      type: 'range',
      id: 'carousel_speed',
      unit: 's',
      label: 'Carousel autoplay speed (seconds per slide)',
      min: 0,
      max: 10,
      step: 0.5,
      default: 4.5,
    },
  ],
  blocks: [
    {
      type: 'slide',
      name: 'Slide',
      settings: [
        {
          type: 'header',
          content: 'Slide Content',
        },
        {
          type: 'image_picker',
          id: 'mobile_image',
          label: 'Mobile Image',
        },
        {
          type: 'image_picker',
          id: 'desktop_image',
          label: 'Desktop Image',
        },
        {
          type: 'video',
          id: 'mobile_video',
          label: 'Mobile Video',
          info: 'A Shopify-hosted video an .mp4 file, overrides the image',
        },
        {
          type: 'video',
          id: 'desktop_video',
          label: 'Desktop Video',
          info: 'A Shopify-hosted video an .mp4 file, overrides the image',
        },
        {
          type: 'header',
          content: 'Slide Text Settings',
        },
        {
          type: 'text',
          id: 'title',
          label: 'Title',
        },
        {
          type: 'inline_richtext',
          id: 'subtitle',
          label: 'Subtitle',
          info: 'Text above title',
        },
        {
          type: 'richtext',
          id: 'subtext',
          label: 'Subtext',
          info: 'Text below title',
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
        {
          type: 'header',
          content: 'Slide Text Styling Settings',
        },
        textColour(),
        {
          type: 'range',
          id: 'overlay_opacity',
          label: 'Overlay opacity',
          info: 'Defines the opacity of the overlay, shown over the image',
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.6,
        },
      ],
    },
  ],
  max_blocks: 5,
  presets: [
    {
      name: 'Hero Banner',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
