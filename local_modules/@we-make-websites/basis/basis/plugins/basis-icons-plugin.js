/**
 * Plugin: Basis icons plugin
 * -----------------------------------------------------------------------------
 * Adds icon files to dependencies so watch updates on save.
 * - Icons are optimised and compiled using the icons API in Basis core plugin.
 *
 */
const fileSync = require('@we-make-websites/file-sync')
const fs = require('fs-extra')
const path = require('path')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisIconsPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisIconsPlugin {
  apply(compiler) {

    /**
     * Check if required folders exist.
     */
    if (!fs.existsSync(Paths.icons)) {
      return
    }

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async(_, callback) => {
          await this.addIconsToDependencies(compilation)
          callback()
        },
      )
    })
  }

  /**
   * Find all icon SVG files and add to dependencies.
   * @param {Object} compilation - Compilation instance.
   * @returns {Promise}
   */
  addIconsToDependencies(compilation) {
    return new Promise((resolve, reject) => {
      try {
        const iconFilepaths = fileSync(Paths.icons, ['svg'])

        for (const filepath of iconFilepaths) {
          compilation.contextDependencies.add(path.dirname(filepath))
          compilation.fileDependencies.add(require.resolve(filepath))
        }

        debug('Icons', 'Added icons to dependencies', 'bgMagenta')
        resolve()

      } catch (error) {
        debug('Icons', 'Failed add icons to dependencies', 'bgRed')
        reject(error)
      }
    })
  }
}
