/**
 * Core: Commands
 * -----------------------------------------------------------------------------
 * Exposes helper commands in the console and loads listeners to handle them.
 *
 */
export default () => {

  /**
   * Command line interface.
   * - Commands available in the console.
   */
  function cli() {
    return {
      asyncComponents,
      componentReadyState,
      reset,
    }
  }

  /**
   * Toggle async components.
   * - Does not override theme settings.
   */
  function asyncComponents() {
    const value = !cnvs.settings.disableAsyncComponents
    const activeState = value ? 'waiting' : 'active'
    const loadingState = value ? 'waiting' : 'loading'

    if (value) {
      updateSetting({
        object: 'settings',
        reload: false,
        setting: 'disableAsyncComponents',
        value,
      })

      updateSetting({
        object: 'states',
        reload: false,
        setting: 'active',
        showMessage: false,
        value: activeState,
      })

      updateSetting({
        object: 'states',
        setting: 'loading',
        showMessage: false,
        value: loadingState,
      })

      return
    }

    removeSettings([
      'settings.disableAsyncComponents',
      'states.active',
      'states.loading',
    ])
  }

  /**
   * Toggle component ready state.
   * - Does not override theme settings.
   */
  function componentReadyState() {
    const value = !cnvs.settings.disableComponentReadyState

    if (value) {
      updateSetting({
        object: 'settings',
        setting: 'disableComponentReadyState',
        value,
      })

      return
    }

    removeSettings(['settings.disableComponentReadyState'])
  }

  /**
   * Reset helpers.
   */
  function reset() {
    sessionStorage.removeItem('helpers')
    window.console.log('Resetting all helper settings')
    reloadPage()
  }

  /**
   * Update setting.
   * @param {Object} data - Data object.
   * @param {Boolean} data.reload - Whether to reload the page.
   * @param {String} data.object - Setting object in cnvs.settings to update.
   * @param {Boolean} data.showMessage - Display console message.
   * @param {String} data.setting - Setting key in cnvs.settings to update.
   * @param {String|Boolean} data.value - Setting's new value.
   */
  function updateSetting({
    reload = true,
    object,
    setting,
    showMessage = true,
    value,
  }) {
    let message = `Updating cnvs.${object}.${setting} setting to ${value}`

    if (reload) {
      message += ', reloading page'
    }

    if (showMessage) {
      window.console.log(message)
    }

    cnvs[object][setting] = value

    /**
     * Store updating setting in sessionStorage for reload.
     */
    const storage = sessionStorage.getItem('helpers')
    let helpers = {}

    if (storage) {
      helpers = JSON.parse(storage)
    }

    helpers[`${object}.${setting}`] = value
    sessionStorage.setItem('helpers', JSON.stringify(helpers))

    /**
     * Reload page to apply change.
     */
    reloadPage(reload)
  }

  /**
   * Remove array of settings from storage.
   * @param {Array} settings - Settings to remove.
   */
  function removeSettings(settings) {
    const helpers = JSON.parse(sessionStorage.getItem('helpers'))

    if (!helpers || !Object.keys(helpers).length) {
      window.console.log('Helper commands do not override theme settings')
      return
    }

    settings.forEach((setting) => {
      delete helpers[setting]
    })

    sessionStorage.setItem('helpers', JSON.stringify(helpers))
    window.console.log(`Resetting ${settings[0]}, reloading page`)

    reloadPage()
  }

  /**
   * Reload page.
   * @param {Boolean} reload - Reloads the page.
   */
  function reloadPage(reload = true) {
    if (!reload) {
      return
    }

    setTimeout(() => {
      location.reload()
    }, 600)
  }

  /**
   * Update theme variables with helpers.
   */
  function init() {
    const helpers = JSON.parse(sessionStorage.getItem('helpers'))

    if (!helpers) {
      return
    }

    Object.entries(helpers).forEach(([key, value]) => {
      const [object, setting] = key.split('.')
      cnvs[object][setting] = value
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    cli,
    init,
  })
}
