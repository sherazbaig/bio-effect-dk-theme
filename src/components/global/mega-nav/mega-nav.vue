<template>
  <transition name="fade">
    <div
      v-if="menu"
      class="mega-nav"
    >
      <div
        class="mega-nav__left container grid"
        :style="{ '--menu-item-count': menu?.links?.length }"
      >
        <div class="mega-nav__left--inner col xs-span xl2-13">
          <div
            v-for="tier of menu.links"
            :key="tier.handle"
          >
            <span
              class="mega-nav__col-title text-button"
              v-text="tier.title"
            />

            <ul class="mega-nav__col-list">
              <li
                v-for="link of tier.links"
                :key="link.handle"
                class="mega-nav__col-item"
              >
                <a
                  :href="link.url"
                  class="mega-nav__col-link"
                  v-text="link.title"
                />
              </li>
            </ul>
          </div>
          <div v-if="discover.enabled">
            <span
              class="mega-nav__col-title text-button"
              v-text="discover.title"
            />

            <ul class="mega-nav__col-list">
              <li class="mega-nav__col-item">
                <a
                  class="mega-nav__discover-link"
                  :href="discover.desktopLink"
                >
                  <transition name="slide-up">
                    <div class="mega-nav__image-section">
                      <responsive-image
                        class="mega-nav__image"
                        :lazyload="false"
                        :image="desktopImageSource"
                        ratio="149:119"
                        min-max="275-1500"
                      />

                      <span class="mega-nav__image-title-container">
                        <span
                          class="mega-nav__image-title"
                          v-text="discover.desktopLinkLabel"
                        />

                        <arrow-right />
                      </span>
                    </div>
                  </transition>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

/**
 * Vue: mega-nav (mega-nav)
 * -----------------------------------------------------------------------------
 * Mega nav.
 *
 * @param {Object} menu - Section's Liquid ID.
 * @param {Object|String} discover.desktopImage
 * @param {String} discover.desktopLink
 * @param {String} discover.desktopLinkLabel
 * @param {Boolean} discover.enabled
 * @param {Object|String} discover.mobile
 * @param {Object|String} discover.title
 *
 */
import ResponsiveImage from '~global/images/responsive-image'
import ArrowRight from '~icons/directional-navigation/link-arrow.svg'

export default {
  name: 'MegaNav',

  components: {
    ResponsiveImage,
    ArrowRight,
  },

  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },
    discover: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      cnvsGlobal: true,
    }
  },

  computed: {
    desktopImageSource() {
      if (!this.discover.enabled) {
        return false
      }

      return typeof this.discover.desktopImage === 'string'
        ? { src: this.discover.desktopImage }
        : this.discover.desktopImage
    },
  },
}
</script>
