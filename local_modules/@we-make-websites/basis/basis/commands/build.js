#!/usr/bin/env node
/**
 * Basis: Build
 * -----------------------------------------------------------------------------
 * Compiles theme into dist folder.
 *
 */
const fs = require('fs-extra')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const buildApi = require('../apis/build')
const iconsApi = require('../apis/icons')
const messagesApi = require('../apis/messages')
const stringsApi = require('../apis/strings')

const debug = require('../helpers/debug')
const getCanvasConfig = require('../helpers/get-canvas-config')
const Paths = require('../helpers/paths')

const basisPackage = require(Paths.basis.packageJson)

/**
 * Set environment variables based on flags and folders.
 */
const argv = yargs(hideBin(process.argv)).argv

process.env.ADAPTER = argv.adapter
process.env.BUILD_REPORT = argv.buildReport
process.env.CLEAR = argv.clear
process.env.DEBUG = argv.debug
process.env.FIRST_BUILD = JSON.stringify(true)
process.env.MODE = 'build'
process.env.NODE_ENV = argv.dev ? 'development' : 'production'
process.env.OPEN_REPORT = argv.openReport
process.env.PRODUCTION_DEVTOOLS = argv.prodDevtools
process.env.DEBUG_CLASSES = argv.debugClasses
process.env.DEBUG_STRINGS = argv.debugStrings
process.env.USE_RELEASE_VERSION = argv.useReleaseVersion

if (
  fs.existsSync(Paths.components.async) &&
  fs.existsSync(Paths.components.global)
) {
  process.env.CANVAS = JSON.stringify(true)
}

if (argv.debugClasses || argv.debugStrings) {
  process.env.CLEAR = JSON.stringify(false)
}

/**
 * Set environment variables based on Canvas config.
 */
const canvasConfig = getCanvasConfig()

if (
  process.env.CANVAS === 'true' &&
  canvasConfig &&
  canvasConfig.customContentTool
) {
  process.env.CUSTOM_CONTENT_TOOL = JSON.stringify(true)
}

if (canvasConfig && canvasConfig.openReport) {
  process.env.OPEN_REPORT = JSON.stringify(true)
}

/**
 * Set variables.
 */
const mode = 'build'
const pluginName = 'Build'

/**
 * Configure compiling spinner frames.
 */
/* eslint-disable-next-line array-bracket-newline */
const frames = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

/**
 * Initialises the build functionality.
 */
async function init() {
  if (
    argv.schemaDocs ||
    argv.schemaDocumentation ||
    argv.schemaDocsHtml ||
    argv.schemaDocumentationHtml
  ) {
    messagesApi.logBanner(mode)

    Tny.message([
      Tny.colour('magenta', '💡 Schema Docs is now it\'s own command'),
      '⌨️ Use the yarn docs command to run',
    ])

    process.exit()
  }

  if (argv.icons || argv.iconsAll) {
    iconsApi.init()
    return
  }

  if (argv.strings) {
    stringsApi.init()
    return
  }

  try {
    debug('Build', `Start - v${basisPackage.version}\n`)
    await fs.emptyDir(Paths.dist.root)
    runBuild()

  } catch (error) {
    Tny.message(Tny.colour('red', `❌ ${error}`))
    process.exit()
  }
}

/**
 * Builds the theme.
 */
function runBuild() {
  const compiler = buildApi.getCompiler(mode)
  debug('Build', 'Got build\n')

  /**
   * Add hooks.
   */
  compiler.hooks.beforeCompile.tap(pluginName, handleBeforeCompileHook)
  compiler.hooks.thisCompilation.tap(pluginName, handleThisCompilationHook)
  compiler.hooks.done.tapAsync(pluginName, handleDoneHook)
  compiler.hooks.failed.tap(pluginName, handleFailedHook)

  /**
   * Run build.
   */
  compiler.run((error, stats) => handleRun(error, stats, compiler))
}

/**
 * Handle hooks.
 * -----------------------------------------------------------------------------
 * Functions to run when hooks are emitted.
 *
 */

/**
 * Handles beforeCompile hook.
 */
function handleBeforeCompileHook() {
  messagesApi.logBanner(mode, true)

  Tny.spinner.start({
    frames,
    message: 'Building theme',
    states: {
      success: Tny.colour('green', '🚀 Build succeeded'),
      error: Tny.colour('red', '❌ Build failed\n'),
    },
  })
}

/**
 * Handles thisCompilation hook.
 */
function handleThisCompilationHook() {
  debug('Build', 'Building\n')
  process.env.BUILDING = JSON.stringify(true)
}

/**
 * Handles done hook.
 * @param {Object} stats - Stats from build.
 * @param {Function} callback - Hook callback.
 */
function handleDoneHook(_, callback) {
  process.env.BUILDING = JSON.stringify(false)
  callback()
}

/**
 * Handle failed hook.
 * @param {Object} error - Error object.
 */
function handleFailedHook(error) {
  debug('Build', 'Build failed')
  Tny.spinner.stop('error')
  console.error(error.stack || error)

  if (!error.details) {
    return
  }

  throw new Error(error.details)
}

/**
 * Handle compiler run.
 * @param {Object} error - Compiler errors.
 * @param {Object} stats - Compiler stats.
 * @param {Object} compiler - Compiler.
 */
function handleRun(error, stats, compiler) {
  if (error) {
    Tny.spinner.stop('error')
    console.error(error.stack || error)

    if (error.details) {
      throw new Error(error.details)
    }

    return
  }

  const statsJson = stats.toJson()

  if (stats.hasErrors() || stats.hasWarnings()) {
    Tny.spinner.stop('error')

    if (stats.hasWarnings()) {
      console.warn(statsJson.warnings[0]?.message)
    }

    if (stats.hasErrors()) {
      throw new Error(statsJson.errors[0]?.message)
    }

    process.exit()
  }

  /**
   * Close build.
   */
  compiler.close((closeError) => {
    if (!closeError) {
      return
    }

    Tny.spinner.stop('error')
    throw new Error(closeError)
  })

  /**
   * Output messages.
   */
  Tny.spinner.stop('success')
  messagesApi.logBanner(mode)
  messagesApi.logBuild(statsJson, true)
}

/**
 * Export build command.
 */
init()
