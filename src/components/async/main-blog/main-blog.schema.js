/**
 * Schema: Main blog (main-blog)
 * -----------------------------------------------------------------------------
 * Section settings for main blog component.
 *
 */
module.exports = {
  name: 'Blog',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Blog title',
      info: 'Leave blank to not show',
    },
    {
      type: 'text',
      id: 'description',
      label: 'Blog description',
      info: 'Leave blank to not show',
    },
  ],
}
