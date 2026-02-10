/**
 * Helper: Get template entry points
 * -----------------------------------------------------------------------------
 * Returns entry points used for template JS files.
 * - Template JS has to match valid template name, or be prefixed with it.
 *
 */
const fs = require('fs-extra')
const path = require('path')

const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Object}
 */
module.exports = () => {
  const entryPoints = {}

  getTemplates(Paths.scripts.templates)
  getTemplates(Paths.scripts.customers, true)

  /**
   * Run through path and find all files in given path.
   * @param {String} filepath - Path to folder.
   * @param {Boolean} customers - Prepend files with customers prefix.
   */
  function getTemplates(filepath, customers) {
    if (!fs.existsSync(filepath)) {
      return
    }

    fs.readdirSync(filepath).forEach((file) => {
      const name = path.parse(file).name

      const validTemplate = Paths.basis.validTemplates.some((template) => {
        return name === template || name.startsWith(`${template}.`)
      })

      if (!validTemplate) {
        return
      }

      const jsFile = path.join(
        filepath,
        `${name}.js`,
      )

      if (!fs.existsSync(jsFile)) {
        return
      }

      const templateName = customers
        ? `template.customers.${name}`
        : `template.${name}`

      entryPoints[templateName] = {
        filename: '[name].js',
        import: jsFile,
      }
    })
  }

  return entryPoints
}
