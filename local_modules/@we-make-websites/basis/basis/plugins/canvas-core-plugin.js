/**
 * Plugin: Canvas core plugin
 * -----------------------------------------------------------------------------
 * Core Canvas functionality.
 * - Renames dynamic component asset files.
 * - Removes empty component JS files.
 * - Updates URL parameter to get around Shopify's caching.
 * - Updates sourceMappingURL to get around caching too (used by Basis Adapter).
 * - Updates Canvas shortcodes in JS script files.
 *
 * Reference:
 * - https://webpack.js.org/contribute/writing-a-plugin/
 * - https://stackoverflow.com/questions/65515354/can-i-use-a-webpack-hook-to-modify-file-output-just-before-it-gets-saved
 * - https://webpack.js.org/api/compilation-hooks/#list-of-asset-processing-stages
 *
 */
const { Compilation, sources } = require('webpack')

const debug = require('../helpers/debug')

/**
 * Set variables.
 */
const pluginName = 'CanvasCorePlugin'

let mode
let oldParameter = false
let parameter

/**
 * Tap into hooks and add functionality.
 */
module.exports = class CanvasCorePlugin {
  apply(compiler) {

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      mode = compiler.watchMode ? 'watch' : 'build'
      parameter = oldParameter
      const newParameter = Date.now()
      const updatedAssets = this.getComponentAssetsUpdated()

      /**
       * Only update parameter in certain situations.
       * - In build mode.
       * - Or when in watch and asset filetypes have been updated.
       */
      if (
        (mode === 'build') ||
        (mode === 'watch' && updatedAssets) ||
        !oldParameter
      ) {
        parameter = newParameter
        oldParameter = newParameter
      }

      /**
       * Update scripts now so compiled JS reference their new names.
       */
      compilation.hooks.afterOptimizeChunkModules.tap(pluginName, (chunks) => {
        this.renameChunks(chunks)
      })

      /**
       * List of all assets only available in processAssets.
       */
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        async(assets, callback) => {
          if (process.env.CANVAS !== 'true') {
            callback()
            return
          }

          await this.deleteJunkComponents(compilation, assets)
          await this.updateAssets(compilation, assets)
          callback()
        },
      )
    })
  }

  /**
   * Get if component assets have been updated.
   * @returns {Boolean}
   */
  getComponentAssetsUpdated() {
    const updatedFiletypes = process.env.UPDATED_FILETYPES
      ? JSON.parse(process.env.UPDATED_FILETYPES)
      : false

    if (!updatedFiletypes) {
      return false
    }

    const scripts = ['gql', 'js', 'vue']
    const stylesheets = ['css', 'scss']

    return updatedFiletypes.some((filetype) => {
      return [
        ...scripts,
        ...stylesheets,
      ].includes(filetype)
    })
  }

  /**
   * Update chunk names and adds URL parameter.
   * - Changes component names from component.[handle]-[handle]-vue to
   *   component.[handle] where file matches folder name.
   * - Used https://github.com/sueddeutsche/chunk-rename-webpack-plugin
   *   lib/index.js as reference.
   * @param {Array} chunks - Emitted chunks (JS files).
   */
  renameChunks(chunks) {
    const validPrefixes = [
      'component',
      'layout',
      'template',
    ]

    for (const chunk of chunks) {

      /**
       * Handle bundle prefixed files.
       * - Add URL parameter.
       */
      if (
        chunk?.filenameTemplate === 'bundle.[name].dev.js' ||
        chunk?.filenameTemplate === 'bundle.[name].js'
      ) {
        if (!chunk?.name?.match(/component\..+?-vue/g)) {
          chunk.filenameTemplate = chunk.filenameTemplate.concat(`?v=${parameter}`)
          continue
        }

        /**
         * Handle bundle.component prefixed files.
         * - In rare cases a bundle.component prefixed file can be exported.
         * - Remove bundle filename template so it's exported as a component
         *   prefixed file and updated by component prefix handler.
         * - Remove -vue suffix so it's not ignored by themekit deploy ignores.
         */
        // eslint-disable-next-line no-undefined
        chunk.filenameTemplate = undefined
        chunk.name = chunk.name.replace('-vue')
      }

      /**
       * Determine if component, layout, or template prefixed file.
       */
      const matchedPrefix = validPrefixes.find((prefix) => {
        return chunk?.name?.includes(`${prefix}.`)
      })

      if (!matchedPrefix) {
        continue
      }

      /**
       * Handle component prefixed files.
       * - Rename components that match their folder name.
       * - Add URL parameter.
       */
      chunk.filenameTemplate = chunk.name.concat(`.js?v=${parameter}`)
    }

    debug('Canvas core', 'Renamed JS chunks', 'bgYellow')
  }

  /**
   * Deletes junk component JS files.
   * - Those that don't match their folder name or are static components.
   * - Also removes component.*.js files when an async version exists.
   * @param {Object} compilation - Compilation instance.
   * @param {Array} components - All outputted components.
   * @param {Object} assets - All outputted assets.
   * @returns {Promise}
   */
  deleteJunkComponents(compilation, assets) {
    return new Promise(async(resolve, reject) => {
      try {
        const queue = []

        for (const filepath of Object.keys(assets)) {
          const file = compilation.getAsset(filepath)

          if (!file) {
            continue
          }

          /**
           * Delete junk component (doesn't match folder name).
           */
          if (filepath.match(/component\..+?-vue\.(?:js|css)/g)) {
            queue.push(compilation.deleteAsset(filepath))
            continue
          }

          /**
           * Ignore non-component JS files.
           */
          if (!filepath.match(/component\..+?.js/g)) {
            continue
          }

          /**
           * Check if source is empty or includes just static data object.
           */
          const source = file.source.source()

          if (source !== '' && !source.includes('cnvsStatic:!0')) {
            continue
          }

          queue.push(compilation.deleteAsset(filepath))
        }

        await Promise.all(queue)
        debug('Canvas core', 'Deleted junk components', 'bgYellow')

        resolve()

      } catch (error) {
        debug('Canvas core 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Goes through assets and updates them.
   * - Replaces shortcodes in script JS files.
   * @param {Object} compilation - Compilation instance.
   * @param {Object} assets - All outputted assets.
   * @returns {Promise}
   */
  updateAssets(compilation, assets) {
    return new Promise(async(resolve, reject) => {
      try {

        /**
         * Define supported JS folders.
         */
        const scriptJsFolders = [
          'layout',
          'template',
          'vendor',
        ]

        /**
         * Build queue of files to update.
         */
        const queue = []

        for (const filepath of Object.keys(assets)) {

          /**
           * Handle script JS files.
           */
          const matchedScriptJs = scriptJsFolders.find((folder) => {
            return filepath.includes(`${folder}.`) && filepath.includes('.js')
          })

          if (!matchedScriptJs) {
            continue
          }

          queue.push(this.updateScriptJs(compilation, filepath))
        }

        /**
         * Process queue.
         */
        await Promise.all(queue)
        debug('Canvas core', 'Replaced Canvas shortcodes in JS files', 'bgYellow')
        resolve()

      } catch (error) {
        debug('Canvas core 2', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Update script JS files.
   * - Replaces shortcodes in JS files.
   * - Canvas URL parameter is used for loading trigger-type component CSS.
   * @param {Object} compilation - Compilation instance.
   * @param {String} filepath - Path to output script JS.
   */
  updateScriptJs(compilation, filepath) {
    return new Promise(async(resolve) => {

      /**
       * Update file by replacing shortcodes.
       */
      const file = compilation.getAsset(filepath)
      let contents = file.source.source()?.toString()

      contents = contents.replaceAll('CANVAS_URL_PARAMETER', parameter)

      /**
       * Get map to update sourceMap of updated file.
       */
      const { map } = file.source.sourceAndMap()

      /**
       * Update existing asset with updated code.
       */
      await compilation.updateAsset(
        filepath,
        new sources.SourceMapSource(contents, filepath, map),
      )

      resolve()
    })
  }
}
