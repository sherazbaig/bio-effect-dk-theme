/**
 * Store: Index
 * -----------------------------------------------------------------------------
 * Root store for all theme level states.
 * - Tied to the index component.
 * - Only JSDOC custom parameters, ignore module state or object.
 *
 */
export default {
  state: () => ({
    hydrated: false,
    previousUrl: '/',
    screen: {
      breakpoint: 'xs',
      height: 0,
      mobile: true,
      width: 0,
    },
    settings: {
      mobileBreakpoints: ['xs', 's', 'm'],
      start: 100,
      threshold: 5,
      throttle: 250,
    },
    scroll: {
      direction: 'none',
      header: 'open',
      top: true,
      x: 0,
      y: 0,
    },
    stylesheets: [],
  }),

  getters: {
    getScrollState(state) {
      return state.scroll.header
    },
  },

  mutations: {

    /**
     * Set rehydrated state.
     */
    SET_HYDRATED(state) {
      state.hydrated = true
    },

    /**
     * Set mobile breakpoints state.
     * @param {Array} mobileBreakpoints - Breakpoints considered as mobile.
     */
    SET_MOBILE_BREAKPOINTS(state, mobileBreakpoints) {
      state.settings.mobileBreakpoints = mobileBreakpoints
    },

    /**
     * Set previous URL state.
     * @param {String} pathname - Previous pathname.
     */
    SET_PREVIOUS_URL(state, pathname) {
      state.previousUrl = pathname
    },

    /**
     * Set screen state.
     * @param {Object} screen - Screen state object.
     */
    SET_SCREEN(state, screen) {
      state.screen = screen
    },

    /**
     * Set scroll state.
     * @param {Object} scroll - Scroll state object.
     */
    SET_SCROLL(state, scroll) {
      state.scroll = scroll
    },

    /**
     * Set scroll start.
     * @param {String} start - New scroll start.
     */
    SET_SCROLL_START(state, start) {
      state.settings.start = start
    },

    /**
     * Set loaded stylesheets.
     * @param {String} stylesheet - Loaded stylesheet file name.
     */
    SET_STYLESHEET(state, stylesheet) {
      state.stylesheets.push(stylesheet)
    },

    /**
     * Set loaded stylesheets.
     * @param {String} newHeaderState - header state.
     */
    SET_SCROLL_HEADER(state, newHeaderState) {
      state.scroll.header = newHeaderState
    },
  },

  actions: {

    /**
     * Commit rehydrated state.
     * - Runs initial items.
     */
    async rehydrateSite({ dispatch, commit }) {
      commit('SET_HYDRATED')

      await Promise.all([dispatch('cart/setResponse', true)])
    },

    /**
     * Commit mobile breakpoints state.
     * @param {Array} mobileBreakpoints - Breakpoints considered as mobile.
     */
    setMobileBreakpoints({ commit }, mobileBreakpoints) {
      commit('SET_MOBILE_BREAKPOINTS', mobileBreakpoints)
    },

    /**
     * Commit previous URL state.
     * @param {String} pathname - Previous pathname.
     */
    setPreviousUrl({ commit }, pathname) {
      commit('SET_PREVIOUS_URL', pathname)
    },

    /**
     * Commit screen state.
     * @param {Object} screen - Screen state object.
     */
    setScreen({ commit }, screen) {
      commit('SET_SCREEN', screen)
    },

    /**
     * Commit scroll state.
     * @param {Object} scroll - Scroll state object.
     */
    setScroll({ commit }, scroll) {
      commit('SET_SCROLL', scroll)
    },

    /**
     * Commit scroll start setting state.
     * @param {String} start - New start.
     */
    setScrollStart({ commit }, start) {
      commit('SET_SCROLL_START', start)
    },

    /**
     * Commit scroll start setting state.
     * @param {String} state - New state.
     */
    setScrollHeader({ commit }, state) {
      commit('SET_SCROLL_HEADER', state)
    },

    /**
     * Commit loaded stylesheet state.
     * @param {String} stylesheet - Loaded stylesheet file name.
     */
    setStylesheet({ commit }, stylesheet) {
      commit('SET_STYLESHEET', stylesheet)
    },
  },
}
