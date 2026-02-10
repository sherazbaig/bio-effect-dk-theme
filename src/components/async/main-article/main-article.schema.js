/**
 * Schema: Main article (main-article)
 * -----------------------------------------------------------------------------
 * Section settings for main article component.
 *
 */
module.exports = {
  name: 'Article',
  settings: [
    {
      type: 'range',
      id: 'reading_speed',
      label: 'Reading speed (words per minute)',
      info: 'Used to calculate article read time based on word count / words per minute',
      min: 60,
      max: 300,
      step: 10,
      default: 180,
    },
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
