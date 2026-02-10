#!/usr/bin/env node
/**
 * Basis: Debug
 * -----------------------------------------------------------------------------
 * Run chokidar to watch for file changes.
 *
 */
const chokidar = require('chokidar')
const Tny = require('@we-make-websites/tannoy')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

/**
 * Set variables based on flag.
 */
const argv = yargs(hideBin(process.argv)).argv

/**
 * Initialises the debug functionality.
 */
function init() {
  const folder = argv.dist ? 'dist' : 'src'

  Tny.message([
    Tny.colour('bgCyan', 'Basis debug'),
    '',
    Tny.colour('magenta', `👀 Watching for changes in ${folder} folder`),
  ])

  const path = `../canvas/${folder}`

  const events = [
    'change',
    'remove',
  ]

  if (argv.add) {
    events.push('add')
  }

  /**
   * Wait for initial load before listening for events.
   * - Prevents add event spamming when first started.
   */
  let timeout = true

  setTimeout(() => {
    timeout = false
  }, 1000)

  /**
   * Set event listeners.
   */
  events.forEach((event) => {
    let colour = 'bgCyan'
    let eventName = event

    switch (event) {
      case 'add':
        colour = 'bgGreen'
        eventName = '+'
        break

      case 'change':
        eventName = '~'
        break

      case 'remove':
        colour = '-'
        break
    }

    chokidar.watch(path).on(event, (eventPath) => {
      if (timeout) {
        return
      }

      console.log(Tny.colour(colour, eventName), eventPath)
    })
  })
}

/**
 * Export debug command.
 */
init()
