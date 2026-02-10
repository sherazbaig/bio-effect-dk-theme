/**
 * API: Download
 * -----------------------------------------------------------------------------
 * Download functions.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const fileSync = require('@we-make-websites/file-sync')
const Tny = require('@we-make-websites/tannoy')

const Paths = require('../helpers/paths')

/**
 * Move component and nested Liquid files.
 * @returns {Promise}
 */
function moveFiles() {
  return new Promise(async(resolve, reject) => {
    try {
      if (process.env.MOVE_FILES === 'false') {
        resolve()
        return
      }

      await moveComponentFiles()
      await moveNestedShopifyFiles()

      Tny.message(
        Tny.colour('green', '📂 File move complete'),
        { after: false },
      )

      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Move component Liquid and JSON files.
 * @returns {Promise}
 */
function moveComponentFiles() {
  return new Promise(async(resolve, reject) => {
    try {
      if (process.env.CANVAS !== 'true') {
        resolve()
        return
      }

      const componentFiles = [...fileSync(Paths.components.root, ['liquid', 'json'])]
      const shopifyFiles = [...fileSync(Paths.shopify.root, ['liquid', 'json'])]

      const queue = shopifyFiles.map((filepath) => {
        const parts = filepath.split(path.sep)

        const sectionOrSnippet = parts.some((part) => {
          return ['sections', 'snippets'].includes(part)
        })

        if (!sectionOrSnippet) {
          return false
        }

        const filename = parts.reverse()[0]
        const componentFilepath = getComponentFilepath(filename, componentFiles)

        if (!componentFilepath) {
          return false
        }

        return moveFile(filepath, componentFilepath)
      }).filter(Boolean)

      await Promise.all(queue)
      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', '❌ Failed to move component files'))
      reject(error)
    }
  })
}

/**
 * Find if the file exists in a component folder.
 * @param {String} filename - Original file name.
 * @param {Array} componentFiles - Component files to search through.
 * @returns {String}
 */
function getComponentFilepath(filename, componentFiles) {
  return componentFiles.find((componentPath) => {
    const parts = componentPath.split(path.sep)
    const componentFilename = parts.reverse()[0]

    const noSuffixFilename = componentFilename.replace(
      /\.(?:section|snippet)\.(?<filetype>liquid|json)/g,
      (_, $1) => {
        return `.${$1}`
      },
    )

    return noSuffixFilename === filename
  })
}

/**
 * Rename original file to overwrite nested file.
 * @param {String} source - Source filepath.
 * @param {String} destination - Destination filepath.
 * @returns {Promise}
 */
function moveFile(source, destination) {
  return new Promise(async(resolve, reject) => {
    try {
      await fs.rename(source, destination)
      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', `❌ Failed to move ${source} to ${destination}`))
      reject(error)
    }
  })
}

/**
 * Move files nested in Shopify folders into correct folder structure.
 * @returns {Promise}
 */
function moveNestedShopifyFiles() {
  return new Promise(async(resolve, reject) => {
    try {
      const excluded = [
        'config',
        'templates',
        '.gitkeep',
        '.DS_Store',
      ]

      const filepaths = fileSync(Paths.shopify.root)
      const files = [...filepaths]

      /**
       * Go through files to see if a more nested copy of it exists.
       * - Ignore filepaths that include an excluded string in its path.
       */
      const queue = files.map((filepath) => {
        const parts = filepath.split(path.sep)
        const isExcluded = parts.some((part) => excluded.includes(part))

        if (isExcluded) {
          return false
        }

        const filename = parts.reverse()[0]
        const depth = parts.length
        const type = parts.find((part) => Paths.types.includes(part))
        const nestedFilepath = getNestedFilepath({ depth, filename, filepath, files, type })

        if (!nestedFilepath) {
          return false
        }

        return moveFile(filepath, nestedFilepath)
      }).filter(Boolean)

      /**
       * Process queue.
       */
      await Promise.all(queue)
      resolve()

    } catch (error) {
      Tny.message(Tny.colour('red', '❌ Failed to move nested files'))
      reject(error)
    }
  })
}

/**
 * Find if a more deeply nested copy of the file exists.
 * @param {Number} data.depth - Original file depth
 * @param {String} data.filename - Original filename.
 * @param {String} data.filepath - Path to original file.
 * @param {Array} data.files - All filepaths to search through.
 * @param {String} data.type - Containing folder type of original filename.
 * @returns {String}
 */
function getNestedFilepath({ depth, filename, filepath, files, type }) {
  return files.find((nestedPath) => {
    const parts = nestedPath.split(path.sep)
    const nestedFilename = parts.reverse()[0]
    const nestedDepth = parts.length
    const nestedType = parts.find((part) => Paths.types.includes(part))

    return (
      nestedPath !== filepath &&
      nestedDepth > depth &&
      nestedType === type &&
      nestedFilename === filename
    )
  })
}

/**
 * Export.
 * @returns {Promise}
 */
module.exports = {
  moveFiles,
}
