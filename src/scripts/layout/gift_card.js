/**
 * Layout: Gift card
 * -----------------------------------------------------------------------------
 * Entry file for all global gift card scripts.
 * - All styles are included in critical-gift_card.liquid snippet.
 *
 */
import Bugsnag from '~/core/bugsnag'
import { reportError } from '~/core/global-functions'
import { domReady } from '~/core/runners'

import GiftCard from '~/templates/gift_card'

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
  GiftCard().init()
})
