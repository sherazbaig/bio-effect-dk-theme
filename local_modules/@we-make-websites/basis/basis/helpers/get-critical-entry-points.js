/**
 * Helper: Get critical entry points
 * -----------------------------------------------------------------------------
 * Returns entry points used for critical styles.
 *
 */
const fs = require('fs-extra')
const path = require('path')

const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Object}
 */
module.exports = () => {
  const entryPoints = {}

  if (!fs.existsSync(Paths.styles.critical)) {
    return entryPoints
  }

  fs.readdirSync(Paths.styles.critical).forEach((file) => {
    const name = path.parse(file).name
    const scssFile = path.join(Paths.styles.critical, `${name}.scss`)

    if (!fs.existsSync(scssFile)) {
      return
    }

    entryPoints[`critical-${name}`] = {
      filename: '[name].js',
      import: scssFile,
    }
  })

  return entryPoints
}
