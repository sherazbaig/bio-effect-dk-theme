#!/usr/bin/env node
/**
 * Basis: Download
 * -----------------------------------------------------------------------------
 * Downloads files and then re-organises files.
 * - See https://github.com/Shopify/node-themekit for command reference.
 *
 */
const fs = require('fs-extra')
const themeKit = require('@we-make-websites/themekit')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const downloadApi = require('../apis/download')

const getSchemas = require('../helpers/get-schemas')
const Paths = require('../helpers/paths')

/**
 * Set environment variables.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.MOVE_FILES = argv.fileMove
process.env.RESET_SCHEMAS = argv.schemaReset
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
  try {
    const start = performance.now()
    logBanner()

    /**
     * Create ignores.
     */
    const ignores = fs.existsSync(Paths.themekit.download)
      ? '.themekit/download'
      : 'node_modules/@we-make-websites/basis/.themekit/download'

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
    Tny.colour('bgCyan', 'Basis download v{{basis version}}'),
    Tny.colour('bgCyan', `Downloading from ${process.env.SHOPIFY_ENV} environment`),
  ], { empty: true })
}

/**
 * Run post-download actions.
 * - Re-organises files into their correct folder.
 * - Resets section schemas to default.
 * - Resets theme variables.
 * - Resets robots.txt.
 */
function postDownloadActions() {
  return new Promise(async(resolve, reject) => {
    try {
      const start = performance.now()

      await downloadApi.moveFiles()
      await resetSchemas()
      await resetThemeVariables()
      await resetRobotsTxt()

      if (
        process.env.MOVE_FILES === 'false' &&
        process.env.RESET_SCHEMAS === 'false'
      ) {
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
 * Reset injected schema in sections with separate schema files.
 * @return {Promise}
 */
function resetSchemas() {
  return new Promise(async(resolve, reject) => {
    try {
      if (process.env.RESET_SCHEMAS === 'false') {
        resolve()
        return
      }

      await new Promise((timeoutResolve) => {
        setTimeout(timeoutResolve, 1000)
      })

      const schemas = await getSchemas()
      const queue = []

      for (const schema of schemas) {
        if (!schema.liquid || !fs.existsSync(schema.liquid?.input)) {
          continue
        }

        // eslint-disable-next-line no-await-in-loop
        let contents = await fs.readFile(schema.liquid.input, 'utf-8')

        contents = contents.replace(
          /{% schema %}.*{% endschema %}/gs,
          `{% schema '${schema.handle}' %}`,
        )

        queue.push(fs.writeFile(schema.liquid.input, contents, 'utf-8'))
      }

      await Promise.all(queue)

      Tny.message(
        Tny.colour('green', '🧪 Schemas reset'),
        { after: false },
      )

      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', '❌ Failed to reset schemas'))
      reject(error)
    }
  })
}

/**
 * Reset environment-based theme variables back to placeholder values.
 * @returns {Promise}
 */
function resetThemeVariables() {
  return new Promise(async(resolve, reject) => {
    try {
      for (const filepath of Object.values(Paths.shopify.themeVariables)) {
        if (!fs.existsSync(filepath)) {
          continue
        }

        // eslint-disable-next-line no-await-in-loop
        let contents = await fs.readFile(filepath, 'utf-8')

        contents = contents
          .replace(/bugsnagApiKey:.*/g, 'bugsnagApiKey: \'CANVAS_BUGSNAG_API_KEY\',')
          .replace(/canvas:.*/g, 'canvas: \'CANVAS_VERSION\',')
          .replace(/mode:.*/g, 'mode: \'CANVAS_WEBPACK_MODE\',')
          .replace(/release:.*/g, 'release: \'CANVAS_RELEASE_VERSION\',')

        // eslint-disable-next-line no-await-in-loop
        await fs.writeFile(filepath, contents, 'utf-8')
      }

      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', '❌ Failed to reset theme variables'))
      reject(error)
    }
  })
}

/**
 * Resets security text from robots.txt.
 * @returns {Promise}
 */
function resetRobotsTxt() {
  return new Promise(async(resolve, reject) => {
    try {
      if (!fs.existsSync(Paths.shopify.robots)) {
        resolve()
        return
      }

      let contents = await fs.readFile(Paths.shopify.robots, 'utf-8')
      contents = contents.replace(/# Canvas.+/gs, '')

      await fs.writeFile(Paths.shopify.robots, contents, 'utf-8')
      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', '❌ Failed to reset robots.txt'))
      reject(error)
    }
  })
}

/**
 * Run download command.
 */
init()
