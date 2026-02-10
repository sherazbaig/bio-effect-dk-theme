#!/usr/bin/env node
/**
 * Basis: Locales
 * -----------------------------------------------------------------------------
 * Downloads only the theme's locales and settings schema.
 * - See https://github.com/Shopify/node-themekit for command reference.
 *
 */
const fs = require('fs-extra')
const themeKit = require('@we-make-websites/themekit')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const Paths = require('../helpers/paths')

/**
 * Set environment variables.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.SHOPIFY_ENV = argv.dev ? 'development' : 'production'

if (argv.env) {
  process.env.SHOPIFY_ENV = argv.env
}

/**
 * Initialises the download functionality.
 */
async function init() {
  const start = performance.now()
  logBanner()

  try {
    const ignores = fs.existsSync(Paths.themekit.locales)
      ? '.themekit/locales'
      : 'node_modules/@we-make-websites/basis/.themekit/locales'

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
    Tny.colour('bgCyan', 'Basis locales download v{{basis version}}'),
    Tny.colour('bgCyan', `Downloading from ${process.env.SHOPIFY_ENV} environment`),
  ], { empty: true })
}

/**
 * Run locales command.
 */
init()
