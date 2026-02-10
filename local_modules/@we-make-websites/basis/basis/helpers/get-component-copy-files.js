/**
 * Helper: Get component copy files
 * -----------------------------------------------------------------------------
 * Returns files to copy from async and global component folders to dist.
 * - Replace \\ in absolute paths as they're not supported in glob searches.
 *
 */
const path = require('path')

const Paths = require('../helpers/paths')

/**
 * De-pluralised list of folders components need copying to.
 * - Type is present as a suffix on the component Liquid file.
 */
const supportedTypes = ['section', 'snippet']

/**
 * Export.
 * @returns {Array}
 */
module.exports = () => {
  const patterns = []

  /**
   * Only update in Canvas projects.
   */
  if (process.env.CANVAS !== 'true') {
    return patterns
  }

  supportedTypes.forEach((type) => {
    const folder = `${type}s`

    /**
     * Copy components folder files.
     */
    patterns.push({
      from: path.posix.join(
        Paths.components.async.replace(/\\/g, '/'),
        `**/*.${type}.liquid`,
      ),
      to: path.posix.join(
        path.resolve('./dist', folder).replace(/\\/g, '/'),
        '[name][ext]',
      ),
      noErrorOnMissing: true,
    })

    /**
     * Copy global folder files.
     */
    patterns.push({
      from: path.posix.join(
        Paths.components.global.replace(/\\/g, '/'),
        `**/*.${type}.liquid`,
      ),
      to: path.posix.join(
        path.resolve('./dist', folder).replace(/\\/g, '/'),
        '[name][ext]',
      ),
      noErrorOnMissing: true,
    })
  })

  /**
   * Return copy patterns.
   */
  return patterns
}
