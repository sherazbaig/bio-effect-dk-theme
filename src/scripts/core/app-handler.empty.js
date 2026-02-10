/**
 * Core: App handler (empty)
 * -----------------------------------------------------------------------------
 * Empty file that replaces app-handler.js when disabled in canvas.config.js.
 * - This must return the same functions to avoid front-end errors.
 *
 */
/* eslint-disable no-empty-function */

export default () => {
  return Object.freeze({
    beforeVueInit: () => {},
    afterVueInit: () => {},
  })
}
