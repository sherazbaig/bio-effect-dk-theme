/**
 * Plugin: Basis dev server plugin
 * -----------------------------------------------------------------------------
 * Handles updating files to work with Webpack dev server.
 * - Updates asset_url links in Liquid files to point to localhost versions.
 *
 */
const fs = require('fs-extra')
const Tny = require('@we-make-websites/tannoy')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const getFilesInFolder = require('../helpers/get-files-in-folder')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisDevServerPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisDevServerPlugin {
  apply(compiler) {

    /**
     * Check if required environment variable is set.
     */
    if (process.env.HOT !== 'true') {
      return
    }

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        async(_, callback) => {
          await this.updateLiquidFiles()
          callback()
        },
      )
    })
  }

  /**
   * Find all Liquid files and update them.
   * @returns {Promise}
   */
  updateLiquidFiles() {
    return new Promise(async(resolve, reject) => {
      try {
        const files = getFilesInFolder(Paths.dist.root, ['liquid'])

        const queue = [...files].map((filepath) => {
          return this.updateLiquidFile(filepath)
        })

        await Promise.all(queue)
        debug('Dev server', 'Updated Liquid files', 'bgBlue')
        resolve()

      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Update Liquid file.
   * - Replace asset_url Liquid with direct link to localhost asset.
   * - Special conditions for theme-variables.liquid cnvs.urls.
   * @param {String} filepath - Path to Liquid file.
   * @returns {Promise}
   */
  updateLiquidFile(filepath) {
    return new Promise(async(resolve, reject) => {
      const handle = filepath
        .split(/[\\/]+/g)
        .reverse()[0]
        .replace('.liquid', '')

      try {
        let contents = await fs.readFile(filepath, 'utf-8')

        if (!contents.includes('asset_url')) {
          resolve()
          return
        }

        contents = contents.replace(
          /{{ '(?<filename>.+)'.+(?=asset_url)(?<filters>.+) }}/gm,
          (match, filename, filters) => {
            const localhostUrl = `http://localhost:${process.env.ASSETS_PORT}/${filename}`

            /**
             * Special condition for placeholder in theme-variables.liquid.
             * - If split filter then we're editing missingParameter and don't
             *   want to update it so return original match.
             * - Otherwise we're editing assets and want to use localhost URL.
             */
            if (filename === 'placeholder') {
              if (filters.includes(`split: 'placeholder?'`)) {
                return match
              }

              return `{{ '${localhostUrl}' | json }}`
            }

            return ''
          },
        )

        await fs.writeFile(filepath, contents, 'utf-8')
        resolve()

      } catch (error) {
        Tny.message(Tny.colour('red', `❌ Failed to update ${handle} file for dev server`))
        reject(error)
      }
    })
  }
}
