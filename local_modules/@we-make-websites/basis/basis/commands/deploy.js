#!/usr/bin/env node
/**
 * Basis: Deploy
 * -----------------------------------------------------------------------------
 * Deploys compiled theme to specified environment.
 * - See https://github.com/Shopify/node-themekit for command reference.
 *
 */
const fs = require('fs-extra')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const deployApi = require('../apis/deploy')
const messagesApi = require('../apis/messages')

const Paths = require('../helpers/paths')

/**
 * Set environment variables.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.SHOPIFY_ENV = argv.live ? 'production' : 'development'

if (argv.env) {
  process.env.SHOPIFY_ENV = argv.env
}

/**
 * Set variables.
 */
const mode = 'deploy'

/**
 * Initialises the deploy functionality.
 */
async function init() {
  const start = performance.now()
  messagesApi.logBanner(mode)

  try {
    await deployApi.deploy(mode)
    messagesApi.logUpload({ mode, start })

  } catch (error) {
    if (argv.templates) {
      await fs.remove(Paths.themekit.temp)
    }

    messagesApi.logUpload({
      error,
      hasError: true,
      mode,
      start,
    })
  }
}

/**
 * Run deploy command.
 */
init()
