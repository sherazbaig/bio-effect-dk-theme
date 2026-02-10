/**
 * Component: Multi Country Select.
 * -----------------------------------------------------------------------------
 */
import { mapActions, mapGetters } from 'vuex'

export default {

  data() {
    return {
      currentPage: 'landing-default',
      selectedStore: {},
      settings: {
        country: cnvs.store.country,
        language: cnvs.store.language,
      },
      activeClass: '',
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      currentStore: 'multi-store/getCurrentStore',
      geolocation: 'multi-store/getGeolocation',
      getStores: 'multi-store/getStores',
      getTitle: 'multi-store/getMultiStoreTitle',
      getMessage: 'multi-store/getMultiStoreMessage',
    }),

    /**
     * Compute recommended store.
     * @returns {Object}
     */
    currentRecommendedStore() {
      return this.getStores.find((store) => {
        return store.handle.includes(this.geolocation.handle)
      })
    },
  },

  mounted() {
    this.selectedStore = this.currentStore || this.currentRecommendedStore
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      setChosenStore: 'multi-store/setChosenStore',
      closeOverlay: 'overlays/close',
    }),

    /**
     * Moves to the second page of landing Multiu Country Switcher
     */
    setSecondPage() {
      this.currentPage = 'landing-change-country'
    },

    /**
     * Sets selected country on option clicked
     *
     * @param {Object} event
     */
    setCountry(event) {
      const selectedHandle = event.target.value
      this.selectedStore =
        this.getStores.find(store => store.handle === selectedHandle) ||
        this.currentRecommendedStore
    },

    /**
     * Updates store once confirm clicked.
     */
    updateStore(isLandingStore, activeModal) {
      const isChangingShopifyURL =
        `${this.selectedStore.shopify}.myshopify.com` !== cnvs.store.permanentDomain.replaceAll('/', '')

      this.setChosenStore(this.selectedStore)

      if (isLandingStore) {
        this.closeOverlay(activeModal)

        return
      }

      if (!isChangingShopifyURL) {
        this.updateLocalization(this.selectedStore.handle, this.selectedStore.link)
        this.closeOverlay(activeModal)
        return
      }

      if (!this.selectedStore?.link) {
        this.closeOverlay(activeModal)
        return
      }

      window.location = `https://${this.selectedStore.link}`
    },

    /**
     * Handles update of site localization.
     * @param {String} country - Country code.
     * @param {String} url - Where to redirect to, if required`.
     */
    updateLocalization(country, url) {
      const formData = new FormData()
      formData.append('_method', 'put')
      formData.append('country_code', country)

      fetch('/localization', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: new URLSearchParams(formData).toString(),
      })
        .then(response => {
          if (!response.ok) {
            return
          }

          try {
            localStorage.setItem('chosenStore', JSON.stringify(this.selectedStore))
          } catch (error) {
            console.warn(error)
          }

          if (url) {
            window.location = `https://${url}`
            return
          }
          window.location = response.url
        })
    },

    slideInModal() {
      setTimeout(() => {
        this.activeClass = 'active'
      }, 50)
    },
  },
}
