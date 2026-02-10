/**
 * Helper: Get theme details
 * -----------------------------------------------------------------------------
 * Returns theme name and version based on package.json files.
 *
 */
const Paths = require('../helpers/paths')

/**
 * Export.
 * @returns {Object}
 */
module.exports = () => {
  const basisPackage = require(Paths.basis.packageJson)
  const basisVersion = basisPackage.version.split('-beta')[0]
  let name = 'Framework'
  let version = basisPackage.version
  let root = version

  /**
     * If being used with Canvas then combine versions if they don't match.
     */
  if (process.env.CANVAS === 'true') {
    const canvasPackage = require(Paths.canvas.packageJson)
    const canvasVersion = canvasPackage.version.split('-beta')[0]

    version = canvasVersion === basisVersion
      ? basisPackage.version
      : `cnvs-${canvasVersion}-basis-${basisVersion}`

    root = version
  }

  /**
     * If --release-version flag then use release version instead.
     */
  if (
    typeof process.env.USE_RELEASE_VERSION === 'string' &&
      process.env.USE_RELEASE_VERSION !== '' &&
      process.env.USE_RELEASE_VERSION !== 'undefined'
  ) {
    name = 'Release'
    version = process.env.USE_RELEASE_VERSION
  }

  return {
    name,
    root,
    version,
  }
}
