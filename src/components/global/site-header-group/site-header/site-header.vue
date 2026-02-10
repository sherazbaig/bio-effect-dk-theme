<template>
  <div class="site-header-container container">
    <header class="site-header">
      <div class="site-header__container container">
        <!-- Left -->
        <div class="site-header__left">
          <a
            class="site-header__logo"
            :href="$variable('routes.root')"
          >
            <span
              id="site-header-title"
              class="visually-hidden"
              v-text="$variable('store.shopName')"
            />

            <brand-logo />
          </a>
        </div>

        <!-- Right -->
        <div class="site-header__right">
          <a
            class="site-header__cart icon-button"
            :href="$variable('routes.cart.url')"
            @click="handleCartToggle"
          >
            <span
              class="visually-hidden"
              v-text="$string('general.site_header.cart')"
            />

            <icon-cart />

            <span
              v-if="cart.item_count > 0"
              class="site-header__cart-badge critical-clear text-body-2xs-regular"
              aria-hidden="true"
              v-text="cartCount"
            />
          </a>

          <button
            class="site-header__menu icon-button"
            type="button"
            :aria-label="$string('general.site_header.menu')"
            @click="openMobileDrawer"
          >
            <icon-menu />
          </button>
        </div>

        <div class="site-header__navigation">
          <ul class="site-header__navigation-list">
            <li
              v-for="item of desktop.items"
              :key="item.handle"
              class="site-header__navigation-item"
              :class="{
                'active': item.handle === meganav.currentMenu?.handle
              }"
              @click.prevent="handleNavOpen(item)"
            >
              <a
                :href="item.url"
                class="site-header__navigation-link text-button-nav"
              >
                <span class="site-header__hover-text">
                  <span class="site-header__hover-text-text">
                    <span
                      v-for="(letter, index) of item.title.split('')"
                      :key="`${item.handle}-hover-letter-${index}`"
                      :style="{
                        '--i': index,
                      }"
                    >
                      {{ letter }}
                    </span>
                  </span>
                  <span class="site-header__hover-text-split">
                    <span
                      v-for="(letter, index) of item.title.split('')"
                      :key="`${item.handle}-split-letter-${index}`"
                      :style="{
                        '--i': index,
                        '--r': item.title.length - index,
                      }"
                    >
                      {{ letter }}
                    </span>
                  </span>
                </span>
              </a>
            </li>
            <li class="site-header__navigation-item">
              <button
                class="site-header__navigation-button site-header__cart-button"
                type="button"
                @click="handleCartToggle"
              >
                <span class="site-header__desktop-cart">
                  <icon-cart />
                </span>

                <span class="site-header__hover-text text-button-nav">
                  <span
                    class="site-header__hover-text-text"
                  >
                    <span
                      v-for="(letter, index) of $string('general.site_header.cart')"
                      :key="`text-${index}-cart`"
                      :style="{
                        '--i': index,
                      }"
                    >
                      {{ letter }}
                    </span>
                  </span>
                  <span class="site-header__hover-text-split">
                    <span
                      v-for="(letter, index) of $string('general.site_header.cart')"
                      :key="`split-${index}-cart`"
                      :style="{
                        '--i': index,
                        '--r': $string('general.site_header.cart').length - index,
                      }"
                    >
                      {{ letter }}
                    </span>
                  </span>
                </span>

                <span
                  v-if="cart.item_count > 0"
                  class="site-header__cart-badge critical-clear text-body-2xs-regular"
                  aria-hidden="true"
                  v-text="cartCount"
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Mega Nav -->
    <overlay
      key="megaNav"
      block-class="mega-nav-overlay"
      direction="fade"
      namespace="megaNav"
      :template="false"
      type="shelf"
    >
      <template #body="overlay">
        <meganav
          :overlay="overlay"
          :menu="meganav.currentMenu"
          :discover="discover"
        />
      </template>
    </overlay>

    <!-- Menu drawer -->
    <teleport
      to="body"
    >
      <overlay
        key="menuDrawer"
        block-class="menu-drawer-overlay"
        direction="left"
        namespace="menuDrawer"
        type="drawer"
        concurrent-children
      >
        <template #body="overlay">
          <menu-drawer
            v-if="getComponentVisible('menu-drawer')"
            v-cloak
            :handle="mobile.handle"
            :item-count="mobile.itemCount"
            :display-account="mobile.displayAccount"
            :overlay="overlay"
            :discover="discover"
          />

          <div
            v-if="!getComponentActive('menu-drawer')"
            class="navigation__menu-drawer"
          >
            <div
              v-for="(_, index) of [...Array(mobile.itemCount)]"
              :key="`menu-drawer-loading-${index}`"
              class="navigation__menu-drawer-link"
            >
              <span class="navigation__menu-drawer-loading" />
            </div>
          </div>
        </template>
      </overlay>
    </teleport>
  </div>
</template>

<script>

import { clearAllBodyScrollLocks } from 'body-scroll-lock'

/**
 * Vue: Site header (site-header-group)
 * -----------------------------------------------------------------------------
 * Site header central banner containing logo, icon buttons, and menu drawer.
 * - No style import as it's included in critical stylesheet.
 *
 * @param {Object} liquid - Liquid section ID, used for theme editor events.
 * @param {Object} mobile - Mobile linklist handle and item count.
 * @param {String} titleElement - HTML element of site logo based on page.
 *
 */
import { defineAsyncComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

import Overlay from '~global/overlay/overlay'

import BrandLogo from '~icons/general/brand-logo.svg'
import IconCart from '~icons/general/cart.svg'
import IconMenu from '~icons/general/menu.svg'

export default {
  name: 'SiteHeader',

  components: {
    BrandLogo,
    IconCart,
    IconMenu,
    MenuDrawer: defineAsyncComponent({
      loader: () => import(
        /* webpackChunkName: 'component.menu-drawer' */
        '~async/menu-drawer/menu-drawer'
      ),
    }),
    Meganav: defineAsyncComponent({
      loader: () => import(
        /* webpackChunkName: 'component.meganav' */
        '~global/mega-nav/mega-nav'
      ),
    }),
    Overlay,
  },

  props: {
    // Needed for theme editor events
    // eslint-disable-next-line vue/no-unused-properties
    liquid: {
      type: Object,
      default: () => ({
        sectionId: '',
      }),
    },
    desktop: {
      type: Object,
      default: () => ({}),
    },
    mobile: {
      type: Object,
      default: () => ({
        handle: 'main-menu',
        itemCount: 5,
      }),
    },
    discover: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      navTimeout: null,
      meganav: {
        currentMenu: null,
        open: false,
      },
      scrollLastState: null,
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getActiveOverlay: 'overlays/getActiveOverlay',
      getComponentExists: 'components/getExists',
      getScrollState: 'getScrollState',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Returns cart count excluded free products
     */
    cartCount() {
      // eslint-disable-next-line no-underscore-dangle
      return this.cart.items.filter(item => !item.properties._gift)
        .reduce((accumulator, item) => accumulator + item.quantity, 0)
    },
  },

  watch: {
    getActiveOverlay(newValue, oldValue) {
      if (oldValue === 'megaNav' && !newValue && window.scrollY > 0) {
        this.setScrollHeader(this.scrollLastState)
        this.scrollLastState = null
      }

      if (oldValue === 'menuDrawer' && !newValue) {
        clearAllBodyScrollLocks()
      }
    },
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
      setScrollHeader: 'setScrollHeader',
      toggleOverlay: 'overlays/toggle',
    }),

    /**
     * Handle menu toggle.
     */
    handleMenuToggle() {
      this.toggleOverlay({
        component: 'menu-drawer',
        ignoreDismissed: true,
        namespace: 'menuDrawer',
      })
    },

    /**
     * Handle cart toggle.
     * - Prevents opening cart drawer on cart page.
     * @param {Object} event - Click event.
     */
    handleCartToggle(event) {
      if (
        this.$variable('page.type') === 'cart' ||
        !this.getComponentExists('cart-drawer')
      ) {
        return
      }

      event.preventDefault()

      this.toggleOverlay({
        component: 'cart-drawer',
        ignoreDismissed: true,
        namespace: 'cartDrawer',
      })
    },

    /**
     * Shopify section editor select event.
     */
    shopifySectionSelect() {
      if (!this.isMobile) {
        return
      }

      this.openOverlay({
        component: 'menu-drawer',
        ignoreDismissed: true,
        namespace: 'menuDrawer',
      })
    },

    /**
     * Shopify section editor deselect event.
     */
    shopifySectionDeselect() {
      this.closeOverlay('menuDrawer')
    },

    /**
     * Handles opening the mobile nav
     */
    openMobileDrawer() {
      this.openOverlay({
        component: 'menu-drawer',
        ignoreDismissed: true,
        namespace: 'menuDrawer',
      })
    },

    /**
     * Handles opening the meganav
     * @param {Object} tier - The tier object for the meganav
     */
    handleNavOpen(tier) {
      if (tier.links.length === 0) {
        window.location.href = tier.url

        return
      }

      clearTimeout(this.navTimeout)

      this.meganav.currentMenu = tier
      this.meganav.open = true
      this.scrollLastState = this.getScrollState
      this.setScrollHeader('open')

      this.openOverlay({
        component: 'mega-nav',
        ignoreDismissed: true,
        namespace: 'megaNav',
      })
    },

    handleNavEnter() {
      clearTimeout(this.navTimeout)
    },
  },
}
</script>
