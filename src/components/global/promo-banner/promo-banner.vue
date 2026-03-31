<template>
  <div
    ref="promoBanner"
    class="promo-banner critical-component-hide"
    :style="`--marquee-duration: ${marqueeDuration}s;`"
  >
    <div
      ref="container"
      class="promo-banner__container container"
    >
      <span
        :id="`section-title-${liquid.sectionId}`"
        class="visually-hidden"
        v-text="$string('general.site_header.promo_banner')"
      />

      <div class="promo-banner__marquee-wrapper">
        <ul
          class="promo-banner__list"
          :class="{ 'promo-banner__list--static': !isRolling }"
        >
          <li
            v-for="(block, index) of blocks"
            :key="`promo-${index}`"
            class="promo-banner__list-item text-other-label-s"
          >
            <span v-html="getBlockText(block.title)" />
          </li>
        </ul>
      </div>

      <div
        v-if="displayStoreSelector"
        class="promo-banner__country-select"
      >
        <country-select />
      </div>
      <div class="promo-banner__desktop-icons">
        <div
          v-if="displayAccount"
          ref="accountButton"
          class="promo-banner__account"
          @click="toggleAccountModal"
        >
          <icon-account />

          <span
            class="promo-banner__account-label text-p-xs-bold"
            v-text="$string('general.site_header.account')"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>

/**
 * Vue: Promo banner (promo-banner)
 * -----------------------------------------------------------------------------
 * Promo banner template.
 * - Conditionally loaded when section has blocks using Liquid.
 * - Scroll-snap is used for basic scrolling, you will need to add the carousel
 *   functionality if this is required.
 *
 * @param {Object} autoscroll - Autoscroll settings.
 * @param {Array} blocks - Promo blocks.
 * @param {String} desktopMessage - Message to display on desktop screen sizes.
 * @param {Boolean} displayStoreSelector - Whether to display the store/country
 * selector.
 * @param {Boolean} displayAccount - Whether to display the Account link
 * @param {Object} liquid - Liquid section ID, used for theme editor events.
 *
 */
import { mapActions } from 'vuex'
import breakpoints from '~/config/breakpoints'

import CountrySelect from '~global/country-select/country-select'
import IconAccount from '~icons/general/account.svg'

export default {
  name: 'PromoBanner',

  components: {
    CountrySelect,
    IconAccount,
  },

  computed: {
    /**
     * Only roll when autoscroll is enabled and there is more than 1 block.
     * @returns {Boolean}
     */
    isRolling() {
      return this.autoscroll.enable && this.blocks.length > 1
    },

    /**
     * Total marquee duration scaled by number of blocks.
     * @returns {Number}
     */
    marqueeDuration() {
      return this.autoscroll.timing * Math.max(this.blocks.length, 1)
    },
  },

  props: {
    autoscroll: {
      type: Object,
      default: () => ({
        enable: false,
        timing: 5,
      }),
    },
    blocks: {
      type: Array,
      default: () => [],
    },
    desktopMessage: {
      type: String,
      default: '',
    },
    displayStoreSelector: {
      type: Boolean,
      default: false,
    },
    displayAccount: {
      type: Boolean,
      default: false,
    },
    liquid: {
      type: Object,
      default: () => ({
        sectionId: '',
        upSellProduct: false,
      }),
    },
  },

  mounted() {
    let elapsedTime = 0

    const promoBannerInterval = window.setInterval(() => {
      if (this.$refs.promoBanner.offsetHeight === 0 && elapsedTime < 10000) {
        elapsedTime += this.$timing('quick')
        return
      }

      cnvs.EventBus.emit('cnvs:update-site-header-height')
      window.clearInterval(promoBannerInterval)
    }, this.$timing('quick'))
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      toggleOverlay: 'overlays/toggle',
    }),

    /**
     * Get block text.
     * - Applies text class to <a> elements.
     * @param {String} block - Block text.
     * @returns {String}
     */
    getBlockText(block) {
      return block
        .replaceAll('<a', '<a class="text-other-label-s"')
        .replaceAll('<strong', '<strong class="text-other-label-s"')
    },

    /**
     * Toggle account modal.
     */
    async toggleAccountModal() {
      this.toggleOverlay({
        component: 'account-forms',
        ignoreDismissed: true,
        namespace: 'accountForms',
      })

      if (window.matchMedia(`(max-width: ${breakpoints.l}px)`).matches) {
        return
      }

      await this.$nextTick()
      this.calculatePosition()
    },

    /**
     * Calculate position account forms.
     */
    calculatePosition() {
      const accountForms = document.querySelector(
        '.account-forms-overlay__container',
      )

      if (!accountForms) {
        return
      }

      const clientRect = this.$refs.accountButton.getBoundingClientRect()
      const leftPosition = (clientRect.left - accountForms.offsetWidth) + clientRect.width

      accountForms.style.left = `${leftPosition}px`
    },
  },
}
</script>
