/**
 * Plugin: Basis security plugin
 * -----------------------------------------------------------------------------
 * Updates robots.txt.liquid for authenticity.
 *
 */
const fs = require('fs-extra')

const debug = require('../helpers/debug')
const getThemeDetails = require('../helpers/get-theme-details')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisSecurityPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisSecurityPlugin {
  apply(compiler) {

    /**
     * Update files in before compile, after file copy plugin.
     */
    compiler.hooks.beforeCompile.tapAsync(pluginName, async(_, callback) => {
      await this.updateRobots()
      callback()
    })
  }

  /**
   * Updates robots.
   */
  updateRobots() {
    return new Promise(async(resolve, reject) => {
      try {
        if (!fs.existsSync(Paths.shopify.robots)) {
          resolve()
          return
        }

        const theme = getThemeDetails()
        let contents = await fs.readFile(Paths.shopify.robots, 'utf-8')

        if (!contents) {
          resolve()
          return
        }

        /**
         * Write changes to file.
         */
        contents = contents.replace(/# Canvas.+/gs, '')
        contents += `# Canvas theme compiled by Basis\n`
        contents += `# Version: ${theme.root}`
        await fs.writeFile(Paths.dist.robots, contents, 'utf-8')

        debug('Security', 'Updated robots', 'bgMagenta')
        resolve()

      } catch (error) {
        debug('Security 1', error, 'bgRed')
        reject(error)
      }
    })
  }
}
