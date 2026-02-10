/**
 * Schema: Cart drawer (cart-drawer)
 * -----------------------------------------------------------------------------
 * Section settings for cart drawer component.
 *
 */
module.exports = {
  name: 'Cart Drawer',
  settings: [
    {
      type: 'header',
      content: 'Free Shipping Notification Settings',
    },
    {
      type: 'checkbox',
      id: 'free_shipping_enabled',
      label: 'Free Shipping Notification Toggle',
      info: 'Toggle on/off free shipping notification.',
      default: false,
    },
    {
      type: 'number',
      id: 'free_shipping_threshold',
      label: 'Free Shipping Threshold',
      info: 'Show free shipping notification in cart drawer when cart total is larger than or equal threshold (Money value entered in cents).',
    },
    {
      type: 'header',
      content: 'Checkbox for Terms & Conditions',
    },
    {
      type: 'checkbox',
      id: 'terms_and_conditions_enabled',
      label: 'Enable Checkbox for Terms & Conditions',
    },
    {
      type: 'inline_richtext',
      id: 'terms_and_conditions_link',
      label: 'Terms & Conditions Link',
      default: 'I accept the <a href="/pages/terms-and-conditions">Terms and Conditions</a>',
    },
    {
      type: 'header',
      content: 'Tax settings',
    },
    {
      type: 'checkbox',
      id: 'tax_line_enabled',
      label: 'Tax Line Toggle',
      info: 'Toggle on/off the Tax line in the Summary section.',
      default: true,
    },
  ],
}
