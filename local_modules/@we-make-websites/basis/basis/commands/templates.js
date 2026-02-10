#!/usr/bin/env node
/**
 * Basis: Templates
 * -----------------------------------------------------------------------------
 * Downloads only the theme's section group and template JSON files.
 * - See https://github.com/Shopify/node-themekit for command reference.
 *
 */
const fs = require('fs-extra')
const themeKit = require('@we-make-websites/themekit')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const downloadApi = require('../apis/download')

const Paths = require('../helpers/paths')

/**
 * Set environment variables.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.MOVE_FILES = argv.fileMove
process.env.SHOPIFY_ENV = argv.dev ? 'development' : 'production'

if (argv.env) {
  process.env.SHOPIFY_ENV = argv.env
}

if (
  fs.existsSync(Paths.components.async) &&
  fs.existsSync(Paths.components.global)
) {
  process.env.CANVAS = JSON.stringify(true)
}

/**
 * Initialises the download functionality.
 */
async function init() {
  const start = performance.now()
  logBanner()

  try {
    const ignores = fs.existsSync(Paths.themekit.templates)
      ? '.themekit/templates'
      : 'node_modules/@we-make-websites/basis/.themekit/templates'

    /**
     * Download files.
     */
    await themeKit.command('download', {
      dir: 'src/shopify',
      env: process.env.SHOPIFY_ENV,
      ignores,
    })

    const end = performance.now()
    logBanner()

    Tny.message([
      Tny.colour('green', '🚀 Download complete'),
      Tny.time(start, end),
    ])

    /**
     * Re-organise files.
     */
    await postDownloadActions()

  } catch (error) {
    logBanner()

    Tny.message([
      Tny.colour('red', '❌ Download failed'),
      error,
    ])
  }
}

/**
 * Outputs Basis banner.
 */
function logBanner() {
  Tny.message([
    Tny.colour('bgCyan', 'Basis templates JSON download v{{basis version}}'),
    Tny.colour('bgCyan', `Downloading from ${process.env.SHOPIFY_ENV} environment`),
  ], { empty: true })
}

/**
 * Run post-download actions.
 * - Re-organises files into their correct folder.
 */
function postDownloadActions() {
  return new Promise(async(resolve, reject) => {
    try {
      const start = performance.now()
      await downloadApi.moveFiles()

      if (process.env.MOVE_FILES === 'false') {
        resolve()
        return
      }

      const end = performance.now()
      Tny.message(Tny.time(start, end))
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Run templates command.
 */
init()
