/**
 * Plugin: Canvas theme variables plugin
 * -----------------------------------------------------------------------------
 * Updates theme variables files with environment variables.
 * - Supports theme-variables.liquid and theme-variables-checkout.liquid.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'CanvasThemeVariablesPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class CanvasThemeVariablesPlugin {
  apply(compiler) {

    /**
     * Only update in Canvas projects.
     */
    if (process.env.CANVAS !== 'true') {
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
          await this.updateThemeVariables()
          callback()
        },
      )
    })
  }

  /**
   * Update theme variables files.
   * @returns {Promise}
   */
  updateThemeVariables() {
    return new Promise(async(resolve) => {
      const canvasPackage = require(Paths.canvas.packageJson)
      const version = canvasPackage.version.split('-beta')[0]

      for (const filepath of Object.values(Paths.shopify.themeVariables)) {
        // eslint-disable-next-line no-await-in-loop
        let contents = await fs.readFile(filepath, 'utf-8')

        contents = contents
          .replaceAll(/(?<quote>'|")CANVAS_VERSION(?:'|")/g, `'${version}'`)
          .replaceAll(/(?<quote>'|")CANVAS_WEBPACK_MODE(?:'|")/g, `'${process.env.MODE}'`)

        /**
         * Release version and Bugsnag API key are only updated when using Buddy
         * as Buddy sets the environment variables on build.
         */
        if (process.env.BUGSNAG_API_KEY) {
          contents = contents.replaceAll(
            /(?<quote>'|")CANVAS_BUGSNAG_API_KEY(?:'|")/g,
            `'${process.env.BUGSNAG_API_KEY}'`,
          )
        }
        if (process.env.RELEASE_VERSION) {
          contents = contents.replaceAll(
            /(?<quote>'|")CANVAS_RELEASE_VERSION(?:'|")/g,
            `'${process.env.RELEASE_VERSION}'`,
          )
        }

        /**
         * Update file.
         */
        const filename = filepath.split(/[\\/]+/).reverse()[0]

        // eslint-disable-next-line no-await-in-loop
        await fs.writeFile(
          path.resolve(Paths.dist.snippets, filename),
          contents,
          'utf-8',
        )
      }

      debug('Theme variables', 'Updated theme variables snippet', 'bgMagenta')
      resolve()
    })
  }
}
