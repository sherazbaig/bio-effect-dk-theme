/**
 * Core: Bugsnag
 * -----------------------------------------------------------------------------
 * Setup Bugsnag error monitoring.
 * - Only runs if process.env.BUGSNAG_API_KEY variable exists, this is setup in
 *   Buddy so Bugsnag only runs after a proper deployment.
 *
 */
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

export default () => {

  /**
   * Make Bugsnag variable globally available.
   */
  window.Bugsnag = Bugsnag

  /**
   * Initialise Bugsnag.
   */
  function init() {
    if (cnvs.environment.bugsnagApiKey === 'CANVAS_BUGSNAG_API_KEY') {
      return
    }

    Bugsnag.start({
      apiKey: cnvs.environment.bugsnagApiKey,
      appVersion: cnvs.environment.release,
      plugins: [new BugsnagPluginVue()],
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
