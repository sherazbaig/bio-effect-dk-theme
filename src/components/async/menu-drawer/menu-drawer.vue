<template>
  <div
    ref="menuDrawer"
    class="menu-drawer"
    :class="[
      `show-tier${currentTier}`,
      { [$class('loading')]: state === 'loading' },
    ]"
    js-overlay="scrollElement"
  >
    <div class="menu-drawer__header">
      <span
        v-if="displayAccount"
        class="menu-drawer__account"
        @click="toggleAccountModal"
      >
        <icon-account />

        <span
          class="text-button-nav menu-drawer__account-label"
          v-text="$string('general.site_header.account')"
        />
      </span>

      <div
        class="menu-drawer__close"
        @click="closeDrawer"
      >
        <icon-close />
      </div>
    </div>
    <div class="menu-drawer__navigation">
      <div
        class="menu-drawer__title"
        @click="handleLinkClick(false)"
      >
        <icon-arrow-left-small v-if="currentLink" />

        <span
          class="menu-drawer__title-label text-button"
          v-text="$string('general.menu_drawer.title')"
        />
      </div>
      <nav
        class="menu-drawer__menus"
        :style="{ height: state === 'loading' ? '100vh' : null }"
      >
        <!-- Tier 1 container -->
        <ul
          class="menu-drawer__menu menu-drawer__tier1"
          :class="{ [$class('active')]: getActiveState(false) }"
        >
          <!-- Tier 1 links -->
          <template
            v-for="(tier1) of navigation"
            :key="tier1.handle"
          >
            <li
              :ref="(args) => setItemRefs(args, { tier: 1, type: 'link' })"
              class="menu-drawer__menu-item"
            >
              <button
                v-if="tier1.links.length"
                class="
                  menu-drawer__link
                  menu-drawer__button
                  menu-drawer__tier1-link
                  text-h3
                "
                :tabindex="getActiveState(false) ? 0 : -1"
                type="button"
                @click="handleLinkClick(tier1)"
              >
                <span
                  class="visually-hidden"
                  v-text="$string('accessibility.open')"
                />

                {{ tier1.title }}
                <span class="menu-drawer__link-icon">
                  <icon-arrow-menu-link />
                </span>
              </button>

              <a
                v-else
                class="menu-drawer__link text-h3 menu-drawer__tier1-link"
                :href="tier1.url"
                :tabindex="getActiveState(false) ? 0 : -1"
                v-html="getTier1LinkText(tier1)"
              />

              <!-- Tier 2 container -->
              <ul
                v-if="tier1.links.length"
                class="menu-drawer__menu menu-drawer__tier2"
                :class="{ [$class('active')]: getActiveState(tier1) || getChildActiveState(tier1) }"
              >
                <!-- Tier 2 links -->
                <template
                  v-for="(tier2) of tier1.links"
                  :key="tier2.handle"
                >
                  <li
                    :ref="(args) => setItemRefs(args, {
                      handle: tier1.handle,
                      tier: 2,
                      type: 'link',
                    })"
                    class="menu-drawer__menu-item"
                  >
                    <div
                      v-if="tier2.links.length"
                      class="menu-drawer__tier2-heading"
                    >
                      <button
                        class="
                          menu-drawer__link
                          menu-drawer__button
                          text-h5
                        "
                        :tabindex="getActiveState(tier1) ? 0 : -1"
                        type="button"
                        @click="(event) => event.target.classList.toggle('active')"
                      >
                        <span
                          class="visually-hidden"
                          v-text="$string('accessibility.open')"
                        />
                        {{ tier2.title }}
                        <icon-plus class="icon-plus" />
                        <icon-minus class="icon-minus" />
                      </button>
                      <ul class="menu-drawer__tier3-links">
                        <li
                          v-for="link of tier2.links"
                          :key="link.handle"
                          class="menu-drawer__tier3-link"
                        >
                          <a
                            :href="link.url"
                            class="text-p"
                            v-text="link.title"
                          />
                        </li>
                      </ul>
                    </div>

                    <a
                      v-else
                      class="menu-drawer__link text-h5"
                      :href="tier2.url"
                      :tabindex="getActiveState(tier1) ? 0 : -1"
                      v-text="tier2.title"
                    />
                  </li>
                </template>
                <li
                  v-if="discover.enabled"
                  class="mt-xl mb-7xl"
                >
                  <button
                    type="button"
                    class="active menu-drawer__link menu-drawer__button"
                  >
                    <span class="menu-drawer__title-label text-button">{{ discover.title }}</span>
                  </button>
                  <ul>
                    <li
                      v-for="(link, index) of discover.mobile.mobileLinks"
                      :key="`discover-link-${index}`"
                    >
                      <a
                        :href="link.url"
                        class="text-h5 menu-drawer__button menu-drawer__discover-link"
                        v-text="link.title"
                      />
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </template>

          <!-- Account links -->
          <li
            v-if="$variable('customer.enabled') && displayAccount"
            :ref="(args) => setItemRefs(args, { tier: 1, type: 'link' })"
            class="menu-drawer__menu-item"
          >
            <a
              v-if="$variable('customer.loggedIn')"
              class="menu-drawer__link text-body-m-underline"
              :href="$variable('routes.account.url')"
              :tabindex="getActiveState(false) ? 0 : -1"
              v-text="$string('general.menu_drawer.account')"
            />

            <div
              v-else
              class="menu-drawer__link"
            >
              <a
                class="text-body-m-underline"
                :href="$variable('routes.account.login')"
                :tabindex="getActiveState(false) ? 0 : -1"
                v-text="$string('general.menu_drawer.login')"
              />

              &nbsp;/&nbsp;

              <a
                class="text-body-m-underline"
                :href="$variable('routes.account.register')"
                :tabindex="getActiveState(false) ? 0 : -1"
                v-text="$string('general.menu_drawer.register')"
              />
            </div>
          </li>

          <li
            v-if="$variable('customer.enabled') && displayAccount"
            :ref="(args) => setItemRefs(args, { tier: 1, type: 'divider' })"
            class="menu-drawer__menu-divider"
          >
            <divider-line />
          </li>

          <div
            v-if="!currentLink"
            class="menu-drawer__footer"
          >
            <form
              :action="$variable('routes.search')"
              method="get"
              role="search"
              class="menu-drawer__form"
            >
              <label
                class="visually-hidden"
                for="menu-drawer-search"
                v-text="$string('search.placeholder')"
              />

              <input
                id="menu-drawer-search"
                class="menu-drawer__input text-mobile-p"
                type="text"
                name="q"
                :placeholder="$string('search.placeholder')"
                required
              >

              <btn
                class="menu-drawer__submit"
                type="submit"
                show-icon
                modifiers="text center"
              >
                <template #icon>
                  <link-arrow />
                </template>
              </btn>
            </form>
          </div>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Menu drawer
 * -----------------------------------------------------------------------------
 * Mobile menu drawer.
 * - CSS variable --menu-drawer-links-height is updated to match height of
 *   current visible links.
 *
 * @param {String} handle - Mobile linklist handle.
 * @param {Object} overlay - Overlay API.
 * @param {Number} itemCount - Number of tier 1 items in linklist.
 * @param {Boolean} displayAccount - Whether to display the Account links
 *
 */
import { mapActions, mapGetters, mapState } from 'vuex'

import DividerLine from '~async/utils/divider-line/divider-line'
import LinkArrow from '~icons/directional-navigation/link-arrow.svg'
import Btn from '~global/btn/btn'

import IconArrowLeftSmall from '~icons/general/arrow-left-small.svg'
import IconArrowMenuLink from '~icons/general/arrow-menu-link.svg'
import IconAccount from '~icons/general/account.svg'
import IconClose from '~icons/general/close.svg'
import IconMinus from '~icons/general/minus.svg'
import IconPlus from '~icons/general/plus.svg'

import menuQuery from '~graphql/menu.gql'
import { formatMenu } from '~/helpers/format'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'

export default {
  name: 'MenuDrawer',

  components: {
    DividerLine,
    LinkArrow,
    Btn,
    IconArrowMenuLink,
    IconArrowLeftSmall,
    IconAccount,
    IconClose,
    IconPlus,
    IconMinus,
  },

  props: {
    handle: {
      type: String,
      default: 'main-menu',
    },
    itemCount: {
      type: Number,
      default: 5,
    },
    displayAccount: {
      type: Boolean,
      default: false,
    },
    overlay: {
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
      currentLink: false,
      currentHeight: false,
      itemRefs: [],
      navigation: [...Array(this.itemCount)].map((_, index) => {
        return {
          handle: `placeholder-${index}`,
          links: [],
          title: '',
          url: cnvs.routes.root,
        }
      }),
      state: 'loading',
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getFirstElement: 'accessibility/getFirstElement',
      getActiveOverlay: 'overlays/getActiveOverlay',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Compute back to top string (max-length issue).
     * @returns {String}
     */
    backToTopString() {
      return `${this.$string('general.menu_drawer.back_to')} ${this.$string('general.menu_drawer.top_level')}`
    },

    /**
     * Compute current item refs in current link.
     * @returns {Array}
     */
    currentItemRefs() {
      if (this.currentLink) {
        return this.itemRefs.filter((itemRef) => {
          return itemRef.handle === this.currentLink.handle
        })
      }

      return this.itemRefs.filter((itemRef) => itemRef.tier === 1)
    },

    /**
     * Compute current tier to show.
     * @returns {Number}
     */
    currentTier() {
      if (!this.currentLink) {
        return 1
      }

      return this.currentLink.tier + 1
    },

    /**
     * Compute storage key.
     * @returns {String}
     */
    storageKey() {
      const key = `menu-drawer-${cnvs.store.language}-${cnvs.store.country}`
      return key.toLowerCase()
    },
  },

  watch: {

    /**
     * Watch current link to update focus.
     */
    currentLink() {
      this.updateHeight()
      this.$refs.menuDrawer.scroll(0, 0)
    },

    /**
     * Watch active overlay to reset current link.
     */
    getActiveOverlay() {
      this.currentLink = false
    },

    /**
     * Watch isMobile to close on change.
     */
    isMobile() {
      if (this.isMobile) {
        return
      }

      this.closeOverlay('menuDrawer')
    },
  },

  async mounted() {
    if (!this.handle) {
      return
    }

    const start = performance.now()

    if (sessionStorage.getItem(this.storageKey)) {
      this.navigation = JSON.parse(sessionStorage.getItem(this.storageKey))
      this.state = 'ready'
    } else {
      await this.queryMenu()
    }

    await this.handleQueryFinish(start)
  },

  beforeUpdate() {
    this.itemRefs = []
  },

  beforeUnmount() {
    clearAllBodyScrollLocks()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
    }),

    /**
     * Get tier 1 link text or loading placeholder based on state.
     * @param {Object} tier - Tier 1 object.
     * @returns {String}
     */
    getTier1LinkText(tier) {
      if (this.state === 'loading') {
        return `<span class="menu-drawer__loading"></span>`
      }

      return tier.title
    },

    /**
     * Get active state for nested menu.
     * @param {Object} link - Link.
     * @returns {Boolean}
     */
    getActiveState(link) {
      return link.handle === this.currentLink.handle
    },

    /**
     * Get active state of current nested menu's child menu.
     * @param {Object} link - Link.
     * @returns {Boolean}
     */
    getChildActiveState(link) {
      const tier3LinkActive = link.links.find((tier3Link) => {
        return tier3Link.handle === this.currentLink.handle
      })

      return Boolean(tier3LinkActive)
    },

    /**
     * Set item refs.
     * @param {HTMLElement} element - Item in v-for.
     * @param {String} data.handle - Handle of item.
     * @param {Number} data.tier - Tier of item.
     * @param {String} data.type - Type of item, `link` or `back`.
     */
    setItemRefs(element, data) {
      if (!element) {
        return
      }

      this.itemRefs.push({
        ...data,
        element,
      })
    },

    /**
     * Loads menu from GraphQL.
     * @returns {Promise}
     */
    queryMenu() {
      return new Promise(async(resolve, reject) => {
        try {
          const response = await cnvs.Query({
            query: menuQuery,
            variables: {
              country: cnvs.store.country,
              handle: this.handle,
              language: cnvs.store.language,
            },
          })

          if (cnvs.settings.disableComponentReadyState) {
            resolve()
            return
          }

          this.navigation = formatMenu({ response })
          sessionStorage.setItem(this.storageKey, JSON.stringify(this.navigation))
          this.state = 'ready'
          resolve()

        } catch (error) {
          cnvs.ReportError('Failed to load menu', error)
          reject(error)
        }
      })
    },

    /**
     * Handles functions to run after the query has finished and menu updated.
     * @param {Number} start - Start time.
     */
    async handleQueryFinish(start) {
      this.removeStaticMenu()
      this.overlay.update()
      const end = performance.now()

      /**
       * Drawer animation must finish before calculating heights.
       * - Wait minimum amount of time based on how long querying the menu took.
       */
      const waitTime = Math.abs(this.$timing('normal') - (end - start))

      await new Promise((resolve) => {
        setTimeout(resolve, waitTime)
      })

      this.updateHeight()
      disableBodyScroll(document.body)
    },

    /**
     * Removes static menu drawer rendered by menu-drawer.snippet.liquid.
     * - Otherwise there would be duplicate menus.
     */
    removeStaticMenu() {
      const container = document.querySelector('[js-menu-drawer="container"]')

      if (!container) {
        return
      }

      container.remove()
    },

    /**
     * Update height of current active navigation.
     * - Goes through each item in currentItemRefs and get height of element.
     */
    async updateHeight() {
      await this.$nextTick()
      let height = 0

      this.currentItemRefs.forEach((ref) => {
        if (!ref?.element?.offsetHeight) {
          return
        }

        height += ref.element.offsetHeight
      })

      /**
       * If height is 0 then re-run function as it's a bug.
       */
      if (height === 0 && this.currentItemRefs.length) {
        setTimeout(() => {
          this.updateHeight()
        }, 100)

        return
      }

      /**
       * Set CSS variable.
       */
      document.documentElement.style.setProperty(
        '--menu-drawer-links-height',
        `${height}px`,
      )

      /**
       * Update Vue data for easier debugging.
       */
      this.currentHeight = height
    },

    /**
     * Handle link click.
     * @param {Object|Boolean} link - Clicked link object, or false.
     */
    handleLinkClick(link) {
      this.currentLink = link
    },

    /**
     * Handles closing the drawer on clicking the close icon
     */
    closeDrawer() {
      this.closeOverlay('menuDrawer')
    },

    /**
     * Toggle account modal.
     */
    toggleAccountModal() {
      this.openOverlay({
        component: 'account-forms',
        clearQueue: false,
        ignoreDismissed: true,
        namespace: 'accountForms',
      })
    },
  },
}
</script>

<style lang="scss">
@import './menu-drawer';
</style>
