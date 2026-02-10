#!/usr/bin/env node
/**
 * Basis: Deploy API
 * -----------------------------------------------------------------------------
 * Unified API to deploy the theme for deploy and watch commands.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const themeKit = require('@we-make-websites/themekit')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const Paths = require('../helpers/paths')

/**
 * Set environment variables.
 */
const argv = yargs(hideBin(process.argv)).argv

/**
 * Load ignore file and deploy to Shopify.
 * @param {String} mode - `deploy`, `watch`, or `dev`.
 * @returns {Promise}
 */
function deploy(mode) {
  return new Promise(async(resolve, reject) => {
    try {

      /**
       * Use Storybook folder if flag is passed.
       */
      const distFolder = argv.storybook
        ? Paths.storybook.root
        : Paths.dist.root

      /**
       * Throw error if dist folder doesn't exist.
       */
      if (!fs.existsSync(distFolder)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Dist folder does not exist')
        return
      }

      /**
       * Load ignores file.
       * - Use dev file for hot mode.
       */
      const file = argv.hot ? 'hot' : 'deploy'

      const ignorePaths = {
        local: `.themekit/${file}`,
        nodeModule: `node_modules/@we-make-websites/basis/.themekit/${file}`,
        path: Paths.themekit[file],
      }

      let ignores = fs.existsSync(ignorePaths.path)
        ? ignorePaths.local
        : ignorePaths.nodeModule

      /**
       * Create temp ignore file if using --templates flag.
       */
      if (argv.templates) {
        await createTempIgnoreFile()
        ignores = '.themekit/temp'
      }

      /**
       * Use no ignore file if using --storybook flag.
       */
      if (argv.storybook) {
        ignores = false
      }

      /**
       * Deploy files using themekit.
       */
      await themeKit.command('deploy', {
        allowLive: mode === 'deploy' || process.env.ALLOW_LIVE === 'true',
        env: process.env.SHOPIFY_ENV,
        ignores,
      })

      /**
       * Delete temp ignore file after upload is complete.
       */
      if (argv.templates) {
        await fs.remove(Paths.themekit.temp)
      }

      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Create temp deploy ignore files to not ignore template JSON files.
 * @returns {Promise}
 */
function createTempIgnoreFile() {
  return new Promise(async(resolve, reject) => {
    try {
      const file = argv.hot ? 'hot' : 'deploy'

      const readPath = fs.existsSync(Paths.themekit[file])
        ? Paths.themekit[file]
        : path.resolve('node_modules', '@we-make-websites', 'basis', '.themekit', file)

      let contents = await fs.readFile(readPath, 'utf-8')

      contents = contents
        .replace('sections/*.json\n', '')
        .replace('templates/customers/*.json\n', '')
        .replace('templates/*.json\n', '')

      await fs.ensureDir(Paths.themekit.root)
      await fs.writeFile(Paths.themekit.temp, contents, 'utf-8')

      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Export API.
 */
module.exports = {
  deploy,
}
