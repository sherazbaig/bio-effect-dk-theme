/**
 * Schema: Navigation (site-header-group)
 * -----------------------------------------------------------------------------
 * Section settings for navigation component.
 *
 */
const headerStates = require('#fragments/header-states')

module.exports = {
  name: 'Navigation',
  settings: [
    {
      type: 'paragraph',
      content: 'Contains desktop navigation links',
    },
    {
      type: 'header',
      content: 'Settings',
    },
    {
      type: 'link_list',
      id: 'desktop',
      label: 'Desktop navigation',
      default: 'main-menu',
    },
    ...headerStates(),
  ],
}
