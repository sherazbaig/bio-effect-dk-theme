/**
 * Schema: Contact us (contact-us)
 * -----------------------------------------------------------------------------
 * Section settings for contact us component.
 *
 */
module.exports = {
  name: 'Contact Us',
  settings: [
    {
      type: 'header',
      content: 'Contact us content',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Main image',
    },
  ],
  presets: [
    {
      name: 'Contact Us',
    },
  ],
  disabled_on: {
    groups: ['*'],
  },
}
