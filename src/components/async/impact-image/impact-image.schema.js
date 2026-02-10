/**
 * Schema: Impact image (impact-image)
 * -----------------------------------------------------------------------------
 * Section settings for impact image component.
 *
 */
module.exports = {
  name: 'Impact Image',
  settings: [
    {
      type: 'header',
      content: 'Content Settings',
    },
    {
      type: 'image_picker',
      id: 'desktop_image',
      label: 'Desktop Image',
    },
    {
      type: 'image_picker',
      id: 'mobile_image',
      label: 'Mobile Image',
    },
    {
      type: 'video',
      id: 'video',
      label: 'Video Content',
      info: 'A Shopify-hosted video an .mp4 file, overrides the image',
    },
    {
      type: 'text',
      id: 'vimeo_embed',
      label: 'Vimeo video ID',
      info: 'A Vimeo video ID to embed, e.g., 1046778541',
    },
    {
      type: 'text',
      id: 'youtube_embed',
      label: 'Youtube video ID',
      info: 'A Youtube video ID to embed, e.g., weBEqr0ff2Y',
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title',
    },
    {
      type: 'richtext',
      id: 'text',
      label: 'Content text',
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
  presets: [
    {
      name: 'Impact Image',
    },
  ],
  disabled_on: {
    groups: ['header', 'footer'],
  },
}
