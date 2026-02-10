/**
 * Schema: Site header (site-header-group)
 * -----------------------------------------------------------------------------
 * Section settings for site header component.
 *
 */
const headerStates = require('#fragments/header-states')

module.exports = {
  name: 'Site Header',
  settings: [
    {
      type: 'paragraph',
      content: 'Site header central banner containing logo, icon buttons, and menu drawer',
    },
    {
      type: 'paragraph',
      content: 'To preview the menu drawer in the Customiser, set the Customiser to Mobile view',
    },
    {
      type: 'header',
      content: 'Settings',
    },
    {
      type: 'link_list',
      id: 'mobile',
      label: 'Mobile navigation',
      default: 'main-menu',
    },
    {
      type: 'link_list',
      id: 'desktop',
      label: 'Desktop navigation',
      default: 'main-menu',
    },
    ...headerStates(),
    {
      type: 'header',
      content: 'Discovery Section',
    },
    {
      type: 'paragraph',
      content: 'Settings relating to the last section on the menu, to add mobile links use the blocks on Site Header',
    },
    {
      type: 'checkbox',
      id: 'show_discovery',
      label: 'Show Discovery Section',
      default: true,
      info: 'If checked the discovery section is shown in the menu, if unchecked it is not',
    },
    {
      type: 'text',
      id: 'discover_title',
      label: 'Discover menu title',
      default: 'Discover',
    },
    {
      type: 'image_picker',
      id: 'desktop_image',
      label: 'Desktop Image',
    },
    {
      type: 'text',
      id: 'desktop_link_text',
      label: 'Desktop Link Text',
      info: 'Text shown underneath image on desktop nav',
    },
    {
      type: 'url',
      id: 'desktop_link_page',
      label: 'Desktop Link Location',
    },
    {
      type: 'header',
      content: 'Account links',
    },
    {
      type: 'checkbox',
      id: 'display_account',
      label: 'Display the Account and the Login/Register links in Mobile Navigation',
      default: true,
    },
  ],
  blocks: [
    {
      type: 'link',
      name: 'Mobile Link',
      settings: [
        {
          type: 'url',
          id: 'page',
          label: 'Link',
        },
        {
          type: 'text',
          id: 'title',
          label: 'Label',
        },
      ],
    },
  ],
}
