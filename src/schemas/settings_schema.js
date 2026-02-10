/**
 * Schema: Settings schema
 * -----------------------------------------------------------------------------
 * Used to compile config/settings_schema.json file.
 * - `THEME_NAME` and `THEME_VERSION` are replaced during build.
 *
 */

module.exports = [
  {
    name: 'theme_info',
    theme_name: 'THEME_NAME',
    theme_version: 'THEME_VERSION',
    theme_author: 'We Make Websites',
    theme_documentation_url: 'https:/we-make-websites.gitbook.io/canvas/',
    theme_support_url: 'https://wemakewebsites.com/contact/',
  },
  {
    name: 'Store Settings',
    settings: [
      {
        type: 'paragraph',
        content: 'General store settings',
      },
      {
        type: 'header',
        content: 'Site header heights',
        info: 'Define the starting heights of the header before JavaScript runs',
      },
      {
        type: 'number',
        id: 'header_mobile_height',
        label: 'Mobile height (px)',
        default: 105,
      },
      {
        type: 'number',
        id: 'header_tablet_height',
        label: 'Tablet height (px)',
        default: 105,
      },
      {
        type: 'number',
        id: 'header_desktop_height',
        label: 'Desktop height (px)',
        default: 136,
      },
      {
        type: 'header',
        content: 'Cart',
      },
      {
        type: 'checkbox',
        id: 'auto_open_cart_drawer',
        label: 'Automatically open cart drawer',
        info: 'Enables automatically opening the cart drawer when a product is added to cart',
        default: true,
      },
      {
        type: 'header',
        content: 'Favicon',
      },
      {
        type: 'image_picker',
        id: 'favicon',
        label: 'Favicon image',
        info: 'Upload a PNG at least 512x512px',
      },
      {
        type: 'header',
        content: 'Site colours',
      },
      {
        type: 'color',
        id: 'site_colour',
        label: 'Site colour',
        info: 'Used to set the colour of browser window in Android and tile colour in Windows start menu',
        default: '#000000',
      },
      {
        type: 'color',
        id: 'site_background_colour',
        label: 'Site background colour',
        info: 'Used to set background colour for Android splash screen and the background colour when scrolling beyond the page in Safari',
        default: '#ffffff',
      },
      {
        type: 'header',
        content: 'Global',
      },
      {
        type: 'textarea',
        id: 'hreflangs',
        label: 'Hreflangs',
        info: 'This should only be used when there is more than one Shopify instance, add a newline for each hreflang in the format URL:locale, e.g. example.com:en-gb, include the language sub-domain, e.g. example.com/es:es-es',
        placeholder: 'example.com:en-gb\nexample.com/es:es-es',
      },
      {
        type: 'header',
        content: 'Newsletter Modal Settings',
      },
      {
        type: 'checkbox',
        id: 'enable_newsletter_modal',
        label: 'Enable Newsletter Modal',
        info: 'Enable/Disable newsletter modal.',
        default: true,
      },
      {
        type: 'text',
        id: 'cookiehub_script_id',
        label: 'CookieHub Script Id',
        default: '789484d7',
      },
      {
        type: 'header',
        content: 'Non-JS version of collection pages',
      },
      {
        type: 'checkbox',
        id: 'enable_non_js_collection',
        label: 'Enable non-JS version of collection pages',
        default: false,
      },
      {
        type: 'checkbox',
        id: 'enable_non_js_loading_animation',
        label: 'Enable loading animation for non-JS version of collection pages',
        info: 'Visual-only animation; collection data remains fully indexable by search engines.',
        default: false,
      },
    ],
  },
  {
    name: 'Pagination',
    settings: [
      {
        type: 'paragraph',
        content: 'Settings to control the number of items per page',
      },
      {
        type: 'range',
        id: 'articles_per_page',
        min: 3,
        max: 24,
        step: 1,
        label: 'Articles per page',
        default: 12,
      },
      {
        type: 'range',
        id: 'collections_per_page',
        min: 3,
        max: 24,
        step: 1,
        label: 'Collections per page',
        default: 12,
      },
      {
        type: 'range',
        id: 'products_per_page',
        min: 3,
        max: 24,
        step: 1,
        label: 'Products per page',
        default: 12,
      },
    ],
  },
  {
    name: 'Customer Accounts',
    settings: [
      {
        type: 'paragraph',
        content: 'Settings for customers account area',
      },
      {
        type: 'link_list',
        id: 'customers_navigation',
        label: 'Navigation',
        info: 'Navigation shown on account overview, orders, order, and address book pages',
      },
      {
        type: 'url',
        id: 'customer_contact_us_url',
        label: 'URL',
        info: 'Link to redirect users to contact us page',
      },
      {
        type: 'header',
        content: 'Fallback products for Recently Viewed',
        info: 'Displayed when customer has no recently viewed products',
      },
      {
        type: 'product',
        id: 'product_1',
        label: 'Product #1',
      },
      {
        type: 'product',
        id: 'product_2',
        label: 'Product #2',
      },
      {
        type: 'product',
        id: 'product_3',
        label: 'Product #3',
      },
      {
        type: 'product',
        id: 'product_4',
        label: 'Product #4',
      },
      {
        type: 'header',
        content: 'Orders CTA',
        info: 'Displayed when customer has no orders, leave blank to hide',
      },
      {
        type: 'text',
        id: 'customers_orders_cta_text',
        label: 'Label',
      },
      {
        type: 'url',
        id: 'customers_orders_cta_url',
        label: 'URL',
      },
      {
        type: 'header',
        content: 'Order status',
      },
      {
        type: 'checkbox',
        id: 'customer_order_status',
        label: 'Enable customer order status',
        info: 'Display the order status progress bar, this does not affect the display of the track order buttons',
        default: true,
      },
      {
        type: 'number',
        id: 'customer_order_status_threshold',
        label: 'Hide customer order status after # days',
        info: 'Customer order status is automatically hidden after # days after the final fulfilment has shipped, set to 0 to disable',
        default: 7,
      },
      {
        type: 'header',
        content: 'Returns',
      },
      {
        type: 'url',
        id: 'customers_returns_url',
        label: 'URL',
        info: 'Link to returns page displayed on order page, leave blank to hide returns text',
      },
    ],
  },
  {
    name: 'Credentials',
    settings: [
      {
        type: 'paragraph',
        content: 'Keys, tokens, and passwords used for API and app access, do not change unless you know what you\'re doing',
      },
      {
        type: 'header',
        content: 'Shopify storefront',
      },
      {
        type: 'text',
        id: 'storefront_token',
        label: 'Token',
        default: '421f1339007cf0cf4de27add35001700',
      },
      {
        type: 'text',
        id: 'storefront_version',
        label: 'Version',
        default: '2023-07',
      },
    ],
  },
  {
    name: 'GTM',
    settings: [
      {
        type: 'text',
        id: 'gtm_id',
        label: 'Google Tag Manager ID',
        info: 'e.g. GTM-589J9JZS',
      },
    ],
  },
  {
    name: 'Development',
    settings: [
      {
        type: 'paragraph',
        content: 'Theme settings to aid development, automatically disabled on themes that include PRODUCTION in their name (case-insensitive)',
      },
      {
        type: 'header',
        content: 'Shopify',
      },
      {
        type: 'checkbox',
        id: 'remove_preview_bar',
        label: 'Remove preview bar',
        info: 'Prevent Shopify from injecting the preview bar, no preview bar JS or CSS is loaded',
        default: true,
      },
      {
        type: 'checkbox',
        id: 'remove_custom_preview_bar',
        label: 'Remove custom preview bar',
        info: 'Hide the custom replacement preview bar',
      },
      {
        type: 'checkbox',
        id: 'no_index',
        label: 'Disallow search engine crawling',
        info: 'Adds noindex, nofollow meta tag to header, we recommend enabling this on all development themes',
      },
      {
        type: 'header',
        content: 'Vue',
      },
      {
        type: 'checkbox',
        id: 'disable_canvas',
        label: 'Disable Canvas',
        info: 'Completely disable all Canvas functionality including Vue, Vuex, and async component style injection',
      },
      {
        type: 'checkbox',
        id: 'disable_async_components',
        label: 'Disable async components',
        info: 'Prevent async components from changing to \'active\' state, use to preview the static loading template',
      },
      {
        type: 'checkbox',
        id: 'disable_component_ready_state',
        label: 'Disable component ready state',
        info: 'Prevent a component\'s state changing from \'loading\' to \'ready\', manually add an early return to prevent changing state after loading object in your methods, [see documentation](https:/www.notion.so/wemakewebsites/Components-dbc74cac0f2b4049bd5c9d27ea0fab55#a66fd19677a1405ea3f1c205d711db62)',
      },
      {
        type: 'text',
        id: 'disable_component_by_handle',
        label: 'Disable component by handle',
        info: 'Prevent specific async component from changing to \'active\' state, useful for previewing trigger-type component\'s\' static loading template',
      },
      {
        type: 'header',
        content: 'Vuex',
      },
      {
        type: 'checkbox',
        id: 'disable_vuex_persist',
        label: 'Disable Vuex persisted state',
        info: 'Prevent Vuex state from persisting between page loads, this will not delete existing persisted states',
      },
      {
        type: 'checkbox',
        id: 'disable_overlays_dismissed',
        label: 'Disable overlays dismissed state',
        info: 'Ignore the overlays dismissed state so overlays can appear without clearing localStorage',
      },
      {
        type: 'header',
        content: 'CSS',
      },
      {
        type: 'checkbox',
        id: 'disable_theme_styles',
        label: 'Disable theme styles',
        info: 'Disable non-component stylesheets from loading, except critical styles',
      },
    ],
  },
  {
    name: 'Social Media',
    settings: [
      {
        type: 'paragraph',
        content: 'URLs to social media profiles',
      },
      {
        type: 'image_picker',
        id: 'social_media_icon',
        label: 'Social Media Icon',
      },
    ],
  },
  {
    name: 'Collection page settings',
    settings: [
      {
        type: 'select',
        id: 'collection_columns',
        label: 'Number of columns on collection pages',
        options: [
          { value: '3', label: '3 columns' },
          { value: '4', label: '4 columns' },
        ],
        default: '3',
      },
      {
        type: 'select',
        id: 'filters_layout',
        label: 'Show Filters',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        default: 'yes',
      },
    ],
  },
]
