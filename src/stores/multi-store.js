/**
 * Multi store
 * -----------------------------------------------------------------------------
 *
 * Multi store state and events.
 *
 */
export default {
  namespaced: true,
  state: () => ({
    enabled: true,
    geolocation: {
      handle: '',
      name: '',
    },
    chosenStore: {},
    stores: [],
    multiStoreTitle: '',
    multiStoreMessage: '',
  }),

  getters: {
    getCurrentStore(state) {
      let chosenStore

      try {
        const chosenStoreData = localStorage.getItem('chosenStore')
        chosenStore = JSON.parse(chosenStoreData)
      } catch (error) {
        console.warn(error)
      }

      if (chosenStore) {
        return chosenStore
      }

      const storeUrl = cnvs.store.shopUrl.replaceAll('/', '').trim()
      const urlMatchedStores = state.stores.filter((store) => {
        return store.link.includes(storeUrl)
      })
      const subStoreMatch = urlMatchedStores.find((store) => {
        return state.chosenStore.handle === store.handle
      })
      const matchedStore = subStoreMatch || urlMatchedStores[0]

      if (matchedStore) {
        return matchedStore
      }

      return state.stores.find((store) => store.code === cnvs.store.country) || {}
    },

    getEnabled(state) {
      return state.enabled
    },

    getGeolocation(state) {
      return state.geolocation
    },

    getStores(state) {
      return state.stores
    },

    getMultiStoreTitle(state) {
      return state.multiStoreTitle
    },

    getMultiStoreMessage(state) {
      return state.multiStoreMessage
    },
  },

  mutations: {

    /**
     * Set if the multi-store functionality is enabled.
     */
    SET_ENABLED(state, enabled) {
      state.enabled = enabled
    },

    SET_CHOSEN_STORE(state, store) {
      state.chosenStore = store
    },

    /**
     * Set geolocation.
     * @param {Object} geolocation - Formatted geolocation.
     * @param {String} geolocation.countryCode - Country ISO code.
     * @param {String} geolocation.name - Country name.
     */
    SET_GEOLOCATION(state, geolocation) {
      state.geolocation = geolocation
    },

    /**
     * Set countries state.
     */
    SET_STORES(state, stores) {
      state.stores = stores
    },

    /**
     * Set multi store title state.
     */
    SET_MULTI_STORE_TITLE(state, title) {
      state.multiStoreTitle = title
    },

    /**
     * Set multi store title state.
     */
    SET_MULTI_STORE_MESSAGE(state, message) {
      state.multiStoreMessage = message
    },
  },

  actions: {

    /**
     * Set enabled/disabled for multi-store functionality.
     * @param {Boolean} enabled - Whether multi-store functionality is enabled
     */
    setEnabled({ commit }, enabled) {
      commit('SET_ENABLED', enabled)
    },

    setChosenStore({ commit }, store) {
      commit('SET_CHOSEN_STORE', store)
    },

    /**
     * Set geolocation.
     * @param {Object} response - Response from Shopify geolocation app.
     */
    setGeolocation({ commit }, response) {
      const { the } = response
      const { name, handle } = response.detected_values.country
      commit('SET_GEOLOCATION', { handle, name, the })
    },

    /**
     * Commit countries state.
     * @param {Array} countries - Countries to show on multi store pop-up.
     */
    setStores({ commit }, stores) {
      commit('SET_STORES', stores)
    },

    /**
     * Commit countries state.
     * @param {Array} title - Title to show on multi store pop-up.
     */
    setMultiStoreTitle({ commit }, title) {
      commit('SET_MULTI_STORE_TITLE', title)
    },

    /**
     * Commit countries state.
     * @param {Array} message - Message to show on multi store pop-up.
     */
    setMultiStoreMessage({ commit }, message) {
      commit('SET_MULTI_STORE_MESSAGE', message)
    },
  },
}
