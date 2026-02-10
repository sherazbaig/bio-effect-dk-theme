/**
 * Helper: Get src copy folders
 * -----------------------------------------------------------------------------
 * Returns folders to copy from src to dist.
 * - Supports nested folders, excluding `config` and `templates`.
 *
 */
const fs = require('fs-extra')
const path = require('path')

const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Array}
 */
module.exports = () => {
  const patterns = []

  fs.readdirSync(Paths.shopify.root).forEach((item) => {
    const folder = path.parse(item).name
    const filepath = path.join(Paths.shopify.root, folder)
    const stats = fs.statSync(filepath)

    if (stats.isFile()) {
      return
    }

    const options = {
      from: path.posix.join(
        filepath.replace(/\\/g, '/'),
        '**/*',
      ),
      to: path.posix.join(
        path.join(Paths.dist.root, folder).replace(/\\/g, '/'),
        '[name][ext]',
      ),
      noErrorOnMissing: true,
    }

    /**
     * Add special conditions based on folder.
     */
    switch (folder) {
      case 'config':
        options.from = path.join(Paths.shopify.root, `${folder}/settings_schema.json`)
        break

      case 'templates':
        options.from = filepath
        options.to = path.join(Paths.dist.root, folder)
        break
    }

    patterns.push(options)
  })

  return patterns
}
