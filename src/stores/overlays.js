/**
 * Store: Overlays
 * -----------------------------------------------------------------------------
 * Drawers and modals.
 * - Tied to the overlay component.
 * - Only JSDOC custom parameters, ignore module state or object.
 *
 */

/**
 * Overlay event object.
 * @typedef {Object} Overlay
 * @property {Boolean} [active] - Whether the namespace is the active overlay.
 * @property {Boolean} [clearQueue] - Clears other overlays from queue.
 * @property {String|Array} [component] - Component handle to update state to
 * `loading` when overlay opens, or array of component handles.
 * @property {Boolean} [ignoreDismissed] - Opens even if dismissed.
 * @property {Number} [index] - If overlay exists in active array, its index.
 * @property {String} namespace - Overlay namespace to update.
 * @property {Boolean} [stuck] - If the overlay is stuck and cannot be closed,
 * queued overlays cannot have a stuck state.
 */
export default {
  namespaced: true,

  state: () => ({
    active: [],
    dismissed: [],
    stuck: '',
  }),

  getters: {

    /**
     * Get the current active overlay.
     * @returns {String}
     */
    getActiveOverlay(state) {
      return state.active[0]
    },

    /**
     * Get the current active overlay(s).
     * @return {Array}
     */
    getActive(state) {
      return state.active
    },

    /**
     * Get overlay index by namespace.
     * @param {String} namespace - Overlay namespace.
     * @returns {Number}
     */
    getOverlayIndexByNamespace: (state) => (namespace) => {
      return state.active.indexOf(namespace)
    },
  },

  mutations: {

    /**
     * Closes all overlays.
     * - Clears the queue.
     */
    SET_CLOSE_ALL(state) {
      state.active = []
    },

    /**
     * Set dismissed state.
     * @param {String} namespace - Namespace to add to dismissed.
     */
    SET_DISMISSED(state, namespace) {
      state.dismissed.push(namespace)
    },

    /**
     * Add overlay to active array.
     * - If already open then update it.
     * - If already in queue then make active.
     * @param {Overlay} overlay - Overlay object.
     */
    SET_OPEN(state, {
      clearQueue = true,
      ignoreDismissed = false,
      index = -1,
      namespace,
    }) {
      if (
        state.dismissed.includes(namespace) &&
        !ignoreDismissed &&
        !cnvs.settings.disableOverlaysDismissed
      ) {
        return
      }

      if (clearQueue) {
        state.active = [namespace]
        return
      }

      if (index === 0) {
        state.active[0] = namespace
        return
      }

      if (index > 0) {
        const item = state.active.splice(index, 1)
        state.active.unshift(...item)
        return
      }

      state.active.unshift(namespace)
    },

    /**
     * Queues overlay.
     * - If already in queue then update it.
     * @param {Overlay} overlay - Overlay object.
     */
    SET_QUEUE(state, {
      ignoreDismissed = false,
      index = -1,
      namespace,
    }) {
      const matchedDismissed = state.dismissed.find((dismissed) => {
        return dismissed === namespace
      })

      if (
        matchedDismissed &&
        !ignoreDismissed &&
        !cnvs.settings.disableOverlaysDismissed
      ) {
        return
      }

      if (index > -1) {
        state.active[index] = namespace
        return
      }

      state.active.push(namespace)
    },

    /**
     * Set stuck state.
     * @param {String} namespace - Namespace to add to stuck.
     * @param {String} stuck - Stuck state.
     */
    SET_STUCK(state, { namespace = '', stuck = false } = {}) {
      state.stuck = namespace && stuck ? namespace : ''
    },
  },

  actions: {

    /**
     * Close overlay.
     * - Closes first active overlay if no namespace is provided.
     * - Does nothing if provided namespace does not match active overlays.
     * @param {String} [namespace] - Overlay namespace to close.
     * @param {Boolean} [dismiss] - Add overlay to dismissed state.
     */
    close({ dispatch, getters, state }, namespace, dismiss = true) {
      const namespaceIsStuck = namespace && state.stuck === namespace
      const noNamespaceProvidedWhenStuck = !namespace && state.stuck

      if (namespaceIsStuck || noNamespaceProvidedWhenStuck) {
        return
      }

      let dismissed = ''

      if (namespace) {
        const index = getters.getOverlayIndexByNamespace(namespace)

        if (index > -1) {
          dismissed = state.active.splice(index, 1)
        }

      } else {
        dismissed = state.active.splice(0, 1)
      }

      if (!dismiss) {
        return
      }

      dispatch('setStuck')
      dispatch('setDismissed', ...dismissed)
    },

    /**
     * Closes all overlays.
     * - Only the current active overlay is added to dismissed.
     * - Resets stuck state.
     * @param {Boolean} [dismiss] - Add overlay to dismissed state.
     */
    closeAll({ commit, dispatch, state }, dismiss = true) {
      if (state.stuck) {
        return
      }

      if (state.active.length && dismiss) {
        dispatch('setDismissed', state.active[0])
      }

      dispatch('setStuck')
      commit('SET_CLOSE_ALL')
    },

    /**
     * Open overlay.
     * - If other overlay is stuck then queue it.
     * - If already open then update it.
     * - If already in queue then make active.
     * @param {Overlay} overlay - Overlay object.
     */
    open({ commit, dispatch, getters, state }, overlay) {
      const index = getters.getOverlayIndexByNamespace(overlay.namespace)

      if (state.stuck && state.stuck !== overlay.namespace) {
        commit('SET_QUEUE', { ...overlay, index })
        return
      }

      commit('SET_OPEN', { ...overlay, index })

      /**
       * Update stuck state.
       */
      dispatch('setStuck', overlay)

      /**
       * If has component property then set loading state.
       */
      if (!overlay.component || !overlay.component.length) {
        return
      }

      if (typeof overlay.component === 'string') {
        dispatch('components/load', overlay.component, { root: true })
        return
      }

      overlay.component.forEach((handle) => {
        dispatch('components/load', handle, { root: true })
      })
    },

    /**
     * Queues overlay.
     * - If already in queue then update it.
     * @param {Overlay} overlay - Overlay object.
     */
    queue({ commit, dispatch, getters }, overlay) {

      commit('SET_QUEUE', {
        ...overlay,
        index: getters.getOverlayIndexByNamespace(overlay.namespace),
      })

      /**
       * If component then set loading state.
       */
      if (!overlay.component) {
        return
      }

      dispatch('components/load', overlay.component, { root: true })
    },

    /**
     * Set dismissed state.
     * - If namespace is already in dismissed then it's ignored.
     * @param {String} namespace - Namespace to add to dismissed.
     */
    setDismissed({ commit, state }, namespace) {
      if (state.dismissed.includes(namespace)) {
        return
      }

      commit('SET_DISMISSED', namespace)
    },

    /**
     * Set stuck state.
     * @param {Overlay} overlay - Overlay object.
     */
    setStuck({ commit }, overlay) {
      commit('SET_STUCK', overlay)
    },

    /**
     * Toggle overlay.
     * - If in active array but not active then moves to top.
     * - If overlay is active overlay then it's closed.
     * @param {Overlay} overlay - Overlay object.
     */
    toggle({ dispatch, getters }, overlay) {
      if (getters.getOverlayIndexByNamespace(overlay.namespace) >= 0) {
        dispatch('close', overlay.namespace)
        return
      }

      dispatch('open', overlay)
    },
  },
}
