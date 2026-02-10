<template>
  <div class="country-select-landing__wrapper">
    <div class="country-select-landing__close-wrapper">
      <button
        class="country-select-landing__close icon-button"
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

    <div v-if="currentPage == 'landing-default'">
      <div class="country-select-landing__content-wrapper">
        <h2
          id="section-country-select-landing"
          class="country-select-landing__title text-mobile-titles text-h2-desktop"
          v-text="$string('country_select.location_set',
                          { replace: { country: selectedStore.name } })"
        />
        <ul class="country-select-landing__list">
          <li
            class="country-select-landing__body text-p-desktop text-mobile-p"
            v-text="$string('country_select.ship_in',
                            { replace: { currency: selectedStore.currency } })"
          />
          <li
            class="country-select-landing__body text-p-desktop text-mobile-p"
            v-text="$string('country_select.shipping_options',
                            { replace: { country_code: selectedStore.code } })"
          />
        </ul>
      </div>
      <div class="country-select-landing__bottom-wrapper">
        <btn
          class="country-select-landing__continue"
          modifiers="primary center block no-icon"
          :label="$string('country_select.continue')"
          name="country-switch-continue"
          type="button"
          @click.prevent="updateStore(true, 'countrySelectLanding')"
        />
        <btn
          class="country-select-landing__change-country"
          modifiers="secondary center block no-icon"
          :label="$string('country_select.change_country')"
          name="country-switch-next-page"
          type="button"
          @click.prevent="setSecondPage"
        />
      </div>
    </div>

    <div v-if="currentPage == 'landing-change-country'">
      <div class="country-select-landing__content-wrapper">
        <h1
          class="country-select-landing__title text-h2"
          v-text="$string('country_select.change_country') "
        />
        <div class="country-select-landing__country-selector">
          <responsive-image
            class="country-select-landing__flag"
            :image="selectedStore.flag"
            min-max="10-100"
          />
          <select
            class="country-select-landing__select text-p-xs-bold text-mobile-p-desktop"
            @change="setCountry"
          >
            <option
              v-for="store of getStores"
              :key="store.handle"
              :selected="selectedStore.handle == store.handle"
              class="country-select-landing__option"
              :data-external-link="store.link"
              :value="store.handle"
            >
              {{ store.name || store.code }}
            </option>
          </select>
          <div class="country-select-landing__selector-right">
            <p
              class="country-select-landing__currency text-p-xs-bold text-mobile-p-desktop"
              v-text="`${selectedStore.code}/${selectedStore.currency}`"
            />
            <icon-chevron-down
              aria-hidden="true"
              class="country-select-landing__chevron"
            />
          </div>
        </div>
      </div>
      <div class="country-select-landing__bottom-wrapper">
        <btn
          class="country-select-landing__done"
          modifiers="primary center block no-icon"
          :label="$string('country_select.continue')"
          name="country-switch-select-done"
          type="button"
          @click.prevent="updateStore(false, 'countrySelectLanding')"
        />
        <btn
          class="country-select-landing__cancel"
          modifiers="secondary center block no-icon"
          :label="$string('country_select.cancel')"
          name="country-switch-close"
          type="button"
          @click.prevent="overlay.close()"
        />
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
 * @param {Object} overlay - Overlay object for the modal.
 *
 */
import ResponsiveImage from '~global/images/responsive-image'
import IconChevronDown from '~icons/directional-navigation/chevron/down.svg'
import IconClose from '~icons/directional-navigation/close.svg'
import MultiCountryApi from './country-select-api'
import Btn from '~global/btn/btn'

export default {
  name: 'CountrySelectLanding',

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
  },
}
</script>

<style lang="scss">
@import './country-select-landing';
</style>
