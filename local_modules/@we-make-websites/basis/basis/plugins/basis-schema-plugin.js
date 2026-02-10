/**
 * Plugin: Basis schema plugin
 * -----------------------------------------------------------------------------
 * Adds support for separate schema files and fragments.
 * - Adapted from https://github.com/davidwarrington/liquid-schema-plugin
 * - Creates settings_schema.json file
 * - Updates settings_schema.json theme name and version.
 * - Injects schema settings into section files.
 *
 */
const fs = require('fs-extra')
const fileSync = require('@we-make-websites/file-sync')
const Tny = require('@we-make-websites/tannoy')
const path = require('path')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const getThemeDetails = require('../helpers/get-theme-details')
const getSchemas = require('../helpers/get-schemas')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisSchemaPlugin'
let duplicateSchema = false

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisSchemaPlugin {
  apply(compiler) {

    /**
     * Check if required folders exist.
     */
    if (
      !fs.existsSync(Paths.components.async) &&
      !fs.existsSync(Paths.schemas.root)
    ) {
      return
    }

    /**
     * Update files in before compile, after file copy plugin.
     */
    compiler.hooks.beforeCompile.tapAsync(pluginName, async(_, callback) => {
      await this.createSettingsSchemaJson()
      await this.updateSettingsSchemaVersion()
      await this.mergeSchemasIntoLiquid()
      callback()
    })

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
          if (duplicateSchema) {
            const sectionPath = duplicateSchema.liquid.input
              .split(`src${path.sep}`)[1]
              .replaceAll(path.sep, '/')

            compilation.errors.push(
              new Error(
                Tny.colour('red', `❌ Section schema error - A schema has already been found for ${sectionPath}, remove the duplicate schema JS file`),
              ),
            )

            callback()
            return
          }

          await this.handleDependenciesAndCache(compilation)
          callback()
        },
      )
    })
  }

  /**
   * Create config/settings_schema.json file.
   * @returns {Promise}
   */
  createSettingsSchemaJson() {
    return new Promise(async(resolve, reject) => {
      try {
        if (!fs.existsSync(Paths.schemas.settingsSchema)) {
          resolve()
          return
        }

        const contents = require(Paths.schemas.settingsSchema)
        const json = JSON.stringify(contents, null, 2).replaceAll('/', '\\/')

        /**
         * Create file in dist folder.
         */
        await fs.ensureDir(Paths.dist.config.root)
        await fs.writeFile(Paths.dist.config.schema, json, 'utf-8')
        debug('Schema', 'Created settings_schema.json', 'bgCyan')
        resolve()

      } catch (error) {
        debug('Schema 1', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Update settings schema name and version.
   * - Actioned separately to creation of settings schema file so that it
   *   supports Basis Adapter.
   * @returns {Promise}
   */
  updateSettingsSchemaVersion() {
    return new Promise(async(resolve, reject) => {
      try {
        if (!fs.existsSync(Paths.dist.config.schema)) {
          resolve()
          return
        }

        const theme = getThemeDetails()
        const contents = await fs.readFile(Paths.dist.config.schema, 'utf-8')
        const schema = JSON.parse(contents)
        const themeInfo = this.findThemeInfoPanel(schema)

        /**
         * Replace theme name and version.
         */
        themeInfo.theme_name = theme.name
        themeInfo.theme_version = theme.version
        const json = JSON.stringify(schema, null, 2).replaceAll('/', '\\/')

        /**
         * Write file.
         */
        await fs.writeFile(Paths.dist.config.schema, json, 'utf-8')
        debug('Schema', 'Updated settings schema version', 'bgCyan')
        resolve()

      } catch (error) {
        debug('Schema 2', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Find theme info panel in schema.
   * @param {Array} schema - Settings schema array.
   * @return {Object}
   */
  findThemeInfoPanel(schema) {
    if (!Array.isArray(schema)) {
      return false
    }

    return schema.find((panel) => {
      return typeof panel === 'object' && panel.name === 'theme_info'
    })
  }

  /**
   * Find schemas and merge into corresponding Liquid file.
   * @returns {Promise}
   */
  mergeSchemasIntoLiquid() {
    return new Promise(async(resolve, reject) => {
      try {
        const schemas = await getSchemas()
        const schemaHandles = []

        const queue = schemas.map((schema) => {
          if (schemaHandles.includes(schema.handle)) {
            duplicateSchema = schema
            return false
          }

          if (!schema.liquid) {
            return false
          }

          schemaHandles.push(schema.handle)
          return this.updateLiquidFile(schema)
        }).filter(Boolean)

        await Promise.all(queue)
        debug('Schema', 'Merged schemas into Liquid', 'bgCyan')
        resolve()

      } catch (error) {
        debug('Schema 3', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Find original Liquid file to update with schema.
   * @param {Object} schema - Schema object with Liquid and schema paths.
   * @returns {Promise}
   */
  updateLiquidFile(schema) {
    return new Promise(async(resolve, reject) => {
      try {

        /**
         * Open schema and Liquid file and merge.
         */
        const schemaFile = require(schema.path)
        let contents = await fs.readFile(schema.liquid.input, 'utf-8')
        const json = JSON.stringify(schemaFile, null, 2).replaceAll('/', '\\/')

        contents = contents.replace(
          `{% schema '${schema.handle}' %}`,
          `{% schema %}\n${json}\n{% endschema %}`,
        )

        /**
         * Update Liquid file in dist folder.
         */
        await fs.writeFile(schema.liquid.output, contents, 'utf-8')
        resolve()

      } catch (error) {
        Tny.message(Tny.colour('red', `❌ Failed to find ${schema.liquid?.input} file to inject schema into`))
        debug('Schema 4', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Handle dependencies and cache.
   * - Add schemas and fragments to dependencies so saving triggers compile.
   * - Remove from require cache so they're not cached.
   * @param {Object} compilation - Compilation instance.
   * @returns {Promise}
   */
  handleDependenciesAndCache(compilation) {
    return new Promise(async(resolve, reject) => {
      try {
        const schemas = await getSchemas()
        const sectionFragments = fileSync(Paths.schemas.fragments, ['js'])

        const componentFragments = process.env.CANVAS === 'true'
          ? fileSync(Paths.components.root, ['fragment.js'])
          : []

        const schemaFiles = schemas.map((schema) => schema.path)

        const files = [
          ...sectionFragments,
          ...componentFragments,
          ...schemaFiles,
        ]

        /**
         * Remove each path from cache.
         */
        for (const filepath of files) {
          compilation.contextDependencies.add(path.dirname(filepath))
          compilation.fileDependencies.add(require.resolve(filepath))

          delete require.cache[require.resolve(filepath)]
        }

        debug('Schema', 'Added schemas to dependencies', 'bgCyan')
        resolve()

      } catch (error) {
        debug('Schema 5', error, 'bgRed')
        reject(error)
      }
    })
  }
}
