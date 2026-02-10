/**
 * Plugin: Canvas Bugsnag plugins
 * -----------------------------------------------------------------------------
 * Add relevant Bugsnag plugins.
 * - Report build and upload source maps to Bugsnag if environment variable.
 * - If no environment variable is present then the Bugsnag import is switched
 *   to use the empty file.
 *
 */
const { BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins')

const BugsnagCustomSourceMapUploaderPlugin = require('./bugsnag-custom-source-map-uploader-plugin')

/**
 * Export plugins.
 * @param {Array} plugins - List of webpack plugins currently in use.
 */
module.exports = (plugins) => {
  if (!process.env.BUGSNAG_API_KEY || !process.env.BUDDY) {
    return
  }

  plugins.push(
    new BugsnagBuildReporterPlugin({
      apiKey: process.env.BUGSNAG_API_KEY,
      appVersion: process.env.RELEASE_VERSION,
      builderName: process.env.BUDDY_INVOKER_NAME,
      releaseStage: 'production',
      sourceControl: {
        provider: process.env.BUDDY_SCM_PROVIDER.toLowerCase(),
        repository: process.env.BUDDY_SCM_URL,
        revision: process.env.BUDDY_EXECUTION_REVISION,
      },
    }),
    new BugsnagCustomSourceMapUploaderPlugin({
      apiKey: process.env.BUGSNAG_API_KEY,
      appVersion: process.env.RELEASE_VERSION,
      overwrite: true,
      publicPath: '*/assets/',
    }),
  )
}
