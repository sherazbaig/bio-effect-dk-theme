/**
 * Schema: Main search (main-search)
 * -----------------------------------------------------------------------------
 * Section settings for main search component.
 *
 */
module.exports = {
  name: 'Search',
  settings: [
    {
      type: 'header',
      content: 'Search Settings',
    },
    {
      type: 'range',
      id: 'products_per_page',
      min: 1,
      max: 16,
      step: 1,
      label: 'Products per page',
      default: 10,
      info: 'Used in search page',
    },
    {
      type: 'product_list',
      id: 'up_sell_products',
      label: 'Up-sell Products',
      limit: 6,
    },
  ],
}
