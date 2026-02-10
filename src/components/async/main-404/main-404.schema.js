/**
 * Schema: Main 404
 * -----------------------------------------------------------------------------
 * Section settings for main 404 component.
 *
 */
module.exports = {
  name: '404 Error',
  settings: [
    {
      type: 'header',
      content: 'Image',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Image',
      info: 'Leave blank to hide',
    },
    {
      type: 'header',
      content: 'CTA',
    },
    {
      type: 'text',
      id: 'cta_text',
      label: 'CTA text, leave blank to hide',
      default: 'Back to home',
    },
    {
      type: 'url',
      id: 'cta_url',
      label: 'CTA URL, leave blank to point to the homepage',
    },
  ],
}
