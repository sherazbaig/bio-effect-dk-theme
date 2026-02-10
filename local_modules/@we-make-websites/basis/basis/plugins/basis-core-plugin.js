/**
 * Plugin: Basis core plugin
 * -----------------------------------------------------------------------------
 * Core Basis plugin to extend webpack functionality.
 * - Generates array of updated filetypes in watch/hot mode.
 * - Runs icons and strings functionality.
 * - Removes .gitkeep placeholder files.
 *
 */
const fs = require('fs-extra')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const iconsApi = require('../apis/icons')
const Paths = require('../helpers/paths')
const stringsApi = require('../apis/strings')

/**
 * Set variables.
 */
const pluginName = 'BasisPlugin'
const isProduction = process.env.NODE_ENV === 'production'

let icons
let strings
let updatedFiletypes = []

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisPlugin {
  apply(compiler) {

    /**
     * When in watch mode create an array of updated filetypes.
     * - Used to check if a new URL parameter is needed in Canvas if an asset
     *   filetype has updated.
     * - Also checks if files need uploading or refreshing when in hot mode.
     */
    compiler.hooks.watchRun.tapAsync(pluginName, (compilation, callback) => {
      updatedFiletypes = []

      if (
        !compilation.modifiedFiles ||
        !Array.from(compilation.modifiedFiles).length
      ) {
        callback()
        return
      }

      for (const filepath of compilation.modifiedFiles) {
        let filetype = filepath.match(/\.(?<filetype>[a-z]{2,})$/g)

        if (!filetype?.length) {
          continue
        }

        filetype = filetype[0].replace('.', '')

        /**
         * Special check for .schema.js and schemas/ folder files.
         */
        if (
          filepath.includes('.schema.js') ||
          filepath.includes(Paths.schemas.root)
        ) {
          filetype = 'schema.js'
        }

        /**
         * Add only unique values to array.
         */
        if (updatedFiletypes.includes(filetype)) {
          continue
        }

        updatedFiletypes.push(filetype)
      }

      process.env.UPDATED_FILETYPES = JSON.stringify(updatedFiletypes)
      callback()
    })

    /**
     * Before compile optimise icon files and update strings.
     */
    compiler.hooks.beforeCompile.tapAsync(pluginName, async(_, callback) => {

      /**
       * Run icons optimisation if folder exists.
       */
      if (fs.existsSync(Paths.icons)) {
        icons = await iconsApi.loadOptimise()
        process.env.ICONS = JSON.stringify(icons)
      }

      /**
       * Find all strings and validate.
       */
      if (process.env.CANVAS === 'true') {
        strings = await stringsApi.findStrings(strings)
        const stringErrors = await stringsApi.validateStrings(strings)
        process.env.STRINGS = JSON.stringify(strings)
        process.env.STRING_ERRORS = JSON.stringify(stringErrors)
      }

      callback()
    })

    /**
     * After main compilation run processes.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        async(assets, callback) => {
          await this.deleteJunkFiles(compilation, assets)
          const stats = compilation.getStats().toJson({}, true)

          /**
           * If errors then build failed.
           */
          if (stats.errors.length) {
            process.env.BUILDING = JSON.stringify(false)
            callback()
            return
          }

          /**
           * Create Liquid snippets for icons.
           */
          if (fs.existsSync(Paths.icons) && icons) {
            try {
              await iconsApi.buildSnippets(icons)

            } catch (error) {
              debug('Basis core 1', error, 'bgRed')
              throw new Error(error)
            }
          }

          /**
           * Build string Liquid snippet on first build or after new strings.
           * - Don't run if component folder doesn't exist.
           */
          if (process.env.CANVAS !== 'true') {
            callback()
            return
          }

          if (
            process.env.FIRST_BUILD === 'true' ||
            (strings?.count && strings?.updated)
          ) {
            try {
              await stringsApi.buildSnippet(strings)

            } catch (error) {
              debug('Basis core 1', error, 'bgRed')
              throw new Error(error)
            }
          }

          /**
           * Finish.
           */
          callback()
        },
      )
    })
  }

  /**
   * Delete junk files.
   * - Deletes .gitkeep and .DS_Store files.
   * - Removes empty JS layout, template, or vendor files.
   * - Critical JS files are deleted in `basis-critical-styles-plugin.js`.
   * @param {Object} compilation - Webpack compilation.
   * @param {Object} assets - Webpack assets.
   * @returns {Promise}
   */
  deleteJunkFiles(compilation, assets) {
    return new Promise(async(resolve, reject) => {
      try {
        const queue = []

        /**
         * Go through all assets.
         */
        for (const filepath of Object.keys(assets)) {
          const file = compilation.getAsset(filepath)

          if (!file) {
            continue
          }

          /**
           * Delete .gitkeep and .DS_Store files.
           */
          if (filepath.includes('.gitkeep') || filepath.includes('.DS_Store')) {
            queue.push(compilation.deleteAsset(filepath))
            continue
          }

          /**
           * Ignore non-supported JS files in production mode.
           */
          const matchedJsFile = ['layout.', 'template.', 'vendor.'].find((prefix) => {
            return filepath.includes(prefix)
          })

          if (!matchedJsFile || !isProduction) {
            continue
          }

          /**
           * Check if source is empty.
           */
          const source = file.source.source()

          if (source !== '') {
            continue
          }

          queue.push(compilation.deleteAsset(filepath))
        }

        await Promise.all(queue)

        debug('Basis core', 'Deleted junk files', 'bgYellow')
        resolve()

      } catch (error) {
        debug('Basis core 1', error, 'bgRed')
        reject(error)
      }
    })
  }
}
