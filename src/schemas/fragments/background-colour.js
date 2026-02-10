/**
 * Schema / Fragment: Background Colour Section.
 * -----------------------------------------------------------------------------
 * Schema fragment for background colour selection.
 * - Usually used for background colour selections
 * - The `excludedColourValues` parameter can be used to filter specific values
 *
 * @param {String} data.defaultBackground - Define the default background colour
 * @param {Array} data.excludedColourValues - Define a list of colour values
 * this section cannot use
 */
const colours = require('./utils/colours')

module.exports = ({
  defaultBackground = '',
  excludedColourValues = [],
} = {}) => {
  const filteredColours = colours.filter(colour => {
    return !excludedColourValues.includes(colour.value)
  })

  let defaultValue = filteredColours[0].value

  if (defaultBackground) {
    const defaultInArray = filteredColours.find(colour => {
      return colour.value === defaultBackground
    })

    if (defaultInArray) {
      defaultValue = defaultInArray.value
    }
  }

  return {
    type: 'select',
    id: 'background_colour',
    label: 'Background colour',
    options: filteredColours,
    default: defaultValue,
    info: `Choose a colour to be this section's background colour`,
  }
}
