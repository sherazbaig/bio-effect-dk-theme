/**
 * Schema: multi-store-settings (multi-store-settings)
 * -----------------------------------------------------------------------------
 * Section settings for multi-store-settings component.
 *
 */
module.exports = {
  name: 'Multi-Store-Settings',
  settings: [
    {
      type: 'checkbox',
      id: 'enable_multi_store',
      label: 'Enable Multi-Store functionality',
      default: true,
    },
    {
      type: 'header',
      content: 'Multi Store Switch Labels',
      info: 'Labels for the pop-up appearing on click on the country icon',
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Shipping country',
    },
    {
      type: 'text',
      id: 'message',
      label: 'Message',
      default: 'Hi there! You’re currently shipping to the US and your order will be billed in USD $. If you want to ship to another country, feel free to choose one of our other shipping locations below.',
    },
  ],
  blocks: [
    {
      type: 'country',
      name: 'Country',
      settings: [
        {
          type: 'text',
          id: 'country_name',
          label: 'Country Name',
        },
        {
          type: 'text',
          id: 'country_code',
          label: 'Country Code',
          info: 'Country handle for filtering, example - UK (for United Kingdom)',
        },
        {
          type: 'text',
          id: 'country_handle',
          label: 'Country Handle',
          info: 'Country handle for filtering, example - GB (for United Kingdom)',
        },
        {
          type: 'text',
          id: 'currency',
          label: 'Currency',
        },
        {
          type: 'text',
          id: 'shopify',
          label: 'Shopify instance',
          info: 'The Shopify instance URL excluding .myshopify.com',
        },
        {
          type: 'text',
          id: 'link',
          label: 'External Link',
          info: 'External link to navigate to when selected',
        },
        {
          type: 'image_picker',
          id: 'flag_image',
          label: 'Flag Image',
        },
      ],
    },
  ],
}
