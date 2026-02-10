<template>
  <div class="multi-store-settings" />
</template>

<script>

/**
 * Vue: multi-store-settings (multi-store-settings)
 * -----------------------------------------------------------------------------
 * Entries for multi store.
 *
 * @param {Boolean} enabled - Whether multi-store is enabled or disabled.
 * @param {String} message - Message to display in multi-store component.
 * @param {Array} stores - Array of stores data.
 * @param {String} title - Title to display in the multi-store component.
 */

import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'MultiStoreSettings',

  props: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    stores: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      cnvsGlobal: true,
    }
  },

  computed: {
    ...mapGetters({
      getGeolocation: 'multi-store/getGeolocation',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      geolocation: (state) => state['multi-store'].geolocation,
      chosenStore: (state) => state['multi-store'].chosenStore,
    }),
  },

  watch: {

    /**
     * Watch geolocation country code to display multi-store modal.
     */
    'geolocation.handle'() {
      if (this.chosenStore.handle || !this.enabled) {
        return
      }

      setTimeout(() => {
        this.queueOverlay({
          component: 'country-select-landing',
          ignoreDismissed: true,
          namespace: 'countrySelectLanding',
        })
      }, this.$timing('slow'))
    },
  },

  mounted() {
    this.setEnabled(this.enabled)
    this.setStores(this.stores)
    this.setTitle(this.title)
    this.setMessage(this.message)
    if (!this.enabled) {
      return
    }
    this.queryGeolocation()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      openOverlay: 'overlays/open',
      queueOverlay: 'overlays/queue',
      setEnabled: 'multi-store/setEnabled',
      setGeolocation: 'multi-store/setGeolocation',
      setStores: 'multi-store/setStores',
      setTitle: 'multi-store/setMultiStoreTitle',
      setMessage: 'multi-store/setMultiStoreMessage',
    }),

    /**
     * Query geolocation from Shopify geolocation app.
     */
    async queryGeolocation() {

      try {
        let response = await fetch('/browsing_context_suggestions.json')
        response = await response.json()

        this.setGeolocation({
          ...response,
        })

      } catch (error) {
        throw new Error('Failed to fetch geolocation', error)
      }
    },
  },
}
</script>
