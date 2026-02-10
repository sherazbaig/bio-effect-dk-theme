/**
 * Layout: Password
 * -----------------------------------------------------------------------------
 * Entry file for all global password scripts.
 * - All styles are included in critical-password.liquid snippet.
 *
 */
import Bugsnag from '~/core/bugsnag'
import { reportError } from '~/core/global-functions'
import { domReady } from '~/core/runners'

/**
 * Global Canvas variables.
 */
window.cnvs = window.cnvs || {}
window.cnvs.started = false

/**
 * Global Canvas functions.
 */
window.cnvs.ReportError = reportError

/**
 * DOM ready.
 */
domReady(() => {
  Bugsnag().init()
})
