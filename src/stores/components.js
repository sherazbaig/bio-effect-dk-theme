/**
 * Store: Components
 * -----------------------------------------------------------------------------
 * Dynamic component states.
 * - Can be `waiting`, `loading`, or `active`.
 * - Components state can only go forwards, can't be reversed.
 * - Only JSDOC custom parameters, ignore module state or object.
 *
 */
export default {
  namespaced: true,

  state: () => ({}),

  getters: {

    /**
     * Get active components, i.e. ones which are `active`.
     * - Used by getComponentActive() helper function.
     * @returns {Array}
     */
    getActive(state) {
      const active = []

      Object.keys(state).forEach((handle) => {
        if (!state[handle] || state[handle] !== 'active') {
          return
        }

        active.push(handle)
      })

      return active
    },

    /**
     * Get component if it exists.
     * @param {String} handle - Component handle.
     * @returns {Boolean}
     */
    getExists: (state) => (handle) => {
      return Boolean(state[handle])
    },

    /**
     * Get visible components, i.e. ones which are `loading` or `active`.
     * - Used by getComponentVisible() helper function.
     * @returns {Array}
     */
    getVisible(state) {
      const visible = []

      Object.keys(state).forEach((handle) => {
        if (!state[handle] || state[handle] === 'waiting') {
          return
        }

        visible.push(handle)
      })

      return visible
    },

    /**
     * Get component state by handle.
     * @param {String} handle - Component handle.
     * @returns {Boolean}
     */
    getState: (state) => (handle) => {
      return state[handle]
    },
  },

  mutations: {

    /**
     * Set component state.
     * - Prevents setting a component to a previous state.
     * @param {String} handle - Component handle.
     * @param {String} state - Component's new state.
     */
    SET_STATE(state, { handle, state: newState }) {
      const currentState = state[handle]

      if (!currentState) {
        state[handle] = newState
      }

      switch (currentState) {
        case 'active':
          break

        case 'loading':
          state[handle] = newState === 'active'
            ? newState
            : currentState
          break

        case 'waiting':
          state[handle] = newState === 'loading' || newState === 'active'
            ? newState
            : currentState
      }
    },

    /**
     * Set components' states.
     * - Bulk sets states, can revert a component's state.
     * - Should only be called on hydration.
     * @param {Object} componentStates - Component states.
     */
    SET_STATES(state, componentStates) {
      Object.keys(componentStates).forEach((handle) => {
        if (state[handle]) {
          return
        }

        state[handle] = componentStates[handle]
      })
    },
  },

  actions: {

    /**
     * Loads component.
     * - Used when manually triggering `trigger` type components.
     * @param {String} handle - Component handle.
     */
    load({ commit, dispatch, getters }, handle) {
      if (getters.getVisible.includes(handle) && !Shopify.designMode) {
        return
      }

      commit('SET_STATE', { handle, state: cnvs.states.loading })
      dispatch('loadStylesheet', handle)
    },

    /**
     * Load component stylesheet.
     * @param {String} handle - Component handle.
     */
    loadStylesheet({ dispatch }, handle) {
      if (cnvs.environment.mode === 'hot' || cnvs.storybook) {
        return
      }

      const cssFile = `component.${handle}.css`

      const cssFilepath = cnvs.urls.assets
        .replace('placeholder', cssFile)
        .replace(`v=${cnvs.urls.missingParameter}`, 'v=CANVAS_URL_PARAMETER')

      const cssUrl = cssFilepath.split('?')[0]

      /**
       * Go through all stylesheets to see if CSS has already been loaded.
       * - Aim is to avoid duplicate styles.
       */
      const stylesheets = [...document.querySelectorAll('[rel="stylesheet"]')]

      const matchedStylesheet = stylesheets.find((stylesheet) => {
        const href = stylesheet.href
          .split('?')[0]
          .replace('https:', '')

        return href === cssUrl
      })

      if (matchedStylesheet) {
        return
      }

      /**
       * No matched stylesheet so dynamically add to `<head>`.
       */
      const link = `<link href="${cssFilepath}" rel="stylesheet">`
      document.head.insertAdjacentHTML('beforeend', link)

      /**
       * Emit event so loaded stylesheets can be tracked.
       */
      dispatch('setStylesheet', cssFile, { root: true })
    },

    /**
     * Set component state.
     * @param {Object} data - Data object.
     * @param {String} data.handle - Component handle.
     * @param {String} data.state - Component's new state.
     */
    setState({ commit }, data) {
      commit('SET_STATE', data)
    },

    /**
     * Set components' states.
     * @param {Object} componentStates - Component states.
     */
    setStates({ commit }, componentStates) {
      commit('SET_STATES', componentStates)
    },
  },
}
