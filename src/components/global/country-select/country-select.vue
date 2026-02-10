<template>
  <div
    v-show="multiStoreEnabled"
    class="country-select"
  >
    <responsive-image
      v-if="currentStore.flag"
      class="country-select__flag"
      alt=""
      :image="currentStore.flag"
      min-max="12-48"
    />
    <button
      v-if="currentStore.name"
      class="country-select__select"
      type="button"
      @mousedown="loadMultiStoreModal"
      @click.prevent="openCountrySelectModal"
      v-text="currentStore.name"
    />
    <icon-chevron-down
      aria-hidden="true"
      class="country-select__chevron"
    />
  </div>
</template>

<script>

/**
 * Vue: country-select (country-select)
 * -----------------------------------------------------------------------------
 * Country Selector.
 *
 */
import ResponsiveImage from '~global/images/responsive-image'
import IconChevronDown from '~icons/directional-navigation/chevron/down.svg'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CountrySelect',

  components: {
    ResponsiveImage,
    IconChevronDown,
  },

  data() {
    return {
      modal: false,
      cnvsGlobal: true,
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      multiStoreEnabled: 'multi-store/getEnabled',
      currentStore: 'multi-store/getCurrentStore',
    }),
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      openOverlay: 'overlays/open',
    }),

    /**
     * Causes the multi-store modal component to load before being displayed.
     */
    loadMultiStoreModal() {
      this.loadComponent('country-select-modal')
    },

    /**
     * Handle zoom click.
     */
    openCountrySelectModal() {
      this.openOverlay({
        component: 'country-select-modal',
        ignoreDismissed: true,
        namespace: 'countrySelectModal',
      })
    },
  },
}
</script>
