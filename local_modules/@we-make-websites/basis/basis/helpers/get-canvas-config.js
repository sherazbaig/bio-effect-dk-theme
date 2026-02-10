/**
 * Helper: Get Canvas config
 * -----------------------------------------------------------------------------
 * Returns canvas.config.js file if it exists, or adapter.config.js.
 *
 */
const fs = require('fs-extra')

const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Object|Boolean}
 */
module.exports = () => {
  if (
    !fs.existsSync(Paths.adapter.config) &&
    !fs.existsSync(Paths.canvas.config)
  ) {
    return false
  }

  let config = false

  if (fs.existsSync(Paths.canvas.config)) {
    config = require(Paths.canvas.config)
  } else if (fs.existsSync(Paths.adapter.config)) {
    config = require(Paths.adapter.config)
  }

  if (!config) {
    return false
  }

  return config
}
