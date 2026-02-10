/**
 * Plugin: Basis hot plugin
 * -----------------------------------------------------------------------------
 * Handles updating files to work with Webpack dev server in hot mode.
 * - Removes component stylesheet asset_url tags.
 * - Updates other asset_url and asset_img_url tags to point to localhost URLs.
 * - Removes critical stylesheet render tags.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const fileSync = require('@we-make-websites/file-sync')
const Tny = require('@we-make-websites/tannoy')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisHotPlugin'
let liquidAssetFiles = []

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisHotPlugin {
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
        const files = fileSync(Paths.dist.root, ['liquid'])

        /**
         * Build list of Liquid asset files.
         * - Used to not update .liquid filetype asset_url tags.
         */
        liquidAssetFiles = fileSync(Paths.shopify.assets, ['liquid'], { filenames: true })
        liquidAssetFiles = [...liquidAssetFiles].map((name) => name.replace('.liquid', ''))

        /**
         * Build queue.
         */
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
   * - Updates use of asset_url filter.
   * - Remove critical snippet renders as critical styles are served from a
   *   local CSS file in hot mode.
   * @param {String} filepath - Path to Liquid file.
   * @returns {Promise}
   */
  updateLiquidFile(filepath) {
    return new Promise(async(resolve, reject) => {
      const partsReversed = filepath.split(path.sep).reverse()
      const handle = partsReversed[0].replace('.liquid', '')
      const type = partsReversed[1]

      try {
        let contents = await fs.readFile(filepath, 'utf-8')

        if (contents.includes('asset_url')) {
          const staticComponent = type === 'sections' && !contents.includes(`</${handle}>`)
          contents = this.updateAssetUrls(contents, staticComponent)
        }

        if (contents.includes(`render 'critical-`)) {
          contents = this.removeCriticalRender(contents)
        }

        await fs.writeFile(filepath, contents, 'utf-8')
        resolve()

      } catch (error) {
        Tny.message(Tny.colour('red', `❌ Failed to update ${handle} file for dev server`))
        reject(error)
      }
    })
  }

  /**
   * Update asset_url usages.
   * - Removes component stylesheet asset_url.
   * - Injects component tag if section and static component so that hot module
   *   replacement of component styles will work.
   * - Ignores cnvs.urls.missingParameter as that needs to return original.
   * - Also ignores asset files that have a .liquid filetype in assets folder as
   *   we don't compile Liquid on the local asset server.
   * - Updates other instances of asset_url to point to localhost.
   * @param {String} contents - File contents.
   * @param {Boolean} staticComponent - Static component?
   * @returns {String}
   */
  updateAssetUrls(contents, staticComponent) {
    return contents
      .replace(
        /{{ 'component\.(?<filename>.+?)\.css' \| asset_url \| stylesheet_tag }}/g,
        (_, $1) => {
          return staticComponent ? `<${$1}></${$1}>` : ''
        },
      )
      .replace(
        /{{ '(?<filename>.+?)' \| asset_url(?<filters>.*?) }}/gm,
        (match, filename, filters) => {
          if (
            (filename === 'placeholder' && filters.includes(`split: 'placeholder?'`)) ||
            liquidAssetFiles.includes(filename)
          ) {
            return match
          }

          if (filename === 'placeholder') {
            return `{{ '${process.env.ASSETS_URL}/${filename}' | json }}`
          }

          return `{{ '${process.env.ASSETS_URL}/assets/${filename}'${filters} }}`
        },
      )
      .replace(
        /{{ '(?<filename>.+?)' \| asset_img_url(?:: '[0-9]+x')(?<filters>.*?) }}/gm,
        (_, filename, filters) => {
          return `{{ '${process.env.ASSETS_URL}/assets/${filename}'${filters} }}`
        },
      )
  }

  /**
   * Remove critical render from contents.
   * @param {String} contents - File contents.
   * @returns {String}
   */
  removeCriticalRender(contents) {
    return contents.replace(/{% render 'critical-[a-z_-]+' %}/gi, '')
  }
}
