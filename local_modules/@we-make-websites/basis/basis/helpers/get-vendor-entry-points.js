/**
 * Helper: Get vendor entry points
 * -----------------------------------------------------------------------------
 * Returns entry points used for vendor JS files.
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

  if (!fs.existsSync(Paths.scripts.vendors)) {
    return entryPoints
  }

  fs.readdirSync(Paths.scripts.vendors).forEach((file) => {
    const name = path.parse(file).name

    const jsFile = path.join(
      Paths.scripts.vendors,
      `${name}.js`,
    )

    if (!fs.existsSync(jsFile)) {
      return
    }

    entryPoints[`vendor.${name}`] = {
      filename: '[name].js',
      import: jsFile,
    }
  })

  return entryPoints
}
