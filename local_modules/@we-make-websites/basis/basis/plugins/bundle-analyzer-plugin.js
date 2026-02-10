/**
 * Plugin: Bundle analyzer plugin
 * -----------------------------------------------------------------------------
 * Sets up and configures bundle analyzer reports.
 *
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Export plugin.
 * @param {Array} plugins - List of webpack plugins currently in use.
 */
module.exports = (plugins) => {
  if (
    process.env.BUDDY ||
    (!isProduction && process.env.BUILD_REPORT !== 'true')
  ) {
    return
  }

  const date = new Date()

  let month = date.getMonth() + 1
  month = String(month).length === 1 ? `0${month}` : month
  let day = date.getDate()
  day = String(day).length === 1 ? `0${day}` : day

  let hours = date.getHours()
  hours = String(hours).length === 1 ? `0${hours}` : hours
  let minutes = date.getMinutes()
  minutes = String(minutes).length === 1 ? `0${minutes}` : minutes

  const dateString = `${date.getFullYear()}-${month}-${day}-${hours}${minutes}`

  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'gzip',
      logLevel: 'error',
      openAnalyzer: process.env.OPEN_REPORT === 'true',
      reportFilename: path.join(Paths.basis.reports, `./${dateString}.html`),
    }),
  )
}
