/**
 * Helper: Debug
 * -----------------------------------------------------------------------------
 * Outputs debug messaging.
 *
 */
/* eslint-disable no-console */
const Tny = require('@we-make-websites/tannoy')

/**
 * Outputs message.
 * @param {String} prefix - Prefix and number.
 * @param {String} message - Message.
 * @param {String} colour - Colour for prefix.
 * @returns {Function}
 */
module.exports = (prefix, message, colour = 'bgGreen') => {
  const debug = process.env.DEBUG === 'true'

  if (!debug) {
    return
  }

  const formattedMessage = typeof message === 'string'
    ? message
    : JSON.stringify(message)

  console.log(
    Tny.colour(colour, prefix),
    formattedMessage.replaceAll('\n', ''),
  )

  if (formattedMessage.includes('\n')) {
    console.log('')
  }
}
