/**
 * Core: Canvas functions
 * -----------------------------------------------------------------------------
 * Functions used when setting up Canvas and storybook.
 *
 */
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { getGlobalComponents, getVuexStores } from '~/core/canvas-imports'
import ComponentStates from '~/core/plugins/component-states'
import Helpers from '~/core/plugins/helpers'
import SectionEvents from '~/core/plugins/section-events'

import ClickOutside from '@we-make-websites/click-outside'

/**
 * Set global components, used in Storybook.
 * @param {Object} app - Vue app object.
 */
export function setGlobalComponents(app) {
  const globalComponents = getGlobalComponents()

  Object.entries(globalComponents).forEach(([componentName, component]) => {
    app.component(componentName, component.default || component)
  })
}

/**
 * Set Vuex stores.
 */
function setVuexStores() {
  const modules = getVuexStores()
  const plugins = []

  /**
   * Persists state in localStorage.
   * - Manually add states to persist.
   * - See https://github.com/robinvdvleuten/vuex-persistedstate#customize-storage
   *   for instructions on using sessionStorage or cookies instead.
   */
  if (!cnvs.settings.disableVuexPersist) {
    plugins.push(
      createPersistedState({
        key: 'cnvs',
        paths: [
          'cart.response',
          'overlays.dismissed',
          'multi-store.chosenStore',
        ],
      }),
    )
  }

  /**
   * Create Vuex store.
   */
  return createStore({
    modules,
    plugins,
  })
}

/**
 * Set Canvas Vue global components and plugins.
 * @param {Object} app - Vue app object.
 */
export function setVuePlugins(app) {
  app.use(ComponentStates)
  app.use(ClickOutside)
  app.use(Helpers)

  if (!cnvs.storybook) {
    app.use(SectionEvents)
  }

  app.use(setVuexStores())
}
