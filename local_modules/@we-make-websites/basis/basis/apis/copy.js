#!/usr/bin/env node
/**
 * Basis: Copy API
 * -----------------------------------------------------------------------------
 * Copy API to streamline main copy commnand.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const themeKit = require('@we-make-websites/themekit')
const Tny = require('@we-make-websites/tannoy')
const yaml = require('js-yaml')

const Paths = require('../helpers/paths')

/**
 * Build copy string based on `config.files`.
 * @param {Object} config - Copy command configuration.
 * @returns {String}
 */
function buildCopyString(config) {
  const filesArray = Object.keys(config.files).map((key) => {
    return config.files[key] ? key.slice(0, -1) : false
  }).filter(Boolean)

  let string = ''

  switch (filesArray.length) {
    case 1:
    case 2:
      string = filesArray.join(' and ')
      break
    case 3:
      string = filesArray.join(', and ').replace('and ', '')
      break
  }

  return string
}

/**
 * Build list of ignored files based on files question answer.
 * @returns {String}
 */
function buildIgnoreFiles(config) {
  let string = ''

  if (!config.files.locales) {
    string += 'locales/*\n'
  }

  if (!config.files.settings) {
    string += 'config/settings_data.json\n'
  }

  if (!config.files.templates) {
    string += 'sections/*.json\ntemplates/customers/*.json\ntemplates/*.json'
  }

  return string
}

/**
 * Duplicate copy ignore file and update with config.
 * @param {Object} config - Copy command configuration.
 * @returns {Promise}
 */
function createIgnoreFile(config) {
  return new Promise(async(resolve, reject) => {
    try {
      const readPath = fs.existsSync(Paths.themekit.copy)
        ? Paths.themekit.copy
        : path.resolve('node_modules', '@we-make-websites', 'basis', '.themekit', 'copy')

      const file = await fs.readFile(readPath, 'utf-8')

      await fs.writeFile(
        path.join(Paths.basis.temp, 'copy-ignore'),
        `${file}\n${buildIgnoreFiles(config)}`,
        'utf-8',
      )

      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Fetch themes from Shopify.
 * - Uses production environment for URL and password.
 * @param {Object} credentials - credentials object to fetch from.
 * @param {String} credentials.password - Store password to use.
 * @param {String} credentials.url - Store URL to use.
 * @param {Array} themes - Object of themes for source and destination.
 * @param {String} type - Either `Source` or `Destination`.
 * @returns {Promise}
 */
function fetchThemes(credentials, themes, type) {
  return new Promise(async(resolve, reject) => {
    if (
      type === 'destination' &&
      themes.destination.store === themes.source.store
    ) {
      resolve(themes.source.themes)
      return
    }

    let localThemes = []

    try {
      Tny.message(
        Tny.colour('green', '⌛ Fetching list of themes...'),
        { after: false },
      )

      localThemes = await themeKit.command('get', {
        list: true,
        output: true,
        password: credentials.password,
        store: credentials.store,
      })

    } catch (error) {
      reject(error)
    }

    localThemes = localThemes
      .split('Available theme versions:')[1]
      .replace('[live]', '')
      .split('\n')
      .filter(Boolean)
      .map((theme) => {
        const id = theme.match(/\s+\[\d+\]/g)[0]

        const name = theme
          .replace(id, '')
          .trim()

        return {
          id: id
            .replace('[', '')
            .replace(']', '')
            .trim(),
          name,
          value: name,
        }
      })

    Tny.clear({
      clear: { direction: 'all', type: 'line' },
      move: { direction: 'up', lines: 1 },
    })

    resolve([
      {
        role: 'separator',
        value: 'Environments',
      },
      ...localThemes,
    ])
  })
}

/**
 * Find index number of choice based on environment name.
 * - Plus one to account for separator.
 * @param {Array} choices - Array of environments in config.
 * @param {String} environment - Environment name to match.
 * @returns {Number}
 */
function findChoiceIndexByEnvironment(choices, environment) {
  const index = choices.findIndex((choice) => {
    return choice.includes(environment)
  })

  if (index === -1) {
    return null
  }

  return index + 1
}

/**
 * Get sanitised name for theme from generated environment name.
 * @param {String} environment - Environment name.
 * @param {String} store - Shopify store URL.
 * @returns {String}
 */
function getSanitisedThemeName(environment, store) {
  const suffix = store
    .split('.myshopify')[0]
    .replace(/-/g, '_')

  const theme = environment
    .replace('theme_', '')
    .replace(`_${suffix}`, '')

  return `${theme} (${store.split('.myshopify')[0]})`
}

/**
 * Get generated environment name for theme.
 * @param {String} theme - Name of theme.
 * @param {String} store - Shopify store URL.
 * @returns {String}
 */
function getThemeEnvironmentName(theme, store) {
  const prefix = 'theme'

  const suffix = store
    ? store
      .split('.myshopify')[0]
      .replace(/-/g, '_')
    : false

  // eslint-disable-next-line
  return [prefix, theme, suffix]
    .filter(Boolean)
    .join('_')
}

/**
 * Load config to create autocomplete list of environments.
 * @returns {Promise}
 */
function loadConfig() {
  return new Promise(async(resolve, reject) => {
    try {
      const ymlFile = path.resolve(Paths.canvas.configYml)

      if (!fs.existsSync(ymlFile)) {
        reject(new Error('No yml file'))
        return
      }

      const fileContents = await fs.readFile(ymlFile, 'utf-8')
      const data = yaml.load(fileContents)
      resolve(data)

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Split environments from themes in config.yml and add separator.
 * @param {Object} configYml - config.yml environments.
 * @returns {Array}
 */
function splitEnvironments(configYml) {
  const environments = []
  const themes = []

  Object.entries(configYml).forEach(([name, environment]) => {
    if (name.includes('theme_')) {
      themes.push({
        name: getSanitisedThemeName(name, environment.store),
        value: name,
      })

      return
    }

    environments.push({
      name,
      value: name,
    })
  })

  return [
    ...environments,
    {
      role: 'separator',
      value: 'Shopify themes',
    },
    ...themes,
  ]
}

/**
 * Updates config.yml with new environment.
 * @param {Object} config - Copy command configuration.
 * @param {String} type - Either `source` or `destination`.
 * @returns {Promise}
 */
function updateYaml(config, type) {
  return new Promise(async(resolve, reject) => {
    try {
      const tempYml = await loadConfig()

      /**
       * Capture read only IDs to compare with new environments.
       */
      const readOnlyIds = Object.values(tempYml)
        .filter((environment) => environment.readonly)
        .map((environment) => {
          return {
            store: environment.store,
            theme: environment.theme_id,
          }
        })

      /**
       * Create new environment.
       */
      const newEnvironment = {
        [config[type].name]: {
          password: config[type].password,
          theme_id: config[type].value,
          store: config[type].store,
          directory: 'dist',
        },
      }

      /**
       * Set to readonly if theme ID and store matches readOnlyIds.
       */
      const matchedEnvironment = readOnlyIds.find((object) => {
        return (
          object.store === config[type].store &&
          object.theme === config[type].value
        )
      })

      if (matchedEnvironment) {
        newEnvironment[config[type].name].readonly = true
      }

      /**
       * Build yaml format config.
       */
      let newYml = yaml.dump(
        { ...tempYml, ...newEnvironment },
        { lineWidth: -1, noRefs: true },
      )

      /**
       * Add newlines after each environment to replicate sample format.
       */
      newYml = newYml.replace(
        /(?<lines>..directory: dist\n(?!..readonly: true)|..readonly: true\n)/g,
        (_, $1) => {
          return `${$1}\n`
        },
      )

      /**
       * Update config.yml.
       */
      await fs.writeFile(
        path.resolve('./config.yml'),
        `# ThemeKit configuration\n${newYml}`,
        'utf-8',
      )

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
  buildCopyString,
  createIgnoreFile,
  fetchThemes,
  findChoiceIndexByEnvironment,
  getSanitisedThemeName,
  getThemeEnvironmentName,
  loadConfig,
  splitEnvironments,
  updateYaml,
}
