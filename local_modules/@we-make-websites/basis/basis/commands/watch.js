#!/usr/bin/env node
/**
 * Basis: Watch
 * -----------------------------------------------------------------------------
 * Compiles theme into dist folder and starts watch.
 *
 */
const Tny = require('@we-make-websites/tannoy')
const browserSync = require('browser-sync')
const clipboardy = require('clipboardy')
const { Select } = require('enquirer')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const open = require('open')
const path = require('path')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const buildApi = require('../apis/build')
const deployApi = require('../apis/deploy')
const messagesApi = require('../apis/messages')

const debug = require('../helpers/debug')
const getBrowsersyncConfig = require('../helpers/get-browsersync-config')
const getCanvasConfig = require('../helpers/get-canvas-config')
const Paths = require('../helpers/paths')

const basisPackage = require(Paths.basis.packageJson)

/**
 * Set environment variables based on flags and folders.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.ADAPTER = argv.adapter
process.env.ALLOW_LIVE = argv.allowLive
process.env.CLEAR = argv.clear
process.env.DEBUG = argv.debug
process.env.FIRST_BUILD = JSON.stringify(true)
process.env.HOT = argv.hot
process.env.MODE = argv.hot ? 'hot' : 'watch'
process.env.NODE_ENV = argv.live ? 'production' : 'development'
process.env.SHOPIFY_ENV = 'development'

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

/**
 * Set variables.
 */
const mode = argv.hot ? 'hot' : 'watch'
const pluginName = 'Watch'

const urls = {
  assets: '',
  browsersync: '',
  devServer: '',
  editor: '',
  shopify: '',
  theme: '',
}

let bs
let configYml
let controls = false
let firstWatch = true
let server = false

/**
 * Configure control choices.
 * - Number of lines cleared in beforeCompile needs to match number choices plus
 *   one to cover question text.
 */
const controlChoices = [
  {
    name: 'Open localhost theme URL in MESSAGE',
    value: 'localhost',
  },
  {
    name: 'Open Shopify theme URL in default browser',
    value: 'shopify',
  },
  {
    name: 'Open theme editor in default browser',
    value: 'editor',
  },
  {
    name: 'Force upload',
    value: 'upload',
  },
]

if (argv.hot) {
  controlChoices.splice(1, 1)
}

/**
 * Configure compiling spinner frames.
 */
const frames = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

/**
 * Initialises the watch functionality.
 */
async function init() {
  try {
    debug('Watch', `Start - v${basisPackage.version}\n`)
    await fs.emptyDir(Paths.dist.root)
    runWatch()

  } catch (error) {
    Tny.message([
      Tny.colour('red', '❌ Failed to clear dist folder'),
      error,
    ])

    debug('Watch', 'Failed to clear dist folder', 'bgRed')
    debug('Watch', `${error}`, 'bgRed')
    process.exit()
  }
}

/**
 * Builds and watches the theme.
 */
async function runWatch() {
  const compiler = buildApi.getCompiler(mode)
  debug('Watch', 'Configured build')

  /**
   * Find ports and set environment variable for theme script/style URLs.
   */
  const ports = await buildApi.getPorts()
  debug('Watch', `Retrieved ports ${JSON.stringify(ports)}`)

  /**
   * Setup Webpack dev server.
   */
  if (argv.hot) {
    server = buildApi.getServer(compiler, ports.assets)
    urls.assets = `https://localhost:${ports.assets}`
    urls.devServer = `${urls.assets}/webpack-dev-server`
    process.env.ASSETS_URL = urls.assets
    debug('Watch', 'Configured server')
  }

  /**
   * Start Browsersync.
   */
  try {
    await createBrowsersync(ports)
    debug('Watch', 'Browsersync created')

  } catch (error) {
    Tny.message(Tny.colour('red', `❌ ${error}`))
    debug('Watch', 'Failed to create Browsersync', 'bgRed')
    debug('Watch', `${error}`, 'bgRed')
    process.exit()
  }

  /**
   * Add hooks.
   */
  compiler.hooks.beforeCompile.tap(pluginName, handleBeforeCompileHook)
  compiler.hooks.thisCompilation.tap(pluginName, handleThisCompilationHook)
  compiler.hooks.done.tapAsync(pluginName, handleDoneHook)
  compiler.hooks.failed.tap(pluginName, handleFailedHook)

  /**
   * Run watch using Webpack dev server instead if it exists.
   * - Exists when --hot flag is used.
   * - Otherwise two instances of Webpack will exist.
   */
  if (server) {
    await server.start()
    return
  }

  compiler.watch({
    aggregateTimeout: 1000,
    ignored: Paths.basis.ignoredWatchPaths,
    poll: 1000,
  }, (error, stats) => {
    if (argv.hot) {
      return
    }

    handleWatch(error, stats)
  })
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

  /**
   * Close controls and reset cursor positioning
   */
  if (controls) {
    controls.close()

    Tny.clear({
      clear: { direction: 'all', type: 'line' },
      move: { direction: 'up', lines: controlChoices.length + 1 },
    })
  }

  /**
   * Output messaging.
   */
  messagesApi.logBanner(mode)
  notifyBrowserSync('🕛 Building theme')

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
  debug('Watch', 'Building\n')
}

/**
 * Handles done hook.
 * @param {Object} stats - Stats from build.
 * @param {Function} callback - Hook callback.
 */
function handleDoneHook(stats, callback) {
  if (argv.hot) {
    handleWatch(false, stats)
  }

  process.env.FIRST_BUILD = JSON.stringify(false)
  callback()
}

/**
 * Handle failed hook.
 * @param {Object} error - Error object.
 */
function handleFailedHook(error) {
  debug('Watch', 'Build failed')
  notifyBrowserSync('❌ Build failed')
  Tny.spinner.stop('error')
  console.error(error.stack || error)

  if (!error.details) {
    return
  }

  throw new Error(error.details)
}

/**
 * Handle compiler watch.
 * @param {Boolean|Object} error - Compiler errors.
 * @param {Object} stats - Compiler stats.
 */
function handleWatch(error, stats) {
  if (process.env.DEPLOYING === 'true') {
    debug('Blocked', 'Watch', 'bgRed')
    return
  }

  /**
   * Watch error.
   */
  if (error) {
    notifyBrowserSync('❌ Build failed')
    Tny.spinner.stop('error')
    console.error(error.stack || error)

    if (error.details) {
      throw new Error(error.details)
    }

    return
  }

  /**
   * Stats errors and warnings.
   */
  const statsJson = stats?.toJson({}, true)

  if (stats?.hasErrors() || stats?.hasWarnings()) {
    notifyBrowserSync('❌ Build failed')
    Tny.spinner.stop('error')

    if (stats?.hasErrors()) {
      console.error(statsJson?.errors[0]?.message)
    }

    if (stats?.hasWarnings()) {
      console.warn(statsJson?.warnings[0]?.message)
    }

    return
  }

  /**
   * Post-build actions
   */
  Tny.spinner.stop('success')
  messagesApi.logBanner(mode)
  messagesApi.logBuild(statsJson)
  postBuildActions(statsJson)
}

/**
 * Post-build actions.
 * -----------------------------------------------------------------------------
 * Functions run once the watch build has completed.
 *
 */

/**
 * Post-build actions.
 * - Deploys files, if required.
 * - Triggers refresh, if required.
 * - Updates terminal messaging.
 * - Displays control if successful.
 * @param {Object} stats - Webpack build stats.
 */
async function postBuildActions(stats) {
  const start = performance.now()
  const requires = getUploadRefreshRequired()
  const deployStatus = await deployFiles(requires.upload)

  await postBuildMessaging({
    deployStatus,
    requires,
    start,
    stats,
  })

  if (process.env.DEBUG === 'true' || deployStatus.message === 'error') {
    return
  }

  /**
   * Delay display of controls so they're not overwritten during hot mode.
   */
  setTimeout(() => {
    displayControls()
  }, 500)
}

/**
 * Get if an upload or refresh is required.
 * - Always reload and refresh when not in hot mode or on first watch.
 * - Upload if a non-hot reload, non-image is changed.
 * - Refresh if a non-hot reload file is changed.
 * @returns {Object}
 */
function getUploadRefreshRequired() {
  const updatedFiletypes = process.env.UPDATED_FILETYPES
    ? JSON.parse(process.env.UPDATED_FILETYPES)
    : false

  if (argv.showFiletypes) {
    debug('Watch', `Updated filetypes - ${process.env.UPDATED_FILETYPES}\n`)
  }

  const status = {
    refresh: true,
    upload: true,
  }

  if (!argv.hot || firstWatch || !updatedFiletypes) {
    return status
  }

  const images = ['gif', 'jpg', 'jpeg', 'png', 'tiff', 'webp']
  const scripts = ['gql', 'js', 'vue']
  const stylesheets = ['css', 'scss']

  status.refresh = updatedFiletypes.some((filetype) => {
    return ![
      ...scripts,
      ...stylesheets,
    ].includes(filetype)
  })

  status.upload = updatedFiletypes.some((filetype) => {
    return ![
      ...images,
      ...scripts,
      ...stylesheets,
    ].includes(filetype)
  })

  return status
}

/**
 * Deploy to theme using themekit.
 * @param {Boolean} deploy - Determines if deploy is required.
 * @returns {Promise}
 */
function deployFiles(deploy) {
  return new Promise(async(resolve) => {
    if (process.env.DEPLOYING === 'true') {
      debug('Blocked', 'Deploy files', 'bgRed')
      resolve({ deployed: false, message: 'blocked' })
      return
    }

    if (!deploy || argv.deploy === false) {
      resolve({ deployed: false, message: 'no-deploy' })
      return
    }

    process.env.DEPLOYING = JSON.stringify(true)

    try {
      debug('Watch', 'Deploy start')
      notifyBrowserSync('📤 Uploading files')

      await deployApi.deploy(mode)

      debug('Watch', 'Deploy end\n')
      process.env.DEPLOYING = JSON.stringify(false)
      resolve({ deployed: true, message: 'deployed' })

    } catch (error) {
      notifyBrowserSync('❌ File upload failed')
      debug('Watch', 'Deploy failed\n')
      process.env.DEPLOYING = JSON.stringify(false)
      resolve({ error, deployed: false, message: 'error' })
    }
  })
}

/**
 * Output post-build messaging.
 * @param {Object} data.deployStatus - Deployment status.
 * @param {Object} data.requires - If deploy or refresh is required.
 * @param {Number} data.start - Deployment start time.
 * @param {Object} data.stats - Webpack build stats.
 * @returns {Promise}
 */
function postBuildMessaging({ deployStatus, requires, start, stats }) {
  if (requires.refresh) {
    notifyBrowserSync('🔄 Refreshing browser')
    bs.reload()
  }

  if (!requires.upload && !requires.refresh) {
    notifyBrowserSync('🔥 Updated', 2000)
  }

  messagesApi.logBanner(mode)
  messagesApi.logBuild(stats)

  if (requires.upload) {
    if (deployStatus.deployed) {
      messagesApi.logUpload({ mode, start })

    } else if (deployStatus.message === 'error') {
      messagesApi.logUpload({
        error: deployStatus.error,
        hasError: true,
        mode,
        start,
      })

      return
    }
  } else {
    messagesApi.logUpload({ mode, start: false })
  }

  const messages = [Tny.colour('green', '👀 Watching for changes')]

  if (firstWatch) {
    messages.push('📋 Local URL copied to clipboard')
    firstWatch = false
  }

  /**
   * Localhost URLs.
   */
  messages.push('')
  messages.push(Tny.colour('magenta', '🔗 Localhost URLs'))
  messages.push(`⌨️ ${urls.theme} ${Tny.colour('brightBlack', '(Theme)')}`)
  messages.push(`💻 ${urls.browsersync} ${Tny.colour('brightBlack', '(Browsersync UI)')}`)

  if (argv.hot) {
    messages.push(`🔥 ${urls.devServer} ${Tny.colour('brightBlack', '(Asset server)')}`)
  }

  /**
   * Shopify URLs.
   */
  messages.push('')
  messages.push(Tny.colour('magenta', '🛍️ Shopify URLs'))

  if (!argv.hot) {
    messages.push(`🛒 ${urls.shopify}`)
  }

  messages.push(`⚙️ ${urls.editor}`)

  Tny.message(messages)

  /**
   * Debug messages.
   */
  debug('Watch', `⌨️ ${urls.theme}`)

  if (argv.hot) {
    debug('Watch', `🔥 ${urls.devServer}`)
  }
}

/**
 * Display controls.
 * - Asks question using Enquirer then actions based on choice.
 * - Runs again to offer controls multiple times.
 * @returns {Promise}
 */
function displayControls() {
  return new Promise(async(resolve, reject) => {
    let answer = ''
    let runAgain = true

    /**
     * Determine browser and message for controls.
     */
    let browser = 'firefox'

    if (canvasConfig && canvasConfig.browser) {
      browser = canvasConfig.browser
    }

    if (argv.browser) {
      browser = argv.browser
    }

    const argumentArray = []
    let message = `${browser.slice(0, 1).toUpperCase()}${browser.slice(1)}`

    if (browser === 'chrome' && argv.incognito !== false) {
      argumentArray.push('--incognito')
      message += ' (incognito)'
    }

    /**
     * Start/restart question.
     * - Update choices with browser message.
     */
    controls = new Select({
      choices: controlChoices.map((choice) => {
        return {
          name: choice.name.replace('MESSAGE', message),
          value: choice.value,
        }
      }),
      message: Tny.colour('magenta', 'Controls'),
      name: 'answer',
      pointer: () => '',
      prefix: () => '🎮',
      result(selectAnswer) {
        return controlChoices.find((choice) => {
          return choice.name.replace('MESSAGE', message) === selectAnswer.trim()
        })
      },
      validate(selectAnswer) {
        return selectAnswer ? true : Tny.colour('red', '❌ Choice is required')
      },
    })

    try {
      answer = await controls.run()

    } catch (error) {
      Tny.message(Tny.colour('red', '⛔ Process exited'))
      reject(error)
      process.exit()
    }

    /**
     * Action choice.
     */
    switch (answer.value) {
      case 'localhost':
        open(urls.theme, {
          app: {
            arguments: argumentArray,
            name: open.apps[browser],
          },
        })

        break

      case 'shopify':
        open(urls.shopify)
        break

      case 'editor':
        open(urls.editor)
        break

      case 'upload':
        runAgain = false
        postBuildActions(false)
        break
    }

    /**
   * If run again then clear and run function again.
   */
    if (!runAgain) {
      resolve()
      return
    }

    await new Promise((timeoutResolve) => {
      setTimeout(timeoutResolve, 2000)
    })

    await controls.close()

    Tny.clear({
      clear: { direction: 'all', type: 'line' },
      move: { direction: 'up', lines: 3 },
    })

    await displayControls()
    resolve()
  })
}

/**
 * Browsersync
 * -----------------------------------------------------------------------------
 * Browsersync functions.
 *
 */

/**
 * Creates Browsersync instance.
 * @param {Object} ports - Asset and dev server ports.
 * @returns {Promise}
 */
function createBrowsersync(ports) {
  return new Promise(async(resolve, reject) => {
    try {
      if (browserSync.has('Basis')) {
        resolve()
        return
      }

      bs = browserSync.create('Basis')

      /**
       * Get themekit config.
       */
      configYml = await getYmlConfig()

      /**
       * Set URLs.
       */
      urls.browsersync = `https://localhost:${ports.browsersync}`
      urls.editor = `https://admin.shopify.com/store/${configYml.store.split('.')[0]}/themes/${configYml.theme_id}/editor`
      urls.shopify = `https://${configYml.store}/?preview_theme_id=${configYml.theme_id}`
      urls.theme = `https://localhost:${ports.theme}/?preview_theme_id=${configYml.theme_id}`

      /**
       * Initialise Browsersync.
       */
      bs.init(getBrowsersyncConfig(urls.shopify, ports))

      /**
       * Write URL to clipboard.
       */
      clipboardy.writeSync(urls.theme)
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get themekit config yml data.
 * @returns {Promise}
 */
function getYmlConfig() {
  return new Promise(async(resolve, reject) => {
    try {
      const ymlFile = path.resolve('./config.yml')

      if (!fs.existsSync(ymlFile)) {
        reject(new Error('No config file'))
        return
      }

      const fileContents = await fs.readFile(ymlFile, 'utf-8')
      const data = yaml.load(fileContents)

      if (!data[process.env.SHOPIFY_ENV]) {
        reject(new Error('Environment doesn\'t exist in config'))
        return
      }

      resolve(data[process.env.SHOPIFY_ENV])

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Emit notification in BrowserSync.
 * @param {String} message - Message to emit.
 * @param {Number} [time] - Time to display message.
 */
function notifyBrowserSync(message, time = 100000) {
  bs.notify(message, time)
}

/**
 * Export watch command.
 */
init()
