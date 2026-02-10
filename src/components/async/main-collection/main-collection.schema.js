/**
 * Schema: Main collection (main-collection)
 * -----------------------------------------------------------------------------
 * Section settings for main collection component.
 *
 */
module.exports = {
  name: 'Collection',
  settings: [
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
  blocks: [
    {
      name: 'Promo Card',
      type: 'promo',
      limit: 3,
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Promo Title',
        },
        {
          type: 'textarea',
          id: 'description',
          label: 'Promo Description',
        },
        {
          type: 'url',
          id: 'url',
          label: 'Promo URL',
        },
        {
          type: 'image_picker',
          id: 'image',
          label: 'Promo Image',
        },
        {
          type: 'number',
          id: 'position_index',
          label: 'Promo Position Index',
          default: 1,
          info: 'Index start from 0',
        },
      ],
    },
    {
      name: 'Full Width Promo',
      type: 'full_width_promo',
      limit: 2,
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Promo Title',
        },
        {
          type: 'textarea',
          id: 'description',
          label: 'Promo Description',
        },
        {
          type: 'url',
          id: 'cta_url',
          label: 'Promo CTA URL',
        },
        {
          type: 'text',
          id: 'cta_text',
          label: 'Promo CTA Text',
        },
        {
          type: 'select',
          id: 'theme',
          label: 'Text Theme',
          options: [
            {
              value: 'dark',
              label: 'Dark',
            },
            {
              value: 'light',
              label: 'Light',
            },
          ],
          default: 'dark',
        },
        {
          type: 'select',
          id: 'alignment',
          label: 'Alignment',
          options: [
            {
              value: 'left',
              label: 'Left',
            },
            {
              value: 'right',
              label: 'Right',
            },
          ],
          default: 'left',
        },
        {
          type: 'image_picker',
          id: 'image_mobile',
          label: 'Promo Image - Mobile',
        },
        {
          type: 'image_picker',
          id: 'image_desktop',
          label: 'Promo Image - Desktop',
        },
        {
          type: 'number',
          id: 'row_index',
          label: 'Promo Row Index',
          default: 1,
          info: 'Index start from 0',
        },
      ],
    },
    {
      name: 'Banner Card',
      type: 'banner_card',
      limit: 10,
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Banner Title',
        },
        {
          type: 'url',
          id: 'url',
          label: 'Banner URL',
        },
        {
          type: 'image_picker',
          id: 'image',
          label: 'Banner Image',
        },
      ],
    },
  ],
  max_blocks: 15,
}
