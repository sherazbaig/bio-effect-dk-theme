/**
 * Helper: Get layout entry points
 * -----------------------------------------------------------------------------
 * Returns entry points used for layout JS files.
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

  if (!fs.existsSync(Paths.scripts.layout)) {
    return entryPoints
  }

  fs.readdirSync(Paths.scripts.layout).forEach((file) => {
    const name = path.parse(file).name

    const jsFile = path.join(
      Paths.scripts.layout,
      `${name}.js`,
    )

    if (!fs.existsSync(jsFile)) {
      return
    }

    entryPoints[`layout.${name}`] = {
      filename: '[name].js',
      import: jsFile,
    }
  })

  return entryPoints
}
