/**
 * Schema: Promo banner (promo-banner)
 * -----------------------------------------------------------------------------
 * Section settings for promo banner component.
 *
 */
const headerStates = require('#fragments/header-states')

module.exports = {
  name: 'Promo Banner',
  settings: [
    {
      type: 'paragraph',
      content: 'Promotional banner carousel for announcing new launches and updates',
    },
    {
      type: 'header',
      content: 'Message Settings',
    },
    {
      type: 'checkbox',
      id: 'enable_autoscroll',
      label: 'Enable autoscroll',
      default: true,
    },
    {
      type: 'range',
      id: 'autoscroll_timing',
      label: 'Autoscroll timing',
      info: 'Used to control autoscroll timing, represents the time the item is static and animated, 80% of the time is static, 20% of the time is animated, e.g. a value of 5s will display the item for 4s and the animation will take 1s',
      min: 1,
      max: 10,
      step: 1,
      unit: 's',
      default: 5,
    },
    {
      type: 'text',
      id: 'desktop_message',
      label: 'Desktop Message',
      default: 'Are you shipping outside the US? Choose another region to ship and see content specific to your closest shipping locations',
      info: 'Messaging to display on desktop',
    },
    {
      type: 'header',
      content: 'Search Settings',
    },
    {
      type: 'product',
      id: 'up_sell_product',
      label: 'Predictive Search Up-sell Product',
    },
    {
      type: 'header',
      content: 'Store Selector Settings',
    },
    {
      type: 'checkbox',
      id: 'display_store_selector',
      label: 'Display the Store Selector in the Promo Bar',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'display_account',
      label: 'Display the Account link in the Promo Bar',
      default: true,
    },
    ...headerStates({ minimised: false }),
  ],
  blocks: [
    {
      type: 'promo',
      name: 'Promo',
      settings: [
        {
          type: 'inline_richtext',
          id: 'title',
          label: 'Text',
        },
      ],
    },
  ],
}
