/**
 * Core: Commands (empty)
 * -----------------------------------------------------------------------------
 * Empty file that replaces commands.js when not in production build mode.
 * - This must return the same functions to avoid front-end errors.
 *
 */
/* eslint-disable no-empty-function */

export default () => {
  return Object.freeze({
    cli: () => {
      return {
        asyncComponents: () => window.console.log('Disabled in production build'),
        componentReadyState: () => window.console.log('Disabled in production build'),
        reset: () => window.console.log('Disabled in production build'),
      }
    },
    init: () => {},
  })
}
