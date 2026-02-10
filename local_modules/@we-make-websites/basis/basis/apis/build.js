#!/usr/bin/env node
/**
 * Basis: Build API
 * -----------------------------------------------------------------------------
 * Unified API to build the theme for build and watch commands.
 *
 */
const fs = require('fs-extra')
const portscanner = require('portscanner')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { merge, mergeWithRules } = require('webpack-merge')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const messagesApi = require('../apis/messages')

const getWebpackMergeRules = require('../helpers/get-webpack-merge-rules')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const argv = yargs(hideBin(process.argv)).argv

/**
 * Get Webpack compiler.
 * @param {String} mode - 'build' or 'watch'
 * @returns {Object}
 */
function getCompiler(mode) {
  messagesApi.logBanner(mode)
  return getWebpackConfiguration()
}

/**
 * Get Webpack configuration.
 * - Merge with rules only if they're present.
 * @returns {Object}
 */
function getWebpackConfiguration() {
  const config = require(Paths.basis.config.default)
  let custom = false

  if (fs.existsSync(Paths.basis.config.custom)) {
    custom = require(Paths.basis.config.custom)
  }

  if (!custom || !Object.keys(custom).length) {
    return Webpack(config)
  }

  if (custom.module?.rules?.length) {
    const combinedConfig = mergeWithRules(getWebpackMergeRules())(config, custom)
    return Webpack(combinedConfig)
  }

  const combinedConfig = merge(config, custom)
  return Webpack(combinedConfig)
}

/**
 * Get port to run theme, Browsersync, and Webpack dev server on.
 * @returns {Promise}
 */
function getPorts() {
  return new Promise(async(resolve, reject) => {
    try {
      const theme = argv.port
        ? Number(argv.port)
        : await portscanner.findAPortNotInUse(3000, 4000)

      const browsersync = await portscanner.findAPortNotInUse(theme + 1, 4000)

      const assets = argv.assetsPort
        ? Number(argv.assetsPort)
        : await portscanner.findAPortNotInUse(browsersync + 1, 4000)

      resolve({ assets, browsersync, theme })

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get Webpack dev server configuration.
 * @param {Object} build - Webpack build configuration.
 * @param {Number} port - Port to run server on.
 * @returns {Object}
 */
function getServer(build, port) {
  return new WebpackDevServer({
    allowedHosts: ['localhost', '.myshopify.com'],
    client: {
      logging: 'info',
      overlay: false,
      progress: false,
    },
    compress: true,
    headers: {
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    liveReload: false,
    open: false,
    port,
    server: 'https',
    static: {
      directory: Paths.dist.root,
    },
    webSocketServer: 'ws',
  }, build)
}

/**
 * Export API.
 */
module.exports = {
  getCompiler,
  getPorts,
  getServer,
}
