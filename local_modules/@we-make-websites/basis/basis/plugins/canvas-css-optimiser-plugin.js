/**
 * Plugin: Canvas CSS optimiser plugin
 * -----------------------------------------------------------------------------
 * 'Breezy top' CSS optimiser plugin.
 * - Removes unused utility and grid classes during build.
 */
/* eslint-disable no-control-regex, no-useless-escape, prefer-named-capture-group */
const fs = require('fs-extra')
const path = require('path')
const fileSync = require('@we-make-websites/file-sync')
const Tny = require('@we-make-websites/tannoy')
const { Compilation, sources } = require('webpack')

const debug = require('../helpers/debug')
const getCanvasConfig = require('../helpers/get-canvas-config')
const getDesignConfig = require('../helpers/get-design-config')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const canvasConfig = getCanvasConfig()
const designConfig = getDesignConfig()
const isProduction = process.env.NODE_ENV === 'production'
const pluginName = 'CanvasCssOptimiserPlugin'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class CanvasCssOptimiserPlugin {
  apply(compiler) {
    if (
      process.env.CANVAS !== 'true' ||
      !canvasConfig.cssOptimiser?.enable ||
      (!canvasConfig.cssOptimiser?.enableDevMode && !isProduction)
    ) {
      return
    }

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

      /**
       * List of all assets only available in processAssets.
       * - Can only update stylesheets once they're compiled.
       */
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        async(assets, callback) => {
          const activeClasses = await this.buildActiveClasses()

          await this.removeUnusedCss({
            activeClasses,
            assets,
            config: canvasConfig.cssOptimiser,
            compilation,
          })

          callback()
        },
      )
    })
  }

  /**
   * Go through all Liquid and Vue files to determine classes in active use.
   * @returns {Promise}
   */
  buildActiveClasses() {
    return new Promise(async(resolve, reject) => {
      try {
        const filepaths = fileSync(Paths.src, ['liquid', 'vue'])

        /**
         * Build array of all classes used in files.
         */
        const fileClasses = []

        for (const filepath of filepaths) {
          // eslint-disable-next-line no-await-in-loop
          const file = await fs.readFile(filepath, 'utf-8')
          const debugMessages = []
          let outputDebugMessages = false

          if (process.env.DEBUG_CLASSES === 'true') {
            const displayPath = filepath
              .split('src')[1]
              .replaceAll(path.sep, '/')

            debugMessages.push(Tny.colour('blue', displayPath))
          }

          /**
           * Match instances of `class=""`.
           * - Ignores preceding characters so it doesn't include Vue's :class.
           * - Then filter out Liquid objects and tags.
           */
          const classMatches = file.matchAll(/(?<![:\-a-z])class="(?<value>.+?)"/gs)

          for (const match of classMatches) {
            const classes = match.groups.value
              .replace(/{{.+?}}/g, '')
              .replace(/{%.+?%}/g, '')
              .replace(/\s{2,}/g, ' ')
              .replaceAll('\n', '')
              .split(' ')

            fileClasses.push(...classes)

            if (process.env.DEBUG_CLASSES === 'true') {
              outputDebugMessages = true
              debugMessages.push(...classes)
            }
          }

          /**
           * Match instances of class: '' or class_#: ''.
           */
          const propMatches = file.matchAll(/class(?:[a-z_]+)?:\s*'(?<value>[a-z\-_0-9:\s]+)'/gs)

          for (const match of propMatches) {
            const classes = match.groups.value
              .replace(/\s{2,}/g, ' ')
              .replaceAll('\n', '')
              .split(' ')

            fileClasses.push(...classes)

            if (process.env.DEBUG_CLASSES === 'true') {
              outputDebugMessages = true
              debugMessages.push(...classes)
            }
          }

          if (process.env.DEBUG_CLASSES === 'true' && outputDebugMessages) {
            Tny.message(debugMessages, { after: false, before: false })
          }
        }

        /**
         * Add classes found in Canvas scripts/config/classes.js.
         */
        if (fs.existsSync(Paths.scripts.configClasses)) {
          const file = await fs.readFile(Paths.scripts.configClasses, 'utf-8')
          const regex = new RegExp('\'(?<cssClass>[a-z-]+)\'', 'gi')
          const classes = [...file.matchAll(regex)].map((match) => match.groups.cssClass)
          fileClasses.push(...classes)
        }

        /**
         * Filter non-unique classes to get active classes.
         */
        let activeClasses = []

        fileClasses.forEach((string) => {
          if (activeClasses.includes(string) || !string) {
            return
          }

          activeClasses.push(string)
        })

        activeClasses = activeClasses.sort()
        resolve(activeClasses)

      } catch (error) {
        debug('CSS optimiser 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Runs through each stylesheet defined in config and removes unused classes.
   * @param {Array} activeClasses - Classes in active use in files.
   * @param {Object} assets - All outputted assets.
   * @param {Object} compilation - Compilation instance.
   * @param {Object} config - Canvas CSS optimiser configuration.
   * @returns {Promise}
   */
  removeUnusedCss({ activeClasses, assets, compilation, config }) {
    return new Promise(async(resolve, reject) => {
      try {

        /**
         * Filter assets to only the stylesheets set in Canvas config.
         */
        const stylesheets = Object.keys(assets).filter((filepath) => {
          return config.stylesheets.find((stylesheet) => {
            return filepath.includes(stylesheet)
          })
        })

        /**
         * Go through each stylesheet and filter out unused classes.
         */
        const queue = []

        for (const filepath of stylesheets) {
          const file = compilation.getAsset(filepath)
          let stylesheet = file.source.source()

          /**
           * Remove comments and excess newlines if in development mode.
           */
          if (!isProduction) {
            const commentRegex = new RegExp('\\/\\*{1,2}.+?\\*\\/', 'gs')
            const emptyLinesRegex = new RegExp('^\\s*$\n', 'gm')

            stylesheet = stylesheet
              .replace(commentRegex, '')
              .replace(emptyLinesRegex, '')
          }

          /**
           * Match queries, selectors, and declarations.
           */
          const regex = isProduction
            ? new RegExp('(?<query>@media\(.+?\){.+?}})|(?<selectors>[^{}]+)(?<cssDeclaration>{[^}]+}{1,2})', 'gi')
            : new RegExp('(?<query>@media\\s?\(.+?\)\\s{.+?\\s{2}}\n})|(?<selectors>^[^{}]+)(?<cssDeclaration>{[^}]+}$)', 'gms')

          const matches = stylesheet.matchAll(regex)

          const updatedStyles = this.optimiseStyles({
            activeClasses,
            config,
            matches: [...matches],
          })

          queue.push(
            compilation.updateAsset(
              filepath,
              new sources.RawSource(updatedStyles),
            ),
          )
        }

        await Promise.all(queue)

        debug('CSS optimiser', 'Removed unused CSS', 'bgBlue')
        resolve()

      } catch (error) {
        debug('CSS optimiser 2', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Optimise styles in stylesheet.
   * @param {Array} activeClasses - Classes in active use in files.
   * @param {Object} config - Canvas CSS optimiser configuration.
   * @param {Array} matches - Regex matches from match all.
   * @param {Object} matches[].groups - Named capture groups.
   * @returns {String}
   */
  optimiseStyles({ activeClasses, config, matches }) {
    return matches
      .map((match) => {
        const { cssDeclaration, selectors, query } = match.groups

        /**
         * Handle media queries.
         */
        if (query) {
          return this.optimiseMediaQuery({ activeClasses, config, query })
        }

        /**
         * Filter out unused selector in selectors.
         */
        const optimisedSelectors = this.optimiseSelectors({
          activeClasses,
          config,
          selectors,
        })

        /**
         * If classes left in class block after filtering then add back into the
         * optimised stylesheet.
         * - Add space between selectors and declaration in development mode if
         *   no space exists in other variables.
         */
        if (optimisedSelectors.length) {
          const joinedSelectors = optimisedSelectors.join(',')
          let join = ''

          if (
            !isProduction &&
            joinedSelectors.slice(-1) !== ' ' &&
            cssDeclaration.slice(0, 1) !== ' '
          ) {
            join = ' '
          }

          return joinedSelectors + join + cssDeclaration
        }

        return false
      })
      .filter(Boolean)
      .join(isProduction ? '' : '\n')
  }

  /**
   * Optimise media query.
   * @param {Array} activeClasses - Classes in active use in files.
   * @param {Object} config - Canvas CSS optimiser configuration.
   * @param {String} query - Capture media query block.
   * @returns {String|Boolean} - Optimised query block or false if the whole
   * media query should be removed from stylesheet.
   */
  optimiseMediaQuery({ activeClasses, config, query }) {
    const mediaRegex = isProduction
      ? new RegExp('@media\(.+?\){', 'g')
      : new RegExp('@media\\s?\(.+?\)\\s?{', 'g')

    const mediaQuery = query.match(mediaRegex)[0]

    let formattedQuery = query.replace(mediaQuery, '')

    /**
     * Remove media queries closing '}'.
     * - Production is minified to '}}'.
     * - Development has '}' on its own line without indentation.
     */
    formattedQuery = isProduction
      ? formattedQuery.replace('}}', '}')
      : formattedQuery.replace(/^}$/gm, '')

    const queryRegex = new RegExp('(?<querySelectors>[^{}]+)(?<queryDeclaration>{[^}]+}{1,2})', 'gi')
    const queryMatches = formattedQuery.matchAll(queryRegex)

    /**
     * Go through each block in media query and remove if unused.
     */
    const optimisedQueryBlocks = [...queryMatches].map((queryMatch) => {
      const { queryDeclaration, querySelectors } = queryMatch.groups

      const optimisedQuerySelectors = this.optimiseSelectors({
        activeClasses,
        config,
        selectors: querySelectors,
      })

      if (optimisedQuerySelectors.length) {
        return optimisedQuerySelectors.join(',') + queryDeclaration
      }

      return false
    }).filter(Boolean)

    if (optimisedQueryBlocks.length) {
      const endCharacter = isProduction ? '}' : '\n}'
      return mediaQuery + optimisedQueryBlocks.join(isProduction ? '' : '\n') + endCharacter
    }

    return false
  }

  /**
   * Optimise selectors.
   * - selectors - '.foo.bar,.bar.foo'.
   * - selector - '.foo.bar'.
   * - classes - ['foo', 'bar'].
   * - cssClass - 'foo'.
   * @param {Array} activeClasses - Classes in active use in files.
   * @param {Object} config - Canvas CSS optimiser configuration.
   * @param {String} selectors - All selectors for declaration.
   * @returns {Array} - Optimised array of selectors that are used.
   */
  optimiseSelectors({ activeClasses, config, selectors }) {
    return selectors.split(',').filter((selector) => {
      const classes = selector.split('.')
      let selectorHasInactiveClass = false
      let selectorHasOptimisedClass = false

      /**
       * Work through classes in selector in reverse.
       * - If a parent class is never used, it doesn't matter about any of the
       *   child classes, they can be removed if in config.
       */
      for (const cssClass of classes.reverse()) {
        const formattedClass = this.formatClass(cssClass)

        if (!formattedClass) {
          continue
        }

        /**
         * Check to see if formatted class appears in active classes or if it's
         * specified in config to not remove.
         */
        if (
          !activeClasses.includes(formattedClass) &&
          !config.keep?.includes(formattedClass)
        ) {
          selectorHasInactiveClass = true
        }

        if (!selectorHasInactiveClass) {
          continue
        }

        /**
         * Combine Canvas config classes and design utility stylesheet config.
         */
        const designConfigClasses = []

        if (designConfig?.utilities) {
          designConfig.utilities.forEach((stylesheet) => {
            stylesheet.classes.forEach((classObject) => {
              designConfigClasses.push(`${classObject.prefix}-`)
            })
          })
        }

        const combinedClasses = [
          ...config.classes,
          ...designConfigClasses,
        ]

        /**
         * Once an inactive class has been found we need to find out if a parent
         * class is in the CSS optimiser config.
         * - Supports partial classes in config.
         * - E.g. the class 'text-center' will match the config class 'text-'.
         */
        const configContainsClass = combinedClasses.some((configClass) => {
          return formattedClass.indexOf(configClass) === 0
        })

        if (!configContainsClass) {
          continue
        }

        selectorHasOptimisedClass = true
      }

      /**
       * If selector has both inactive class and optimise class then remove.
       */
      return !selectorHasInactiveClass || !selectorHasOptimisedClass
    })
  }

  /**
   * Formats class to remove combinators and pseudo selectors.
   * @param {String} string - Class.
   * @returns {String}
   */
  formatClass(string) {
    if (!string) {
      return string
    }

    const combinatorRegex = new RegExp('[>+~\\s]', 'g')
    const pseudoRegex = new RegExp(':+', 'g')

    return string
      .replace(combinatorRegex, '')
      .split(pseudoRegex)[0]
  }
}
