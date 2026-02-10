/**
 * Core: Report error
 * -----------------------------------------------------------------------------
 * Globally available error reporting function.
 * - Create single error function so it can be easily extended with an error
 *   reporting service like Bugsnag.
 *
 */

/**
 * Create globally available error reporting function.
 * @param {String} message - Console error message.
 * @param {*} error - Error variable.
 */
export default (message, error) => {
  if (cnvs.environment.bugsnagApiKey !== 'CANVAS_BUGSNAG_API_KEY') {
    Bugsnag.notify(error)
  }

  /**
   * If non-production theme then log error to console otherwise useful error
   * is swallowed when inside a try...catch.
   * - https://we-make-websites.atlassian.net/browse/CANVAS-125
   */
  if (
    (cnvs.theme.name && !cnvs.theme.name.toLowerCase().includes('production')) ||
    (cnvs.theme.role && cnvs.theme.role !== 'main')
  ) {
    window.console.log(message, error)
  }

  throw new Error(message, error)
}
