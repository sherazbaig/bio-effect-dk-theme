<template>
  <div class="index" />
</template>

<script>

/**
 * Vue: Index (core)
 * -----------------------------------------------------------------------------
 * Used to set index states and global event listeners.
 *
 */
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import breakpoints from '~/config/breakpoints'
import { debounce, isCdnUrl, throttle } from '~/helpers/general'

import config from '~/../../canvas.config'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',

  data() {
    return {
      cnvsGlobal: true,
      screen: {
        breakpoint: 'xs',
        mobile: true,
        height: 0,
        width: 0,
      },
      scroll: {
        direction: 'none',
        header: 'open',
        top: true,
        x: 0,
        y: 0,
      },
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getActiveOverlay: 'overlays/getActiveOverlay',
      getComponentExists: 'components/getExists',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      activeOverlays: (state) => state.overlays.active,
      originalItemProperties: (state) => state.upsell.originalItemProperties,
      settings: (state) => state.index.settings,
    }),
  },

  watch: {
    async getActiveOverlay(newValue, oldValue) {
      if (oldValue === 'upsellPopup' && !newValue) {
        if (this.originalItemProperties) {
          try {
            await this.addItem(this.originalItemProperties)
            this.resetUpsellState()
          } catch (error) {
            cnvs.ReportError('Failed to add item from upsell popup', error)
          }
        }
      }
    },
  },

  mounted() {
    this.rehydrateSite()
    this.setMobileBreakpoints(config.mobileBreakpoints)
    this.getPreviousUrl()

    this.handleResize()
    this.handleScroll(true)

    this.setEventListeners()
    this.setEventBusListeners()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
      rehydrateSite: 'rehydrateSite',
      setCartResponse: 'cart/setResponse',
      setMobileBreakpoints: 'setMobileBreakpoints',
      setPreviousUrl: 'setPreviousUrl',
      setScreen: 'setScreen',
      setScroll: 'setScroll',
      setStylesheet: 'setStylesheet',
    }),

    ...mapMutations({
      resetUpsellState: 'upsell/resetState',
    }),

    /**
     * Get previous URL from sessionStorage.
     * - State doesn't update in time if set in the `beforeunload` event.
     */
    getPreviousUrl() {
      const previousUrl = sessionStorage.getItem('previousUrl')

      if (previousUrl) {
        this.setPreviousUrl(previousUrl)
      }
    },

    /**
     * Set event listeners.
     */
    setEventListeners() {
      this.setStylesheetListeners()

      /**
       * Add default listeners.
       */
      window.visualViewport.addEventListener(
        'resize',
        debounce(() => this.handleResize(), this.settings.throttle),
        { passive: true },
      )

      window.addEventListener(
        'scroll',
        throttle(() => this.handleScroll(), this.settings.throttle),
        { passive: true },
      )

      /**
       * Set previous URL just before changing page.
       */
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('previousUrl', location.pathname)
      })
    },

    /**
     * Set EventBus listeners.
     */
    setEventBusListeners() {

      /**
       * Overlay listeners act as fallbacks for non-Vue components.
       */
      cnvs.EventBus.listen('overlay:open', (overlay) => {
        this.openOverlay(overlay)
      })

      cnvs.EventBus.listen('overlay:close', (overlay) => {
        this.closeOverlay(overlay)
      })

      /**
       * Cart update fallback listener.
       */
      cnvs.EventBus.listen('cart:update', async() => {
        await this.setCartResponse()

        if (!this.getComponentExists('cart-drawer')) {
          return
        }

        this.openOverlay({
          component: 'cart-drawer',
          ignoreDismissed: true,
          namespace: 'cartDrawer',
        })
      })
    },

    /**
     * Listen for stylesheets loading to trigger events after they've loaded.
     */
    setStylesheetListeners() {
      const stylesheets = [...document.querySelectorAll('[rel="stylesheet"]')]

      stylesheets.forEach((element) => {
        const media = element.getAttribute('media')
        let stylesheet = element.getAttribute('href')

        if (isCdnUrl(stylesheet)) {
          stylesheet = stylesheet
            .split('/')
            .reverse()[0]
            .split('?')[0]
        }

        if (!stylesheet) {
          return
        }

        /**
         * If it's already loaded then add to state.
         */
        if (media === 'all') {
          this.setStylesheet(stylesheet)
          return
        }

        /**
         * Otherwise listen for load.
         */
        element.addEventListener('load', () => {
          element.setAttribute('media', 'all')
          this.setStylesheet(stylesheet)
        })
      })
    },

    /**
     * Handle resize.
     */
    handleResize() {
      this.screen = {
        height: window.visualViewport.height,
        width: window.innerWidth,
      }

      /**
       * Set CSS variable.
       */
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${this.screen.height}px`,
      )

      for (const [breakpoint, value] of Object.entries(breakpoints)) {
        if (!window.matchMedia(`(min-width: ${value})`).matches) {
          break
        }

        this.screen.breakpoint = breakpoint
      }

      this.screen.mobile = this.settings.mobileBreakpoints.includes(this.screen.breakpoint)

      cnvs.EventBus.emit('cnvs:resize', this.screen)
      this.setScreen(this.screen)
    },

    /**
     * Handle scroll.
     * - Don't update state when overlay opens.
     * @param {Boolean} [start] - If setting on initial load.
     */
    handleScroll(start = false) {
      if (this.activeOverlays.length) {
        return
      }

      /**
       * Set object on start.
       */
      if (start) {
        this.scroll = {
          direction: 'none',
          header: 'open',
          top: window.scrollY <= this.settings.start,
          x: window.scrollX,
          y: window.scrollY,
        }

        return
      }

      /**
       * If scroll difference is less than threshold don't update.
       */
      const difference = window.scrollY - this.scroll.y

      if (Math.abs(difference) < this.settings.threshold) {
        return
      }

      this.scroll = {
        direction: difference > 0 ? 'down' : 'up',
        top: window.scrollY <= this.settings.start,
        x: window.scrollX,
        y: window.scrollY,
      }

      if (this.scroll.direction === 'up' && !this.scroll.top) {
        this.scroll.header = 'minimised'
      } else if (window.scrollY > this.settings.start) {
        this.scroll.header = 'collapsed'
      } else {
        this.scroll.header = 'open'
      }

      cnvs.EventBus.emit('cnvs:scroll', this.scroll)
      this.setScroll(this.scroll)
    },
  },
}
</script>
