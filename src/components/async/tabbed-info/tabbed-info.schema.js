/**
 * Schema: Tabbed info (tabbed-info)
 * -----------------------------------------------------------------------------
 * Section settings for tabbed info component.
 *
 */
module.exports = {
  name: 'Tabbed Info',
  settings: [],
  blocks: [
    {
      name: 'Tab with text',
      type: 'tab-with-text',
      settings: [
        {
          type: 'text',
          id: 'tab_title',
          label: 'Tab Title',
        },
        {
          type: 'text',
          id: 'tab_content_heading',
          label: 'Tab Content Heading',
        },
        {
          type: 'richtext',
          id: 'tab_content',
          label: 'Tab Content',
        },
      ],
    },
    {
      name: 'Tab with before after',
      type: 'tab-with-before-after',
      settings: [
        {
          type: 'text',
          id: 'tab_title',
          label: 'Tab Title',
        },
        {
          type: 'richtext',
          id: 'tab_content',
          label: 'Tab Content',
        },
        {
          type: 'image_picker',
          id: 'before_image',
          label: 'Before image',
        },
        {
          type: 'image_picker',
          id: 'after_image',
          label: 'After image',
        },
        {
          type: 'text',
          id: 'before_image_text',
          label: 'Before Image Text.',
          info: 'Text that will appear under before image.',
        },
        {
          type: 'text',
          id: 'after_image_text',
          label: 'After Image Text',
          info: 'Text that will appear under after image.',
        },
      ],
    },
    {
      name: 'Tab with products',
      type: 'tab-with-products',
      settings: [
        {
          type: 'text',
          id: 'tab_title',
          label: 'Tab Title',
        },
        {
          type: 'richtext',
          id: 'tab_content',
          label: 'Tab Content',
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
          type: 'product',
          id: 'product_5',
          label: 'Product #5',
        },
      ],
    },
  ],
  presets: [
    {
      name: 'Tabbed Info',
    },
  ],
  disabled_on: {
    groups: ['*'],
  },
}
