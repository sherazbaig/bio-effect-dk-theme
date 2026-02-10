/**
 * Core: Bugsnag (empty)
 * -----------------------------------------------------------------------------
 * Empty file that replaces bugsnag.js file when no environment variable is set.
 * - This must return the same functions to avoid front-end errors.
 *
 */
/* eslint-disable no-empty-function */

export default () => {
  return Object.freeze({
    init: () => {},
  })
}
