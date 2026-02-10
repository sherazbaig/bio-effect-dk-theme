/**
 * Layout: Theme
 * -----------------------------------------------------------------------------
 * Entry file for all global theme scripts.
 *
 */
import '@/layout/theme.scss'

import AppHandler from '~/core/app-handler'
import Bugsnag from '~/core/bugsnag'
import Canvas from '~/core/canvas'
import Commands from '~/core/commands'
import EventBus from '~/core/event-bus'
import { focus, reportError, sleep } from '~/core/global-functions'
import Query from '~/core/query'
import { domReady } from '~/core/runners'

/**
 * Global Canvas variables.
 */
window.cnvs = window.cnvs || {}
window.cnvs.started = false

/**
 * Global Canvas functions.
 */
window.cnvs.EventBus = EventBus()
window.cnvs.Helpers = Commands().cli()
window.cnvs.Query = (query) => Query(query)

window.cnvs.Focus = focus
window.cnvs.ReportError = reportError
window.cnvs.Sleep = sleep

/**
 * DOM ready.
 */
domReady(() => {
  Bugsnag().init()
  Commands().init()

  AppHandler().beforeVueInit()
  Canvas().init()
  AppHandler().afterVueInit()
})
