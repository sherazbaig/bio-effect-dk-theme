/**
 * Plugin: Basis empty imports plugin
 * -----------------------------------------------------------------------------
 * Switch imports with empty file when condition is met according to config.
 *
 */
const fileSync = require('@we-make-websites/file-sync')
const path = require('path')
const Webpack = require('webpack')

const debug = require('../helpers/debug')
const getCanvasConfig = require('../helpers/get-canvas-config')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const canvasConfig = getCanvasConfig()
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Export plugins.
 * @param {Array} plugins - List of webpack plugins currently in use.
 */
module.exports = (plugins) => {
  if (!isProduction || !canvasConfig || !canvasConfig.emptyImports) {
    return
  }

  /**
   * Find all files in scripts/ folder with `.empty.js` filetype.
   */
  const emptyFilepaths = fileSync(Paths.scripts.root, ['empty.js'])

  for (const emptyFilepath of emptyFilepaths) {
    const filepath = emptyFilepath.replace('.empty', '')
    const handle = filepath.split(path.sep).reverse()[0].replace('.js', '')

    /**
     * Can't simply check `canvasConfig.emptyImports[handle]` because the value
     * can be undefined so look to see if key exists in Object keys array.
     */
    const handleExists = Object.keys(canvasConfig.emptyImports).find((key) => {
      return key === handle
    })

    /**
     * Early return if there is no corresponding config.
     */
    if (!handleExists) {
      continue
    }

    /**
     * Determine if property variable matches defined value.
     * - If it does, or is a true boolean, then replace file with empty file.
     * - If variable is false then also check for null and undefined.
     */
    let variableMatchesValue = false
    const handleObject = canvasConfig.emptyImports[handle]

    if (typeof handleObject === 'boolean') {
      variableMatchesValue = handleObject
    } else if (handleObject.value === false) {
      variableMatchesValue = !process.env[handleObject.variable]
    } else {
      variableMatchesValue = process.env[handleObject.variable] === handleObject.value
    }

    if (!variableMatchesValue) {
      continue
    }

    /**
     * Replace file with empty file when config condition is true.
     */
    const regexFilepath = filepath
      .split(/src[\\/]/)[1]
      .replaceAll(path.sep, '[\\\\/]')

    const regex = new RegExp(regexFilepath)
    const emptyFile = `./${handle}.empty.js`

    debug('Empty imports', `Replacing ${regexFilepath.replaceAll('[\\\\/]', '/')} with ${handle}.empty.js`, 'bgMagenta')

    plugins.push(
      new Webpack.NormalModuleReplacementPlugin(regex, emptyFile),
    )
  }
}
