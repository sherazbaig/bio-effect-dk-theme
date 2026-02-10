<template>
  <div
    class="container country-select-modal__container"
    @click.prevent="(e) => {
      if (e.target.classList.value.includes('country-select-modal__container')) {
        overlay.close()
      }
    }"
  >
    <div
      class="country-select-modal__wrapper"
      :class="activeClass ? 'active' : ''"
    >
      <div class="country-select-modal__content-wrapper">
        <div class="country-select-modal__close-wrapper">
          <button
            class="country-select-modal__close icon-button"
            type="button"
            @click.prevent="overlay.close()"
          >
            <span
              class="visually-hidden"
              v-text="$string('accessibility.close')"
            />

            <icon-close />
          </button>
        </div>
        <h5
          v-if="getTitle"
          id="section-country-select-modal"
          class="country-select-modal__title text-h5-desktop text-h6"
          v-text="getTitle"
        />
        <p
          v-if="getMessage"
          class="country-select-modal__body text-p-xs-bold"
          v-text="getMessage"
        />
      </div>

      <div class="country-select-modal__bottom-wrapper">
        <div class="country-select-modal__country-selector">
          <responsive-image
            class="country-select-modal__flag"
            alt=""
            :image="selectedStore.flag"
            min-max="12-66"
          />
          <select
            class="country-select-modal__select text-p-xs-bold text-mobile-p-desktop"
            @change="setCountry"
          >
            <option
              v-for="store of getStores"
              :key="store.handle"
              :selected="selectedStore.handle == store.handle"
              class="country-select-modal__option"
              :data-external-link="store.link"
              :value="store.handle"
              v-text="store.name || store.code"
            />
          </select>
          <div class="country-select-modal__selector-right">
            <p
              class="country-select-modal__currency text-p-xs-bold text-mobile-p-desktop"
              v-text="selectorAdditionalText"
            />
            <icon-chevron-down
              aria-hidden="true"
              class="country-select-modal__chevron"
            />
          </div>
        </div>
        <div class="country-select-modal__update-button">
          <btn
            class="country-select-modal__update-button"
            modifiers="primary center block no-icon"
            :label="$string('general.update')"
            name="country-switch-select-done"
            type="button"
            @click.prevent="updateStore(false, 'countrySelectModal')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: country-select (country-select)
 * -----------------------------------------------------------------------------
 * Country Selector.
 *
 *  @param {Object} overlay - Overlay object for the modal.
 *
 */
import ResponsiveImage from '~global/images/responsive-image'
import IconChevronDown from '~icons/directional-navigation/chevron/down.svg'
import IconClose from '~icons/directional-navigation/close.svg'
import MultiCountryApi from './country-select-api'
import Btn from '~global/btn/btn'

export default {
  name: 'CountrySelectModal',

  components: {
    ResponsiveImage,
    IconChevronDown,
    IconClose,
    Btn,
  },

  mixins: [MultiCountryApi],

  props: {
    overlay: {
      type: Object,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: null,
    },
  },

  computed: {

    /**
     * Compute the text that sits on the right of the dropdown.
     * - If the selected store has both a code and currency, displays as
     *   `code/currency`
     * - Otherwise returns just the code, just the currency, or an empty string.
     * @returns {String} - computed additonal text.
     */
    selectorAdditionalText() {
      if (this.selectedStore?.code && this.selectedStore.currency) {
        return `${this.selectedStore.code}/${this.selectedStore.currency}`
      }

      if (this.selectedStore?.currency) {
        return this.selectedStore.currency
      }

      if (this.selectedStore?.code) {
        return this.selectedStore.code
      }

      return ''
    },
  },

  watch: {
    isActive() {
      if (!this.isActive) {
        this.activeClass = ''

        return
      }

      this.slideInModal()
    },
  },

  mounted() {
    this.slideInModal()
  },
}
</script>

<style lang="scss">
@import './country-select-modal';
</style>
