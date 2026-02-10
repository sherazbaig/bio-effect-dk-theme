/**
 * API: String
 * -----------------------------------------------------------------------------
 * Functions to find strings and add to 'theme-compiled-strings.liquid'.
 *
 */
const fileSync = require('@we-make-websites/file-sync')
const fs = require('fs-extra')
const path = require('path')
const Tny = require('@we-make-websites/tannoy')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Runs all functionality.
 */
async function init() {
  logBanner()

  /**
   * Only compile strings in Canvas projects.
   */
  if (process.env.CANVAS !== 'true') {
    return
  }

  try {
    const start = performance.now()
    const strings = await findStrings()

    Tny.message(Tny.colour('green', strings.message), { after: false })

    const errors = await validateStrings(strings)

    const state = fs.existsSync(Paths.dist.themeCompiledStrings)
      ? 'updated'
      : 'created'

    await buildSnippet(strings)
    const end = performance.now()
    const stringPath = Paths.dist.themeCompiledStrings.split('canvas/')[1]

    Tny.message([
      Tny.colour('green', `💧 ${stringPath} ${state}`),
      Tny.time(start, end),
    ])

    if (errors.counts) {
      Tny.message(errors.message)
    }

  } catch (error) {
    Tny.message(Tny.colour('red', `❌ ${error}`))
  }
}

/**
 * Outputs Basis banner.
 */
function logBanner() {
  Tny.message([
    Tny.colour('bgCyan', 'Basis build v{{basis version}}'),
    Tny.colour('bgCyan', 'Strings command'),
  ], { empty: true })
}

/**
 * Find use of $string() helper in Vue component files and create array of
 * unique language strings.
 * @param {Object|Boolean} previousStrings - Strings from previous build.
 * @returns {Promise}
 */
function findStrings(previousStrings = false) {
  return new Promise(async(resolve, reject) => {
    try {
      let strings = []
      const debugMessages = []

      /**
       * Find all Vue components in components/ folder.
       */
      const componentFilepaths = fileSync(Paths.components.root, ['vue'])

      /**
       * Go through contents of each file to find $string() and add to array.
       */
      for (const filepath of componentFilepaths) {
        // eslint-disable-next-line no-await-in-loop
        const contents = await fs.readFile(filepath, 'utf-8')

        let componentStrings = contents.match(/\$string\(.*?[a-z._]*\)/gs)

        if (!componentStrings) {
          continue
        }

        if (process.env.DEBUG_STRINGS === 'true') {
          const displayPath = filepath
            .split('components')[1]
            .replaceAll(/[\\/]/g, '/')

          debugMessages.push(Tny.colour('yellow', displayPath))
        }

        /**
         * Format $string values.
         * - Split off additional config if it exists.
         */
        componentStrings = componentStrings.map((string) => {
          if (!string.includes('\'')) {
            return false
          }

          let formattedString = string
            .replaceAll('$string(', '')
            .replaceAll(')', '')
            .replaceAll('\'', '')
            .replaceAll('\n', '')
            .trim()

          if (formattedString.includes(',')) {
            formattedString = formattedString.split(',')[0]
          }

          return formattedString
        }).filter(Boolean)

        strings.push(...componentStrings)

        if (process.env.DEBUG_STRINGS === 'true') {
          debugMessages.push(...componentStrings)
          debugMessages.push('')
        }
      }

      /**
       * Sort and remove duplicate strings.
       */
      const uniqueStrings = []

      strings = strings
        .sort()
        .map((string) => {
          if (uniqueStrings.includes(string)) {
            return false
          }

          uniqueStrings.push(string)
          return string
        })
        .filter(Boolean)

      const count = strings.length

      /**
       * Convert strings into Liquid object.
       */
      const object = {}

      strings.forEach((string) => {
        const parts = string.split('.')
        object[parts[0]] = object[parts[0]] || {}

        switch (parts.length) {
          case 1:
            object[parts[0]] = object[parts[0]] || `{{ '${string}' | t | json }}`
            break
          case 2:
            object[parts[0]] = object[parts[0]] || {}
            object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || `{{ '${string}' | t | json }}`
            break
          case 3:
            object[parts[0]] = object[parts[0]] || {}
            object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || {}
            object[parts[0]][parts[1]][parts[2]] = object[parts[0]][parts[1]][parts[2]] || `{{ '${string}' | t | json }}`
            break
          case 4:
            object[parts[0]] = object[parts[0]] || {}
            object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || {}
            object[parts[0]][parts[1]][parts[2]] = object[parts[0]][parts[1]][parts[2]] || {}
            object[parts[0]][parts[1]][parts[2]][parts[3]] = object[parts[0]][parts[1]][parts[2]][parts[3]] || `{{ '${string}' | t | json }}`
            break
        }
      })

      /**
       * If previous strings then compare to test if strings have updated.
       */
      let updated = false

      if (previousStrings.strings) {
        if (previousStrings.strings.length === strings.length) {
          updated = previousStrings.strings.join() !== strings.join()
        } else {
          updated = true
        }
      }

      debug('Basis core', 'Found strings', 'bgYellow')

      if (process.env.DEBUG_STRINGS === 'true') {
        Tny.message(debugMessages, { after: false, before: false })
      }

      resolve({
        count,
        message: `🧵 Compiled ${count} string${count === 1 ? '' : 's'}`,
        object,
        strings,
        updated,
      })

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Load default locale file and check to see if strings exist.
 * @param {Array} strings - Array of strings.
 * @returns {Promise}
 */
function validateStrings({ strings }) {
  return new Promise(async(resolve, reject) => {
    try {

      /**
       * Load 'default' locale file.
       */
      const localeFilepaths = fileSync(Paths.shopify.locales, ['json'])
      const queue = []
      let defaultFilepath = []

      for (const filepath of localeFilepaths) {
        if (!filepath.includes('.default.json')) {
          continue
        }

        queue.push(fs.readFile(filepath, 'utf-8'))
        defaultFilepath.push(filepath)
      }

      /**
       * Always take the first .default.json file.
       * - There should only ever be one.
       */
      defaultFilepath = defaultFilepath[0]
      let locales = await Promise.all(queue)
      locales = locales[0]
      locales = JSON.parse(locales)

      const errors = []

      /**
       * Look through each path to check if it exists in locale file.
       */
      for (const filepath of strings) {
        let string = locales

        for (const part of filepath.split('.')) {
          if (!string[part]) {
            errors.push(filepath)
            break
          }

          string = string[part]
        }

        if (string) {
          continue
        }

        errors.push(filepath)
      }

      /**
       * Create error messages.
       */
      const formattedPath = defaultFilepath.split('locales')[1].slice(1)
      const count = errors.length
      const join = count === 1 ? 'doesn\'t' : 'dont\'t'
      const message = `${Tny.colour('yellow', `⚠️ The following string${count === 1 ? '' : 's'} ${join} exist in ${formattedPath}:`)}\n${errors.join('\n')}`

      debug('Basis core', 'Validated strings', 'bgYellow')

      resolve({
        count,
        errors,
        message,
      })

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Build Liquid snippet from template.
 * @parma {Number} count - Number of strings.
 * @param {Object} object - cnvs.compiledStrings object.
 * @returns {Promise}
 */
function buildSnippet({ count, object }) {
  return new Promise(async(resolve, reject) => {
    try {
      if (!count) {
        resolve()
        return
      }

      await fs.ensureDir(Paths.dist.snippets)

      /**
       * Build JSON object.
       */
      const jsonObject = JSON.stringify(object)
        .replaceAll(`"{{ '`, `{{ '`)
        .replaceAll(`json }}"`, `json }}`)

      /**
       * Build template.
       */
      const filepath = path.join(Paths.basis.templates, 'strings-snippet.ejs')

      let template = await fs.readFile(filepath, 'utf-8')
      template = template.replaceAll('<%= object %>', jsonObject)

      /**
       * Write templates.
       */
      await fs.writeFile(
        Paths.dist.themeCompiledStrings,
        template,
        'utf-8',
      )

      if (!fs.existsSync(Paths.dist.themeCompiledStrings)) {
        throw new Error('Failed to build compiled strings snippet')
      }

      debug('Basis core', 'Created string snippets', 'bgYellow')
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
  buildSnippet,
  findStrings,
  init,
  validateStrings,
}
