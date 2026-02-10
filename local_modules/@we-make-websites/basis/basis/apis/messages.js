/**
 * API: Messages
 * -----------------------------------------------------------------------------
 * Functions to update the terminal.
 *
 */
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const Tny = require('@we-make-websites/tannoy')

/**
 * Set environment variables based on flags and folders.
 */
const argv = yargs(hideBin(process.argv)).argv

/**
 * Main log banner.
 * @param {String} mode - `build`, `deploy`, `watch`, or `hot`.
 * @param {Boolean} outputInBuddy - Output message when in Buddy pipeline.
 * @returns {Function}
 */
function logBanner(mode, outputInBuddy = false) {
  if (process.env.DEBUG === 'true' || (process.env.BUDDY && !outputInBuddy)) {
    return
  }

  const messages = [Tny.colour('bgCyan', `Basis ${mode} v{{basis version}}`)]

  if (['build', 'hot', 'watch'].includes(mode)) {
    messages.push(Tny.colour('bgCyan', `Using ${process.env.NODE_ENV} mode`))
  }

  if (
    ['deploy', 'hot', 'watch'].includes(mode) &&
    argv.deploy !== false
  ) {
    messages.push(Tny.colour('bgCyan', `Deploying to ${process.env.SHOPIFY_ENV} environment`))
  }

  if (argv.deploy === false) {
    messages.push(Tny.colour('bgYellow', 'Deployment disabled by --no-deploy flag'))
  }

  /**
   * Use --no-clear flag on build and watch commands to not empty.
   */
  const empty = process.env.CLEAR === 'false'
    ? false
    : mode !== 'deploy'

  Tny.message(messages, { empty })
}

/**
 * Build log banner.
 * @param {Object} stats - Webpack build stats.
 * @param {Boolean} outputInBuddy - Output message when in Buddy pipeline.
 * @returns {Function}
 */
function logBuild(stats = false, outputInBuddy = false) {
  if (process.env.DEBUG === 'true' || (process.env.BUDDY && !outputInBuddy)) {
    return
  }

  let icons = false
  let strings = false
  let stringErrors = false

  if (process.env.ICONS) {
    icons = JSON.parse(process.env.ICONS)
  }

  if (process.env.CANVAS === 'true') {
    strings = JSON.parse(process.env.STRINGS)
    stringErrors = JSON.parse(process.env.STRING_ERRORS)
  }

  const messages = [Tny.colour('green', '🚀 Build succeeded')]

  if (icons?.count) {
    messages.push(icons?.message)
  }

  if (strings?.count) {
    messages.push(strings?.message)
  }

  if (stats) {
    messages.push(Tny.time(stats.time))
  }

  if (stringErrors?.count) {
    Tny.message(stringErrors?.message)
  }

  if (process.env.NODE_ENV === 'production' && stats) {
    messages.push(
      '',
      `📦 Output ${stats.assets.length} assets & ${stats.modules.length} modules`,
      '🔎 Look in reports folder for bundle sizes',
    )
  }

  Tny.message(messages)
}

/**
 * Upload log banner.
 * @param {Object} data.error - Error message from themekit.
 * @param {Boolean} data.hasError - If the deploy has failed.
 * @param {String} data.mode - `deploy`, `watch`, or `hot`.
 * @param {Number|Boolean} data.start - Upload start time.
 * @returns {Function}
 */
function logUpload({ error, hasError = false, mode, start }) {
  if (process.env.DEBUG === 'true') {
    return
  }

  const end = performance.now()
  const before = mode === 'deploy'

  if (hasError || error) {
    const message = mode === 'deploy'
      ? '❌ Deploy failed'
      : '❌ File upload failed'

    Tny.message([
      Tny.colour('red', message),
      error,
    ], { before })

    return
  }

  let message = mode === 'deploy'
    ? '🚀 Deploy complete'
    : '📤 Files uploaded'

  if (mode === 'hot' && !start) {
    message = '🔥 No upload required'
  }

  const messages = [Tny.colour('green', message)]

  if (start) {
    messages.push(Tny.time(start, end))
  }

  Tny.message(messages, { before })
}

/**
 * Export API.
 */
module.exports = {
  logBanner,
  logBuild,
  logUpload,
}
