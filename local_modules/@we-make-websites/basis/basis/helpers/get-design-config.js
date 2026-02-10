/**
 * Helper: Get design config
 * -----------------------------------------------------------------------------
 * Returns design.config.js file if it exists, or canvas/design-config.js, or
 * canvas/helpers/design-config.js.
 *
 */
const fs = require('fs-extra')

const Paths = require('./paths')

/**
 * Export.
 * @returns {Object|Boolean}
 */
module.exports = () => {
  if (!fs.existsSync(Paths.canvas.design)) {
    return false
  }

  const config = require(Paths.canvas.design)

  if (!config) {
    return false
  }

  return config
}
