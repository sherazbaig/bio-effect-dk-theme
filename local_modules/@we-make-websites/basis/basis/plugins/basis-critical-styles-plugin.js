/**
 * Plugin: Basis critical styles plugin
 * -----------------------------------------------------------------------------
 * Creates Liquid snippets from critical style entry points.
 * - Updates compiled critical styles to support Liquid settings.
 * - Deletes JS and SCSS source files once Liquid snippets are created.
 * - In hot mode critical styles are served from CSS files so changes are
 *   instantly updated.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const { Compilation } = require('webpack')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const argv = yargs(hideBin(process.argv)).argv
const pluginName = 'BasisCriticalStylesPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisCriticalStylesPlugin {
  apply(compiler) {

    /**
     * Early return if no critical styles exist or in hot mode.
     */
    if (!fs.existsSync(Paths.styles.critical) || argv.hot) {
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
        async(assets, callback) => {
          await this.createCriticalLiquidSnippets(compilation, assets)
          callback()
        },
      )

      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        async(assets, callback) => {
          await this.deleteCriticalSourceFiles(compilation, assets)
          callback()
        },
      )
    })
  }

  /**
   * Creates critical Liquid snippet files from generated CSS.
   * - Also updates CSS to add Liquid support.
   * Finds, queues, and updates critical style files.
   * @param {Object} compilation - Compilation instance.
   * @param {Object} assets - Webpack assets.
   * @returns {Promise}
   */
  createCriticalLiquidSnippets(compilation, assets) {
    return new Promise(async(resolve, reject) => {
      try {
        await fs.ensureDir(Paths.dist.snippets)
        const queue = []

        /**
         * Filter generated assets list to just critical CSS files.
         */
        const files = Object.keys(assets).filter((filepath) => {
          return filepath.match(/critical-[a-z0-9-_]+\.css/g)
        })

        for (const filepath of files) {
          const file = compilation.getAsset(filepath)

          if (!file) {
            continue
          }

          const handle = file.name.replace('.css', '')

          /**
           * Open and update CSS to support Liquid.
           */
          const css = this.openCssFile(file)

          /**
           * Create Liquid snippet file.
           */
          queue.push(fs.writeFile(
            path.join(Paths.dist.snippets, `${handle}.liquid`),
            `<style>${css}</style>`,
            'utf-8',
          ))
        }

        await Promise.all(queue)
        debug('Critical styles', 'Created critical liquid snippets', 'bgCyan')
        resolve()

      } catch (error) {
        debug('Critical styles 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Opens and updates critical stylesheet.
   * - Looks for Liquid objects in single quotes and removes quotes.
   * - Also replaces quotations with single quotes.
   * @param {Object} file - Compiled file.
   * @returns {String}
   */
  openCssFile(file) {
    return file.source.source()
      .replace(
        /'(?<liquid>[{%]{2} .+? [%}]{2})'/g,
        (_, $1) => {
          return $1.replaceAll(`"`, `'`)
        },
      )
      .trim()
  }

  /**
   * Delete critical stylesheet source files.
   * - JS file is created so webpack compiles the CSS file.
   * - CSS file is read and copied into Liquid snippet.
   * - Neither are needed after Liquid snippet is created.
   * @param {Object} compilation - Webpack compilation.
   * @param {Object} assets - Webpack assets.
   * @returns {Promise}
   */
  deleteCriticalSourceFiles(compilation, assets) {
    return new Promise(async(resolve) => {
      const queue = []

      for (const filepath of Object.keys(assets)) {
        if (!filepath.match(/critical-[a-z0-9-_]+\.(?:css|js)/g)) {
          continue
        }

        queue.push(compilation.deleteAsset(filepath))
      }

      await Promise.all(queue)
      debug('Critical styles', 'Deleted critical source files', 'bgCyan')
      resolve()
    })
  }
}
