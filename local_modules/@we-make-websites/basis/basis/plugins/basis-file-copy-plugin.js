/**
 * Plugin: Basis file copy plugin
 * -----------------------------------------------------------------------------
 * Copies certain src/ folder files to dist/ folder.
 * - Component Liquid and shopify/ files are copied to dist/ folder on build.
 * - Copies filtered modified files after update in watch mode.
 * - Removes .section and .snippet suffix from component Liquid files.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const fileSync = require('@we-make-websites/file-sync')
const Tny = require('@we-make-websites/tannoy')
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const pluginName = 'BasisCopyLiquidPlugin'
let allFilesCopied = true
let duplicateFile = false
let files = []

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisCopyLiquidPlugin {
  apply(compiler) {

    /**
     * When in watch mode check to see if files have been updated.
     */
    compiler.hooks.watchRun.tapAsync(pluginName, (compilation, callback) => {
      files = []
      allFilesCopied = false

      if (
        !compilation.modifiedFiles ||
        !Array.from(compilation.modifiedFiles).length
      ) {
        callback()
        return
      }

      /**
       * Filter modified files.
       * - components/ folder Liquid file.
       * - Any file with an extension in the shopify/ folder.
       */
      files = Array.from(compilation.modifiedFiles).filter((filepath) => {
        const componentLiquidFile =
          filepath.includes(Paths.components.root) && filepath.includes('.liquid')

        const shopifyFolderFile =
          filepath.includes(Paths.shopify.root) && filepath.includes('.')

        return componentLiquidFile || shopifyFolderFile
      })

      callback()
    })

    /**
     * Copy files before compilation.
     */
    compiler.hooks.beforeCompile.tapAsync(pluginName, async(_, callback) => {
      try {
        duplicateFile = await this.duplicateFileCheck()
        await this.copyFiles()
        callback()

      } catch (error) {
        debug('File copy 1', error, 'bgRed')
        Tny.message(Tny.colour('red', error))
      }
    })

    /**
     * `thisCompilation` is run every time.
     */
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async(_, callback) => {
          if (duplicateFile) {
            compilation.errors.push(
              new Error(
                Tny.colour('red', `❌ File copy error - ${duplicateFile.filename} already exists in dist/${duplicateFile.folder} folder`),
              ),
            )

            callback()
            return
          }

          await this.addFilesToDependencies(compilation)
          callback()
        },
      )
    })
  }

  /**
   * Flatten nested folders and see if there are duplicate files in same folder.
   * @returns {Promise}
   */
  duplicateFileCheck() {
    return new Promise((resolve, reject) => {
      try {

        /**
         * Go through Shopify files in src/ folder and flatten nested folders.
         */
        const assets = fileSync(Paths.shopify.assets)
        const sections = fileSync(Paths.shopify.sections)
        const snippets = fileSync(Paths.shopify.snippets)

        const shopifyFiles = [
          ...assets,
          ...sections,
          ...snippets,
        ]

        const flattened = shopifyFiles.map((filepath) => {
          const folder = filepath.match(/(?:assets|sections|snippets)/g)[0]
          const filename = filepath.split(/[\\/]/g).reverse()[0]

          return {
            folder,
            filename,
            handle: `${folder}/${filename}`,
          }
        }).filter(Boolean)

        /**
         * Go through component files and flatten.
         */
        const components = fileSync(Paths.components.root, ['liquid'])

        for (const filepath of components) {
          let filename = filepath.split(/[\\/]/g).reverse()[0]
          const folder = filename.split('.').reverse()[1]
          filename = filename.replace('.section', '').replace('.snippet', '')

          flattened.push({
            folder: `${folder}s`,
            filename,
            handle: `${folder}s/${filename}`,
          })
        }

        /**
         * Test if all values are unique.
         */
        const unique = []

        const duplicate = flattened.find((object) => {
          if (unique.includes(object.handle)) {
            return true
          }

          unique.push(object.handle)
          return false
        })

        resolve(duplicate)

      } catch (error) {
        debug('File copy 2', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Copy component and shopify files.
   * - If first build then find all files to copy.
   * - Infer destination folder from original path or component suffix.
   * @returns {Promise}
   */
  copyFiles() {
    return new Promise(async(resolve, reject) => {
      try {
        if (!files.length) {
          files = this.getAllFiles()
          allFilesCopied = true
        }

        const directories = []
        const distFilesToBeCreated = []
        const filesQueue = []

        /**
         * Create queue of files to be copied.
         */
        for (const filepath of files) {
          let filename = filepath.split(/[\\/]+/g).reverse()[0]
          let destination = Paths.dist.root

          /**
           * If in src/shopify/ folder then remove nested folders and file name.
           * - Maintain templates/customers/ folder structure.
           */
          if (filepath.match(/src[\\/]+shopify/g)) {
            const formattedPath = filepath.split(/src[\\/]+shopify/g)[1]
            const pathFolders = formattedPath.split(/[\\/]+/g)
            const folder = pathFolders[1]

            const subFolder = pathFolders[1] === 'templates' && pathFolders[2] === 'customers'
              ? pathFolders[2]
              : ''

            destination = path.join(Paths.dist.root, folder, subFolder)
          }

          /**
           * If in src/components/ then use file suffix to determine folder.
           */
          if (
            process.env.CANVAS === 'true' &&
            filepath.match(/src[\\/]+components/g)
          ) {
            if (
              filepath.includes('.section.liquid') ||
              filepath.includes('.section.json')
            ) {
              destination = Paths.dist.sections
              filename = filename.replace('.section', '')
            } else {
              destination = Paths.dist.snippets
              filename = filename.replace('.snippet', '')
            }
          }

          const destinationFilePath = path.join(destination, filename)

          /**
           * Push destination folder path to directories so a queue can be made
           * to ensure that the directory exists before creating files.
           */
          if (!directories.includes(destination)) {
            directories.push(destination)
          }

          /**
           * Push destination filepath to distFiles so we can check if a file in
           * the dist folder no longer exists and should be deleted.
           */
          if (!distFilesToBeCreated.includes(destinationFilePath)) {
            distFilesToBeCreated.push(destinationFilePath)
          }

          filesQueue.push(fs.copy(filepath, destinationFilePath))
        }

        /**
         * Create queue of files that should be deleted.
         * - Only create when all files have been copied.
         * - Known issue: If a file is updated, and another is deleted in the
         *   same folder at the same time then the file isn't deleted from dist
         *   as modified files has length so allFilesCopied isn't true.
         */
        const deleteQueue = []

        if (allFilesCopied) {
          const distFiles = fileSync(Paths.dist.root)

          for (const distFilepath of distFiles) {
            if (distFilesToBeCreated.includes(distFilepath)) {
              continue
            }

            /**
             * When file copy plugin is run certain files have not yet been
             * created by Basis, ignore these when considering which files
             * should be deleted as they won't exist in distFilesToBeCreated.
             */
            const ignoredFile = Paths.basis.ignoredCopyPaths.find((ignoredPath) => {
              return distFilepath.includes(ignoredPath)
            })

            if (ignoredFile) {
              continue
            }

            deleteQueue.push(fs.remove(distFilepath))
          }
        }

        /**
         * Create queue of directories to ensure they exist.
         */
        const directoriesQueue = directories.map((directory) => {
          return fs.ensureDir(directory)
        })

        await Promise.all([
          ...directoriesQueue,
          ...deleteQueue,
          ...filesQueue,
        ])

        debug('File copy', 'Copied files', 'bgBlue')
        resolve()

      } catch (error) {
        debug('File copy 3', error, 'bgRed')
        reject(error)
      }
    })
  }

  /**
   * Get all files from component and src folders.
   * @returns {Array}
   */
  getAllFiles() {
    return process.env.CANVAS === 'true'
      ? [
        ...fileSync(Paths.components.root, ['liquid', 'json']),
        ...fileSync(Paths.shopify.root),
      ]
      : fileSync(Paths.shopify.root)
  }

  /**
   * Add all files to dependencies so compile is triggered when updating.
   * - Update file dependencies on every save as saving a non-copied files seems
   *   to remove copied file dependencies so they no longer trigger compile when
   *   they're saved.
   * @param {Object} compilation - Compilation instance.
   * @returns {Promise}
   */
  addFilesToDependencies(compilation) {
    return new Promise((resolve) => {
      const fileDependencies = this.getAllFiles()

      for (const filepath of fileDependencies) {
        compilation.contextDependencies.add(path.dirname(filepath))
        compilation.fileDependencies.add(require.resolve(filepath))
      }

      debug('File copy', 'Added files to dependencies', 'bgBlue')
      resolve()
    })
  }
}
