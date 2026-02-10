/**
 * Schema: Editorial split (editorial-split)
 * -----------------------------------------------------------------------------
 * Section settings for editorial split component.
 *
 */
const backgroundColour = require('../../../schemas/fragments/background-colour')

module.exports = {
  name: 'Editorial Split',
  settings: [
    {
      type: 'header',
      content: 'Section Settings',
    },
    {
      type: 'select',
      id: 'layout_options',
      label: 'Layout Options',
      options: [
        {
          value: 'right',
          label: 'Text Right & Image Left',
        },
        {
          value: 'left',
          label: 'Text Left & Image Right',
        },
      ],
      default: 'left',
    },
    {
      type: 'checkbox',
      id: 'enable_section_padding',
      label: 'Enable section paddings',
      default: true,
    },
    backgroundColour(),
  ],
  blocks: [
    {
      type: 'media-with-text',
      name: 'Media with Text',
      settings: [
        {
          type: 'header',
          content: 'Main Image Content',
        },
        {
          type: 'checkbox',
          id: 'main_image_fit',
          label: 'Fit the image according to the content on desktop',
          default: false,
        },
        {
          type: 'image_picker',
          id: 'main_image',
          label: 'Main Image',
        },
        {
          type: 'video',
          id: 'main_video',
          label: 'Main Video',
          info: 'By uploading an video the Main Image will be overwritten.',
        },
        {
          type: 'header',
          content: 'Text with Image/Video Content',
        },
        {
          type: 'image_picker',
          id: 'content_image',
          label: 'Content Image',
        },
        {
          type: 'video',
          id: 'video',
          label: 'Content Video',
          info: 'By uploading an video the Content Image will be overwritten.',
        },
        {
          type: 'select',
          id: 'video_option',
          label: 'Video Play Option',
          options: [
            {
              value: 'autoplay',
              label: 'Autoplay',
            },
            {
              value: 'click',
              label: 'Click to start',
            },
          ],
          default: 'autoplay',
        },
        {
          type: 'text',
          id: 'title',
          label: 'Title',
        },
        {
          type: 'richtext',
          id: 'content_text',
          label: 'Content text',
        },
        {
          type: 'url',
          id: 'cta_url',
          label: 'CTA Link',
        },
        {
          type: 'text',
          id: 'cta_text',
          label: 'CTA Text',
        },
      ],
    },
  ],
  max_blocks: 1,
  presets: [
    {
      name: 'Editorial Split',
    },
  ],
  disabled_on: {
    groups: ['footer', 'header'],
  },
}
