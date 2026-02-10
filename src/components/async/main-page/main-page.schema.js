/**
 * Schema: Main page
 * -----------------------------------------------------------------------------
 * Section settings for main page component.
 *
 */
module.exports = {
  name: 'Page',
  settings: [
    {
      type: 'header',
      content: 'Social sharing',
    },
    {
      type: 'checkbox',
      id: 'enable_social_sharing',
      label: 'Enable social sharing',
      default: true,
    },
  ],
}
