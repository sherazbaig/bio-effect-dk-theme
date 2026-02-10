#!/usr/bin/env node
/**
 * Basis: Help
 * -----------------------------------------------------------------------------
 * Help command to access all commands and flags.
 *
 */
const fs = require('fs-extra')
const Tny = require('@we-make-websites/tannoy')

const basisCommands = require('../helpers/commands')
const Paths = require('../helpers/paths')

/**
 * Set environment variables based on folders.
 */
if (
  fs.existsSync(Paths.components.async) &&
  fs.existsSync(Paths.components.global)
) {
  process.env.CANVAS = JSON.stringify(true)
}

/**
 * Initialises the help functionality.
 */
function init() {
  outputBanner()

  /**
   * Build commands list and sort.
   */
  let commands = [...basisCommands]

  if (process.env.CANVAS === 'true') {
    const canvasCommands = require(Paths.canvas.commands)

    commands = [
      ...commands,
      ...canvasCommands,
    ]

    commands = commands.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }

      if (a.name > b.name) {
        return 1
      }

      return 0
    })
  }

  /**
   * Find longest flag name in all commands for tab width.
   */
  let longest = 0

  commands.forEach((command) => {
    command.flags.forEach((flag) => {
      if (flag.name.length < longest) {
        return
      }

      longest = flag.name.length
    })
  })

  /**
   * Go through each command and output name, description, flags, and shortcuts.
   */
  commands.forEach((command) => {
    const messages = []
    const colour = command.canvas ? 'red' : 'blue'

    messages.push(Tny.colour(colour, `yarn ${command.name}`))
    messages.push(command.description)
    Tny.message(messages)

    const flags = command.flags.map((flag) => formatItem(flag, longest))

    if (flags.length) {
      Tny.message(flags)
    }

    const shortcuts = command.shortcuts?.map((shortcut) => {
      return formatItem(shortcut, longest)
    })

    if (!shortcuts?.length) {
      return
    }

    Tny.message(shortcuts)
  })
}

/**
 * Format item - flags or shortcuts.
 * @param {Object} item - Either a flag or shortcut object.
 * @param {Number} longest - Character length of longest flag name.
 * @returns {String}
 */
function formatItem(item, longest) {

  /**
   * + 1 to offset index0, + 4 for desired extra gap.
   */
  const characters = (longest - item.name.length) + 1 + 3
  const spacer = Array(...Array(characters)).join(' ')

  const name = Tny.colour('green', item.name)
  const description = Tny.colour('brightBlack', item.description)

  return `${name}${spacer}${description}`
}

/**
 * Output banner.
 */
function outputBanner() {
  const messages = [Tny.colour('bgCyan', 'Basis help v{{basis version}}')]

  /**
   * Add Basis/Canvas conditional message.
   */
  const message = process.env.CANVAS === 'true'
    ? 'Displaying all Basis and Canvas commands and flags'
    : 'Displaying all Basis commands and flags'

  messages.push(Tny.colour('bgCyan', message))

  /**
   * Add colour index if Canvas.
   */
  if (process.env.CANVAS === 'true') {
    messages.push('')
    messages.push(`Basis commands are ${Tny.colour('blue', 'blue')}`)
    messages.push(`Canvas commands are ${Tny.colour('red', 'red')}`)
  }

  /**
   * Output banner.
   */
  Tny.message(messages, { empty: true })
}

/**
 * Export help command.
 */
init()
