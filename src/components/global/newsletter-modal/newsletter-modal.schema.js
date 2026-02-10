/**
 * Schema: Newsletter modal (newsletter-modal)
 * -----------------------------------------------------------------------------
 * Section settings for newsletter modal component.
 *
 */
module.exports = {
  name: 'Newsletter Modal',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Choose The Skincare of Tomorrow',
    },
    {
      type: 'richtext',
      id: 'disclaimer',
      label: 'Disclaimer',
      default: '<p>Subscribe to our newsletter and receive early access to new arrivals and special offers including 10% off your first order.*</p>',
    },
    {
      type: 'text',
      id: 'button',
      label: 'Button label',
      info: 'Displayed on success, clicking closes the modal',
      default: 'Sign me up',
    },
    {
      type: 'inline_richtext',
      id: 'privacy_policy',
      label: 'Privacy Policy Text',
      default: 'I accept the Privacy Policy',
    },
    {
      type: 'text',
      id: 'list',
      label: 'Sign-ups list ID',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Modal image',
    },
    {
      type: 'range',
      id: 'time_to_show_modal',
      min: 1,
      max: 60,
      step: 1,
      unit: 's',
      label: 'Time for the pop-up to show',
      default: 5,
    },
  ],
  presets: [
    {
      name: 'Newsletter Modal',
    },
  ],
  disabled_on: {
    groups: ['header'],
  },
}
