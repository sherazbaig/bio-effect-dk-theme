#!/usr/bin/env node
/**
 * Basis: Copy
 * -----------------------------------------------------------------------------
 * Copies settings and locale data from source to target.
 *
 */
const { prompt } = require('enquirer')
const fs = require('fs-extra')
const themeKit = require('@we-make-websites/themekit')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const copyApi = require('../apis/copy')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const argv = yargs(hideBin(process.argv)).argv
process.env.ALLOW_LIVE = argv.allowLive

const developmentName = argv.dev ? argv.dev : 'development'
const productionName = argv.prod ? argv.prod : 'production'

const config = {
  answers: false,
  destination: {
    name: developmentName,
    password: '',
    store: '',
    type: 'environment',
    value: developmentName,
  },
  files: {
    locales: true,
    settings: true,
    templates: true,
  },
  source: {
    name: productionName,
    password: '',
    store: '',
    type: 'environment',
    value: productionName,
  },
}

let configYml = {}
let globalChoices = []

const themes = {
  destination: {
    store: '',
    themes: [],
  },
  source: {
    store: '',
    themes: [],
  },
}

/**
 * Initialises the download functionality.
 */
async function init() {
  const start = performance.now()
  logBanner()

  configYml = await copyApi.loadConfig()

  globalChoices = [
    {
      role: 'separator',
      value: 'Environments',
    },
    ...copyApi.splitEnvironments(configYml),
    {
      name: 'Choose from online themes...',
      value: 'theme',
    },
  ]

  await sourceQuestion()
  await destinationQuestion()

  if (config.source.store !== config.destination.store) {
    await storeWarningQuestion()
  }

  await filesQuestion()

  config.answers = true
  runCopy(start)
}

/**
 * Outputs Basis banner.
 */
function logBanner() {
  const messages = [Tny.colour('bgCyan', 'Basis copy v{{basis version}}')]

  if (config.answers) {
    ['source', 'destination'].forEach((type) => {
      const name = config[type].type === 'environment'
        ? config[type].name
        : copyApi.getSanitisedThemeName(config[type].name, config[type].store)

      const action = type === 'source' ? 'Copying from' : 'Uploading to'

      messages.push(Tny.colour('bgCyan', `${action} ${name} ${config[type].type}`))
    })
  }

  Tny.message(messages, { empty: true })
}

/**
 * Ask source question.
 * - Create deep copy of choices.
 * @returns {Promise}
 */
async function sourceQuestion() {
  const choices = JSON.parse(JSON.stringify(globalChoices))
  let question = {}

  try {
    question = await prompt({
      choices,
      hint: '(Press <return> to use default, or type to refine)',
      initial: copyApi.findChoiceIndexByEnvironment(Object.keys(configYml), productionName),
      message: 'Source',
      name: 'answer',
      prefix: () => '🏠',
      type: 'autocomplete',
      result(answer) {
        return answer.trim()
      },
      validate(answer) {
        return answer ? true : Tny.colour('red', '❌ Source is required')
      },
    })

  } catch (error) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  config.source = {
    name: question.answer,
    password: configYml[question.answer]?.password,
    store: configYml[question.answer]?.store,
    type: 'environment',
    value: question.answer,
  }

  if (question.answer === 'theme') {
    await queryTheme('source')
  }

  return new Promise((resolve) => {
    resolve()
  })
}

/**
 * Builds list of stores to fetch from, fetches themes, asks question.
 * @param {String} - Type, either `source` or `destination`.
 * @returns {Promise}
 */
function queryTheme(type) {
  return new Promise(async(resolve, reject) => {
    try {
      const credentials = await credentialsQuestion(type)
      themes[type].themes = await copyApi.fetchThemes(credentials, themes, type)
      await themeQuestion(credentials, type)
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Ask store URL question to find credentials.
 * - Build choices from all unique store URLs in environments.
 * @param {String} type - Either `source` or `destination`.
 * @returns {Promise}
 */
async function credentialsQuestion(type) {
  const messageType = `${type[0].toUpperCase()}${type.slice(1)}`
  let choices = []

  Object.values(configYml).forEach((environment) => {
    if (choices.includes(environment.store)) {
      return
    }

    choices.push(environment.store)
  })

  choices = [
    {
      role: 'separator',
      value: 'Environments',
    },
    ...choices.sort(),
  ]

  let question = { answer: choices[1] }

  if (choices.length > 2) {
    try {
      question = await prompt({
        choices,
        hint: '(Press <return> to use default, or type to refine)',
        message: `${messageType} store`,
        name: 'answer',
        type: 'autocomplete',
        prefix: () => '🏪',
        result(answer) {
          return answer
        },
        validate(answer) {
          return answer ? true : Tny.colour('red', '❌ Theme is required')
        },
      })

    } catch (error) {
      Tny.message(Tny.colour('red', '⛔ Process exited'))
      process.exit()
    }
  }

  themes[type].store = question.answer

  /**
   * Find password of environment from store URL.
   */
  const matchedEnvironment = Object.values(configYml).find((environment) => {
    return environment.store === question.answer
  })

  return new Promise((resolve) => {
    resolve({
      password: matchedEnvironment.password,
      store: question.answer,
    })
  })
}

/**
 * Ask theme question.
 * - Create deep copy to copy objects as values.
 * - Disables previously selected choice.
 * @param {Object} credentials - credentials object to fetch from.
 * @param {String} credentials.password - Store password to use.
 * @param {String} credentials.url - Store URL to use.
 * @param {String} type - Either `source` or `destination`.
 * @returns {Object} - Theme ID and name.
 */
async function themeQuestion(credentials, type) {
  const messageType = `${type[0].toUpperCase()}${type.slice(1)}`
  const localThemes = JSON.parse(JSON.stringify(themes))

  const choices = localThemes[type].themes.map((themeObject) => {
    if (
      config.destination.store === config.source.store &&
      copyApi.getThemeEnvironmentName(themeObject.name, config.source.store) === config.source.name
    ) {
      return {
        ...themeObject,
        disabled: true,
        hint: '(Disabled, selected as source)',
      }
    }

    return themeObject
  })

  let question = {}

  try {
    question = await prompt({
      choices,
      hint: '(Press <return> to use default, or type to refine)',
      message: `${messageType} theme`,
      name: 'answer',
      prefix: () => '🎨',
      result(answer) {
        return answer
      },
      type: 'autocomplete',
      validate(answer) {
        return answer ? true : Tny.colour('red', '❌ Theme is required')
      },
    })

  } catch (error) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  /**
   * Find ID of theme from name.
   */
  const matchedTheme = themes[type].themes.find((themeObject) => {
    return themeObject.name === question.answer
  })

  config[type] = {
    name: copyApi.getThemeEnvironmentName(question.answer, credentials.store),
    password: credentials.password,
    store: credentials.store,
    type: 'theme',
    value: matchedTheme.id,
  }

  return new Promise((resolve) => {
    resolve()
  })
}

/**
 * Ask destination question.
 * - Create deep copy of choices.
 * - Disables previously selected choice.
 * @returns {Promise}
 */
async function destinationQuestion() {
  const choices = JSON.parse(JSON.stringify(globalChoices)).map((choice) => {
    if (choice.value === config.source.value) {
      return {
        ...choice,
        disabled: true,
        hint: '(Disabled, selected as source)',
      }
    }

    return choice
  })

  let question = {}

  try {
    question = await prompt({
      choices,
      hint: '(Press <return> to use default, or type to refine)',
      initial: copyApi.findChoiceIndexByEnvironment(Object.keys(configYml), developmentName),
      message: 'Destination',
      name: 'answer',
      prefix: () => '📍',
      result(answer) {
        return answer.trim()
      },
      type: 'autocomplete',
      validate(answer) {
        return answer ? true : Tny.colour('red', '❌ Destination is required')
      },
    })

  } catch (error) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  config.destination = {
    name: question.answer,
    password: configYml[question.answer]?.password,
    store: configYml[question.answer]?.store,
    type: 'environment',
    value: question.answer,
  }

  if (question.answer === 'theme') {
    await queryTheme('destination')
  }

  return new Promise((resolve) => {
    resolve()
  })
}

/**
 * Ask for confirmation of copying between store URLs.
 * @returns {Promise}
 */
async function storeWarningQuestion() {
  let question = {}

  try {
    question = await prompt({
      message: 'You are copying between two separate stores, do you wish to proceed?',
      name: 'answer',
      prefix: () => '⚠️',
      type: 'confirm',
    })

  } catch (error) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  if (!question.answer) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  return new Promise((resolve) => {
    resolve()
  })
}

/**
 * Ask what type of files to download question.
 * @returns {Promise}
 */
async function filesQuestion() {
  let question = {}

  try {
    question = await prompt({
      choices: [
        { name: 'Locales' },
        { name: 'Settings' },
        { name: 'Templates' },
      ],
      message: 'File types to copy',
      hint: '(Use <space> to select, <return> to submit)',
      // eslint-disable-next-line
      initial: [0, 1, 2],
      name: 'answer',
      prefix: () => '📋',
      type: 'multiselect',
      validate(answer) {
        return answer.length ? true : Tny.colour('red', '❌ Please select at least one type')
      },
    })
  } catch (error) {
    Tny.message(Tny.colour('red', '⛔ Process exited'))
    process.exit()
  }

  Object.keys(config.files).forEach((key) => {
    config.files[key] = question.answer.includes(
      `${key.slice(0, 1).toUpperCase()}${key.slice(1)}`,
    )
  })

  return new Promise((resolve) => {
    resolve()
  })
}

/**
 * Runs copy functionality.
 * @param {Number} start - Start performance time.
 */
async function runCopy(start) {
  logBanner()

  try {

    /**
     * Ensure temp folder exists, then create ignore file.
     */
    await fs.remove(Paths.basis.temp)
    await fs.ensureDir(Paths.basis.temp)
    await copyApi.createIgnoreFile(config)

    /**
     * Download from source.
     */
    const downloadMessage = await downloadFiles()
    logBanner()
    Tny.message(downloadMessage)

    /**
     * Upload to destination.
     */
    const uploadMessage = await uploadFiles()
    logBanner()

    Tny.message([
      downloadMessage,
      uploadMessage,
    ])

    /**
     * Delete temp folder.
     */
    await fs.remove(Paths.basis.temp)
    const end = performance.now()

    Tny.message([
      Tny.colour('magenta', '📁 Temporary folder deleted'),
      Tny.time(start, end),
    ])

  } catch (error) {
    logBanner()

    Tny.message([
      Tny.colour('red', '❌ Copy failed'),
      error,
    ])

    await fs.remove(Paths.basis.temp)
  }
}

/**
 * Downloads files from source environment.
 * @returns {Promise}
 */
function downloadFiles() {
  return new Promise(async(resolve, reject) => {
    try {
      if (config.source.type === 'theme') {
        await copyApi.updateYaml(config, 'source')
      }

      await themeKit.command('download', {
        dir: 'temp',
        env: config.source.name,
        ignores: 'temp/copy-ignore',
      })

      resolve(Tny.colour('green', `🚀 Copied ${copyApi.buildCopyString(config)} files`))

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Uploads files to destination environment.
 * @returns {Promise}
 */
function uploadFiles() {
  return new Promise(async(resolve, reject) => {
    try {
      if (config.destination.type === 'theme') {
        await copyApi.updateYaml(config, 'destination')
      }

      await themeKit.command('deploy', {
        allowLive: process.env.ALLOW_LIVE === 'true',
        dir: 'temp',
        env: config.destination.name,
        ignoredFile: 'copy-ignore',
        noDelete: true,
      })

      resolve(Tny.colour('green', '📤 Files uploaded'))

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Run copy command.
 */
init()
