/**
 * Store: Search
 * -----------------------------------------------------------------------------
 * Handles anything to do with the search that we need to track such as if it's
 * active
 */

export default {
  namespaced: true,

  state: () => ({
    searchActive: false,
    status: 'ready',
  }),

  getters: {

    /**
     * Gets the searchActive state
     * @returns {Boolean}
     */
    getSearchActive(state) {
      return state.searchActive
    },

    /**
     * Gets the search status from state
     * @returns {String}
     */
    getSearchStatus(state) {
      return state.status
    },
  },

  mutations: {

    /**
     * Set search active.
     * - if the search is in use this is true
     */
    SET_SEARCH_ACTIVE(state, searchActive = false) {
      state.searchActive = searchActive
    },

    /**
     * Set search status.
     * - Sets the status of the search, statuses are
     * - 'ready', 'loading', 'done'
     */
    SET_SEARCH_STATUS(state, searchStatus = 'ready') {
      state.status = searchStatus
    },
  },

  actions: {

    /**
     * Sets search active state value
     * @param {Boolean} searchActive searchActive new State
     */
    setSearchActive({ commit }, searchActive) {
      commit('SET_SEARCH_ACTIVE', searchActive)
    },

    /**
     * Sets search status value in state
     * @param {String} searchStatus new state for searchStatus
     */
    setSearchStatus({ commit }, searchStatus) {
      commit('SET_SEARCH_STATUS', searchStatus)
    },
  },
}
