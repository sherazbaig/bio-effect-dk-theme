/**
 * Helper: Get section schemas.
 * -----------------------------------------------------------------------------
 * Get all schema files in components and schemas folders, and match them with
 * their corresponding section Liquid file.
 *
 */
const path = require('path')
const fileSync = require('@we-make-websites/file-sync')

const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Promise}
 */
module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      const schemas = []

      /**
       * Find all schema files.
       */
      const componentSchemas = process.env.CANVAS === 'true'
        ? fileSync(Paths.components.root, ['schema.js'])
        : []

      const sectionSchemas = fileSync(Paths.schemas.root, ['js'])

      const schemaFiles = [
        ...componentSchemas,
        ...sectionSchemas,
      ]

      /**
       * Find all section Liquid files.
       */
      const componentLiquidFiles = process.env.CANVAS === 'true'
        ? fileSync(Paths.components.root, ['section.liquid'])
        : []

      const sectionLiquidFiles = fileSync(Paths.shopify.sections, ['liquid'])

      const liquidFiles = [
        ...componentLiquidFiles,
        ...sectionLiquidFiles,
      ]

      /**
       * Iterate through schema files and match with section Liquid files.
       */
      for (const schemaFilepath of schemaFiles) {
        if (schemaFilepath.includes('fragments')) {
          continue
        }

        const handle = schemaFilepath
          .split(/[\\/]+/g)
          .reverse()[0]
          .split('.')[0]

        /**
         * Build base data.
         */
        const data = {
          handle,
          path: schemaFilepath,
        }

        /**
         * Check if there is a matching section Liquid file.
         * - Build Liquid data object if there is.
         */
        const input = liquidFiles.find((liquidFile) => {
          const liquidHandle = liquidFile.split(/[\\/]+/g).reverse()[0]

          return (
            liquidHandle === `${handle}.section.liquid` ||
            liquidHandle === `${handle}.liquid`
          )
        })

        if (input) {
          data.liquid = {
            input,
            output: path.resolve(Paths.dist.sections, `${handle}.liquid`),
          }
        }

        schemas.push(data)
      }

      resolve(schemas)

    } catch (error) {
      reject(error)
    }
  })
}
