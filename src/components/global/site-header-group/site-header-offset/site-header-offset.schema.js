/**
 * Schema: Site header offset (site-header-offset)
 * -----------------------------------------------------------------------------
 * Section settings for site header offset component.
 *
 */
module.exports = {
  name: 'Site Header Offset',
  settings: [
    {
      type: 'paragraph',
      content: 'The site header offset prevents page content from going behind the site header at the top of the page',
    },
    {
      type: 'checkbox',
      id: 'enable',
      label: 'Enable site header offset',
      default: true,
    },
  ],
}
