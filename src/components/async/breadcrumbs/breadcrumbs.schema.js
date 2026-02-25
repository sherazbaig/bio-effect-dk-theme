/**
 * Schema: Breadcrumbs (breadcrumbs)
 * -----------------------------------------------------------------------------
 * Section settings for Breadcrumbs Custom component.
 *
 */

module.exports = {
  name: 'Breadcrumbs Custom',
  settings: [],
  presets: [
    {
      name: 'Breadcrumbs Custom',
    },
  ],
  disabled_on: {
    groups: ['404', 'article', 'blog', 'cart', 'collection', 'list-collections', 'page', 'product', 'search', 'customers/account'],
  },
}
