/**
 * Schema / Fragment: Text Colour Section.
 * -----------------------------------------------------------------------------
 * Schema fragment for text colour selection.
 * - Usually used for text colour selections
 *
 * @param {String} defaultText - Define the default text colour
 */
module.exports = ({
  defaultText = '--color-stone',
} = {}) => {
  return {
    type: 'select',
    id: 'text_color',
    label: 'Colour scheme',
    options: [
      {
        value: '--color-clouds',
        label: 'White text',
      },
      {
        value: '--color-stone',
        label: 'Black text',
      },
    ],
    default: defaultText,
    info: 'Choose the colour style of the copy text.',
  }
}
