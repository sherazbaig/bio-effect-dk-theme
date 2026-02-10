/**
 * Core: Runners
 * -----------------------------------------------------------------------------
 * Scripts that run functionality at the correct time.
 *
 */

/**
 * DOM ready runner.
 * - DOMContentLoaded can fire before asynchronously loaded scripts have
 *   finished loading.
 * - Check loading state and run callback immediately or after event listener.
 * @param {Function} callback - Callback function to execute.
 */
export function domReady(callback) {
  if (typeof callback !== 'function') {
    cnvs.ReportError('DOM ready callback is not a function')
    return
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
    return
  }

  callback()
}

/**
 * Vue ready runner.
 * - Setting event listeners before Vue has started can cause broken references
 *   meaning click events etc. won't trigger.
 * - Run callback if cnvs.started or after EventBus emit.
 * @param {Function} callback - Callback function to execute.
 */
export function vueReady(callback) {
  if (typeof callback !== 'function') {
    cnvs.ReportError('Vue ready callback is not a function')
    return
  }

  if (cnvs.started) {
    callback()
    return
  }

  document.addEventListener('cnvs:start', () => {
    callback()
  })
}
