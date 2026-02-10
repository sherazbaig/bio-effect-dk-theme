/**
 * Schema: Site footer (site-footer-group)
 * -----------------------------------------------------------------------------
 * Section settings for component.
 *
 */
module.exports = {
  name: 'Site Footer',
  max_blocks: 3,
  settings: [
    {
      type: 'header',
      content: 'Footer Content',
    },
    {
      type: 'image_picker',
      id: 'footer_logo',
      label: 'Footer Logo',
    },
    {
      type: 'richtext',
      id: 'subtext',
      label: 'Subtext',
      info: 'Text which appear under footer logo',
    },
    {
      type: 'richtext',
      id: 'disclaimer_text',
      label: 'Disclaimer text',
    },
    {
      type: 'header',
      content: 'Footer Social Media Links',
    },
    {
      type: 'checkbox',
      id: 'social_media_icons',
      label: 'Enable Footer Social Media Links',
    },
    {
      type: 'text',
      id: 'social_media_title',
      label: 'Social Media Title',
      default: 'We are on social media',
    },
    {
      type: 'header',
      content: 'Newsletter',
    },
    {
      type: 'checkbox',
      id: 'newsletter_form',
      label: 'Enable Newsletter Form',
      default: true,
    },
    {
      type: 'text',
      id: 'newsletter_list_id',
      label: 'Newsletter List ID',
    },
    {
      type: 'text',
      id: 'newsletter_form_title',
      label: 'Newsletter Form Title',
      default: 'Become a member',
    },
  ],
  blocks: [
    {
      name: 'Nav Item List',
      type: 'nav-item-list',
      settings: [
        {
          type: 'link_list',
          id: 'link_list',
          label: 'Link List',
          info: 'Create these in your admin > navigation',
        },
      ],
    },
  ],
}
