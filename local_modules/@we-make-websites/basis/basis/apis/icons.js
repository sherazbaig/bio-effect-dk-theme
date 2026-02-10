/**
 * API: Icons
 * -----------------------------------------------------------------------------
 * Functions to find icons, optimise icons, and create Liquid snippets.
 *
 */
const fs = require('fs-extra')
const path = require('path')
const { optimize } = require('svgo')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const debug = require('../helpers/debug')
const Paths = require('../helpers/paths')
const svgoPlugins = require('../helpers/svgo-plugins')

/**
 * Set variables.
 */
const argv = yargs(hideBin(process.argv)).argv
let count = 0

/**
 * Runs all functionality.
 */
async function init() {
  logBanner()

  if (!fs.existsSync(Paths.icons)) {
    Tny.message(Tny.colour('red', '❌ Icons folder does not exist'))
    return
  }

  try {
    const start = performance.now()
    const icons = await loadOptimise()

    Tny.message(Tny.colour('green', icons.message), { after: false })

    await buildSnippets(icons, true)
    const end = performance.now()

    Tny.message([
      Tny.colour('green', '💧 Liquid snippets created'),
      Tny.time(start, end),
    ])

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
    Tny.colour('bgCyan', 'Icons command'),
  ], { empty: true })
}

/**
 * Load and optimise icons.
 * - Uses SVGO for optimisation.
 * - See svgo.config.js for SVGO configuration.
 * @returns {Promise}
 */
function loadOptimise() {
  count = 0

  return new Promise(async(resolve, reject) => {
    try {
      const icons = {}

      /**
       * Load tier 1 folders.
       * - Use for ... of for proper asynchronous loading.
       * - src/icons/tier1/
       */
      for (const tier1Item of fs.readdirSync(Paths.icons)) {
        if (tier1Item.includes('.svg') || tier1Item.slice(0, 1) === '.') {
          continue
        }

        const tier1 = path.parse(tier1Item).name
        const tier1Path = path.join(Paths.icons, tier1)

        icons[tier1] = {}

        /**
         * Load tier 2 icons/folders.
         * - src/icons/tier1/tier2.svg
         * - src/icons/tier2/tier2/
         */
        for (const tier2Item of fs.readdirSync(tier1Path)) {
          if (tier2Item.slice(0, 1) === '.') {
            continue
          }

          const tier2 = path.parse(tier2Item).name
          const tier2Path = path.join(tier1Path, tier2)

          if (tier2Item.includes('.svg')) {
            // eslint-disable-next-line no-await-in-loop
            icons[tier1][tier2] = await optimiseIcon(`${tier2Path}.svg`, tier2)
            continue
          }

          if (!icons[tier1][tier2]) {
            icons[tier1][tier2] = {}
          }

          /**
           * Load tier 3 icons.
           * - src/icons/tier1/tier2/tier3.svg
           */
          for (const tier3Item of fs.readdirSync(tier2Path)) {
            if (!tier3Item.includes('.svg')) {
              continue
            }

            const tier3 = path.parse(tier3Item).name
            const tier3Path = path.join(tier2Path, tier3)

            // eslint-disable-next-line no-await-in-loop
            icons[tier1][tier2][tier3] = await optimiseIcon(
              `${tier3Path}.svg`,
              tier2,
              tier3,
            )
          }
        }
      }

      const optimisedString = argv.iconsAll
        ? `Optimised all ${count} icons`
        : `Optimised ${count} new icon${count === 1 ? '' : 's'}`

      debug('Basis core', 'Loaded and optimised icons', 'bgYellow')

      resolve({
        count,
        message: `📐 ${optimisedString}`,
        icons,
      })

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Load single icon and optimise using SVGO.
 * @param {String} iconPath - Path to SVG file.
 * @param {String} tier2 - Tier 2 name.
 * @param {String} tier3 - Tier 3 name.
 * @returns {Promise}
 */
function optimiseIcon(iconPath, tier2, tier3 = false) {
  return new Promise(async(resolve, reject) => {
    try {
      let icon = await fs.readFile(iconPath, 'utf-8')

      /**
       * If already optimised, or set to ignore, then don't run SVGO.
       * - If it doesn't include <svg> then don't optimise, assume it's WIP.
       * - If --override flag then ignore optimised flag.
       */
      if (
        !icon.includes('<svg') ||
        icon.includes('<!-- svgo-disable -->') ||
        (icon.includes('<!-- svgo-optimised -->') && !argv.iconsAll)
      ) {
        icon = icon
          .replaceAll('<!-- svgo-disable -->', '')
          .replaceAll('<!-- svgo-optimised -->', '')
          .replaceAll('\n', '')

        resolve(icon)
        return
      }

      const className = ['icon', `icon__${tier2}`]

      if (tier3) {
        className.push(`icon__${tier2}--${tier3}`)
      }

      const optimise = optimize(icon, {
        iconPath,
        plugins: [
          {
            name: 'addClassesToSVGElement',
            params: {
              className: className.join(' '),
            },
          },
          ...svgoPlugins,
        ],
      })

      count++

      /**
       * Write optimised icon back to source SVG.
       */
      await fs.writeFile(
        iconPath,
        `<!-- svgo-optimised -->\n${optimise.data}`,
        'utf-8',
      )

      debug('Basis core', 'Icon optimised', 'bgYellow')
      resolve(optimise.data)

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Build Liquid snippets from templates.
 * @param {Number} count - Number of icons.
 * @param {Object} icons - Object containing all loaded icon.svg files.
 * @param {Boolean} firstBuild - Is first webpack build to create snippets.
 * @returns {Promise}
 */
function buildSnippets({ icons }) {
  return new Promise(async(resolve, reject) => {
    try {
      await fs.ensureDir(Paths.dist.snippets)

      for (const tier1 of Object.keys(icons)) {
        let liquid = ''
        let parameters = ''
        let tier2Index = 0
        const tier1TitleCase = `${tier1.slice(0, 1).toUpperCase()}${tier1.slice(1)}`

        const tier1Case = tier1 === 'directional-navigation'
          ? 'direction'
          : tier1

        /**
         * Go through tier 2 items.
         * - If icon then add to Liquid template.
         * - If folder then loop through and add to Liquid template with extra
         *   Liquid case tag.
         */
        for (const tier2 of Object.entries(icons[tier1])) {
          const [tier2Key, tier2Value] = tier2
          let tier3Index = 0

          const tier2Eol = tier2Index === (Object.entries(icons[tier1]).length - 1)
            ? '\n'
            : '\n\n'

          tier2Index++
          liquid += `  {% when '${tier2Key}' %}\n`

          if (typeof tier2Value === 'string') {
            liquid += `    ${tier2Value}${tier2Eol}`
            continue
          }

          liquid += `    {% case ${tier1Case} %}\n`

          /**
           * Go through tier 3 items and output icon.
           */
          for (const tier3 of Object.entries(icons[tier1][tier2Key])) {
            const [tier3Key, tier3Value] = tier3

            const tier3Eol = tier3Index === (Object.entries(icons[tier1][tier2Key]).length - 1)
              ? '\n'
              : '\n\n'

            tier3Index++

            liquid += `      {% when '${tier3Key}' %}\n`
            liquid += `        ${tier3Value}${tier3Eol}`
          }

          liquid += `    {% endcase %}${tier2Eol}`
          parameters = `\n  @param {String} ${tier1} - Additional case parameter.`
        }

        /**
         * Build template.
         */
        const filepath = path.join(Paths.basis.templates, 'icons-snippet.ejs')
        // eslint-disable-next-line no-await-in-loop
        let template = await fs.readFile(filepath, 'utf-8')

        template = template
          .replaceAll('<%= name %>', tier1TitleCase)
          .replaceAll('<%= liquid %>', liquid)
          .replaceAll('<%= parameters %>', parameters)

        /**
         * Write templates.
         */
        // eslint-disable-next-line no-await-in-loop
        await fs.writeFile(
          path.join(Paths.dist.snippets, `icon-${tier1}.liquid`),
          template,
          'utf-8',
        )
      }

      debug('Basis core', 'Created icon snippets', 'bgYellow')
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
  buildSnippets,
  init,
  loadOptimise,
}
