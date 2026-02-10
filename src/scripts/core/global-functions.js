/**
 * Core: Global functions
 * -----------------------------------------------------------------------------
 * Functions added to global cnvs namespace.
 *
 */

/**
 * Focus element and its value.
 * @param {HTMLElement} element - Duration of sleep.
 */
export function focus(element) {
  if (!element || typeof element !== 'object') {
    window.console.log('No element to focus')
    return
  }

  element.focus()

  if (
    element.tagName === 'INPUT' &&
    ['email', 'number', 'password', 'search', 'tel', 'text', 'url'].includes(element.type) &&
    element.value
  ) {
    element.setSelectionRange(0, element.value.length)
  }
}

/**
 * Create globally available error reporting function.
 * @param {String} message - Console error message.
 * @param {*} error - Error variable.
 */
export function reportError(message, error) {
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

/**
 * Sleep for duration.
 * @param {Number} duration - Duration of sleep.
 * @returns {Promise}
 */
export function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}
