/**
 * Plugin: Basis theme snippets plugin
 * -----------------------------------------------------------------------------
 * Creates theme script and style Liquid snippets from compilation assets.
 *
 */
/* eslint-disable no-await-in-loop */

const fs = require('fs-extra')
const path = require('path')
const { Compilation } = require('webpack')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const debug = require('../helpers/debug')
const getCanvasConfig = require('../helpers/get-canvas-config')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const argv = yargs(hideBin(process.argv)).argv
const pluginName = 'BasisThemeSnippets'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisThemeSnippets {
  apply(compiler) {

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async(assets, callback) => {
          const config = getCanvasConfig()
          const files = this.buildFiles(compilation, assets)

          await this.createThemeScripts(files, config)
          await this.createThemeStyles(files)
          callback()
        },
      )
    })
  }

  /**
   * Build groups of CSS and JS files.
   * - Adapted from HtmlWebpackPlugin.
   * - https://github.com/jantimon/html-webpack-plugin/blob/main/index.js#L615-L708
   * @param {Object} compilation - Compilation instance.
   * @param {Object} assets - Webpack assets.
   * @returns {Object}
   */
  buildFiles(compilation) {
    const entryNames = Array.from(compilation.entrypoints.keys())
    const extensionRegexp = /\.(?<extension>css|js)(?:\?|$)/

    const data = {
      allFiles: [],
      css: [],
      js: [],
      version: '0',
    }

    for (let index = 0; index < entryNames.length; index++) {
      const entryName = entryNames[index]
      const compilationEntryPoints = compilation.entrypoints.get(entryName).getFiles()

      /**
       * Filter out hot module files.
       */
      const entryPointFiles = compilationEntryPoints.filter((chunkFile) => {
        const asset = compilation.getAsset(chunkFile)

        if (!asset) {
          return true
        }

        const assetMetaInformation = asset.info || {}

        return !(
          assetMetaInformation.hotModuleReplacement ||
          assetMetaInformation.development
        )
      })

      /**
       * Go through each file and sort into extension array.
       */
      entryPointFiles.forEach((filepath) => {

        /**
         * Skip if this file is already added.
         * - Or if vendor.*.js file.
         */
        if (data.allFiles.includes(filepath) || filepath.includes('vendor.')) {
          return
        }

        data.allFiles.push(filepath)
        const extensionMatch = extensionRegexp.exec(filepath)

        /**
         * Skip if filename does not include .css or .js.
         */
        if (!extensionMatch) {
          return
        }

        /**
         * Remove version parameter from filename.
         * - Set data.version based on version parameter.
         */
        let filename = filepath

        if (filepath.includes('?v=')) {
          data.version = filepath.split('?v=')[1]
          filename = filepath.split('?v=')[0]
        }

        /**
         * Place file in correct file extension folder.
         */
        const extension = extensionMatch[1]

        data[extension].push(filename)
      })
    }

    /**
     * Sort entrypoints alphabetically and then by types.
     */
    data.css.sort().sort(this.sortEntryPoints)
    data.js.sort().sort(this.sortEntryPoints)

    return data
  }

  /**
   * Sort entrypoints based on type.
   * - > 0 - Sort a after b.
   * - < 0 - Sort a before b.
   * - 0 - Keep original order.
   * - Order:
   * -- runtime
   * -- critical
   * -- bundle
   * -- layout
   * -- template
   * @param {String} a - First element.
   * @param {String} b - Second element.
   * @returns {Number}
   */
  sortEntryPoints(a, b) {
    const aType = a.split('.')[0].includes('critical-')
      ? 'critical'
      : a.split('.')[0]

    const bType = b.split('.')[0].includes('critical-')
      ? 'critical'
      : b.split('.')[0]

    if (aType !== bType) {
      switch (bType) {
        case 'runtime':
          return 1
        case 'critical':
          return aType === 'runtime' ? -1 : 1
        case 'bundle':
          return aType === 'runtime' || aType === 'critical' ? -1 : 1
        case 'layout':
          return aType === 'template' ? 1 : -1
        case 'template':
          return -1
      }
    }

    return 0
  }

  /**
   * Create theme scripts Liquid snippet.
   * - [type].[structure].js
   * - E.g. layout.theme.js
   * - [type].[structureName].[structureSuffix].js
   * - E.g. template.product.gift-card.js
   * @param {Object} files - Entrypoints filtered into extension arrays.
   * @param {Object} config - Canvas configuration.
   * @returns {Promise}
   */
  createThemeScripts(files, config) {
    return new Promise(async(resolve, reject) => {
      try {
        await fs.ensureDir(Paths.dist.snippets)
        let template = ''

        /**
         * Render script tags.
         */
        for (const file of files.js) {
          template += await this.buildScriptTag({ config, file, files })
        }

        /**
         * Create theme scripts Liquid snippet file.
         */
        fs.writeFile(
          path.join(Paths.dist.snippets, 'theme-scripts.liquid'),
          template,
          'utf-8',
        )

        debug('Theme snippets', 'Created theme scripts snippet', 'bgMagenta')
        resolve()

      } catch (error) {
        debug('Theme snippets 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Builds script tag for each script file.
   * @param {Object} data.config - Canvas configuration.
   * @param {String} data.file - File to build style tag for.
   * @param {Object} data.files - Entrypoints filtered into extension arrays.
   * @returns {Promise}
   */
  buildScriptTag({ config, file, files }) {
    return new Promise((resolve) => {
      let template = ''
      const type = file.split('.')[0]
      const structure = file.replace(`${type}.`, '').replace('.js', '')
      const structureName = structure.split('.')[0]
      const structureSuffix = structure.split('.')[1]?.replace('@', '')

      const loadAttribute = config.asyncScripts?.includes(file) && !argv.hot
        ? 'async'
        : 'defer'

      const src = argv.hot
        ? `${process.env.ASSETS_URL}/${file}`
        : `{{ '${file}' | asset_url | split: '?v=' | first | append: '?v=${files.version}' }}`

      const scriptTag = `<script ${loadAttribute} src="${src}"></script>`

      /**
       * Layouts.
       * - layout.*.js
       */
      if (type === 'layout') {
        template += `\n{%- if layout == '${structure}' -%}\n`
        template += `  ${scriptTag}\n`
        template += '{%- endif -%}\n'

      /**
       * Templates.
       */
      } else if (type === 'template') {

        /**
         * template.customers.js
         * - Custom template.
         */
        if (structure === 'customers') {
          template += `\n{%- if template.directory == 'customers' -%}\n`
          template += `  ${scriptTag}\n`
          template += '{%- endif -%}\n'

        /**
         * template.[structureName].[prefix]-@.js
         */
        } else if (structure.includes('-@')) {
          template += `\n{%- if template.name == '${structureName}' and template.suffix contains '${structureSuffix} %>' -%}\n`
          template += `  ${scriptTag}\n`
          template += '{%- endif -%}\n'

        /**
         * template.[structureName].@.js
         */
        } else if (structure.includes('@')) {
          template += `\n{%- if template.name == '${structureName}' -%}\n`
          template += `  ${scriptTag}\n`
          template += '{%- endif -%}\n'

        /**
         * template.*.js
         */
        } else {
          template += `\n{%- if template == '${structure}' -%}\n`
          template += `  ${scriptTag}\n`
          template += '{%- endif -%}\n'
        }

      /**
       * Critical scripts.
       * - critical-*.js
       */
      } else if (type.includes('critical-')) {
        template += `\n{%- if layout == '${type.split('-')[1]}' -%}\n`
        template += `  ${scriptTag}\n`
        template += '{%- endif -%}\n'

      /**
       * Bundles and runtime.
       * - bundle.*.js
       * - runtime.js
       */
      } else {
        template += `${scriptTag}\n`
      }

      resolve(template)
    })
  }

  /**
   * Create theme styles Liquid snippet.
   * - [type].[structure].css
   * - E.g. layout.theme.css
   * - [type].[structureName].[structureSuffix].css
   * - E.g. template.product.gift-card.css
   * @param {Object} files - Entrypoints filtered into extension arrays.
   * @returns {Promise}
   */
  createThemeStyles(files) {
    return new Promise(async(resolve, reject) => {
      try {
        await fs.ensureDir(Paths.dist.snippets)
        let template = ''

        /**
         * Render style tags.
         */
        for (const file of files.css) {
          template += await this.buildStyleTag({ file, files })
        }

        /**
         * Create theme styles Liquid snippet file.
         */
        fs.writeFile(
          path.join(Paths.dist.snippets, 'theme-styles.liquid'),
          template,
          'utf-8',
        )

        debug('Theme snippets', 'Created theme styles snippet', 'bgMagenta')
        resolve()

      } catch (error) {
        debug('Theme snippets 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Builds style tag for each stylesheet.
   * @param {String} data.file - File to build style tag for.
   * @param {Object} data.files - Entrypoints filtered into extension arrays.
   * @returns {Promise}
   */
  buildStyleTag({ file, files }) {
    return new Promise((resolve) => {
      let template = ''
      const type = file.split('.')[0]
      const structure = file.replace(`${type}.`, '').replace('.css', '')
      const structureName = structure.split('.')[0]
      const structureSuffix = structure.split('.')[1]?.replace('@', '')

      const liquidStructure = structure
        .replaceAll('.', '_')
        .replaceAll('-', '_')
        .replaceAll('@', 'wildcard')

      const liquidVariable = `${type}_${liquidStructure}_url`

      const src = argv.hot
        ? `${process.env.ASSETS_URL}/${file}`
        : `{{ ${liquidVariable} }}`

      let styleTag = ''

      /**
       * Hot mode style tag used for critical stylesheets.
       */
      if (argv.hot) {
        styleTag += `<link href="${src}" rel="stylesheet">`
      } else {
        styleTag += `{{ '${file}' | asset_url | split: '?v=' | first | append: '?v=${files.version}' | stylesheet_tag: preload: true }}`
      }

      /**
       * Layouts.
       * - layout.*.css
       */
      if (type === 'layout') {
        template += `{%- if layout == '${structure}' -%}\n`
        template += `  ${styleTag}\n`
        template += '{%- endif -%}\n\n'

      /**
       * Templates.
       */
      } else if (type === 'template') {

        /**
         * template.customers.css
         * - Custom template.
         */
        if (structure === 'customers') {
          template += `{%- if template.directory == 'customers' -%}\n`
          template += `  ${styleTag}\n`
          template += '{%- endif -%}\n\n'

        /**
         * template.[structureName].[prefix]-@.css
         */
        } else if (structure.includes('-@')) {
          template += `{%- if template.name == '${structureName}' and template.suffix contains '${structureSuffix} %>' -%}\n`
          template += `  ${styleTag}\n`
          template += '{%- endif -%}\n\n'

        /**
         * template.[structureName].@.css
         */
        } else if (structure.includes('@')) {
          template += `{%- if template.name == '${structureName}' -%}\n`
          template += `  ${styleTag}\n`
          template += '{%- endif -%}\n\n'

        /**
         * template.*.css
         */
        } else {
          template += `{%- if template == '${structure}' -%}\n`
          template += `  ${styleTag}\n`
          template += '{%- endif -%}\n\n'
        }

      /**
       * Critical stylesheets.
       * - critical-*.css
       */
      } else if (type.includes('critical-')) {
        template += `{%- if layout == '${type.split('-')[1]}' -%}\n`
        template += `  ${styleTag}\n`
        template += '{%- endif -%}\n\n'

      /**
       * Catch all.
       */
      } else {
        template += `${styleTag}\n`
      }

      resolve(template)
    })
  }
}
