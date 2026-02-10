<template>
  <section
    ref="siteHeader"
    class="site-header-group"
    :class="$class(headerState)"
    aria-labelledby="site-header-title"
  >
    <slot />
  </section>
</template>

<script>

/**
 * Vue: Site header group (site-header-group)
 * -----------------------------------------------------------------------------
 * Site header section group component.
 * - Used to set header height and control state.
 * - See site header for main visible component.
 *
 */
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SiteHeaderGroup',

  data() {
    return {
      height: {
        total: null,
        collapsed: null,
        minimised: null,
        open: null,
        visible: null,
      },
      sections: [],
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      headerState: (state) => state.index.scroll.header,
      isMobile: (state) => state.index.screen.mobile,
      loadedStylesheets: (state) => state.index.stylesheets,
    }),
  },

  watch: {

    /**
     * Watch header state to update height variables.
     * - Wait for site header transition to end before updating height.
     * - Set height immediately if prefers reduced motion.
     */
    headerState() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.setHeights()
        return
      }

      this.$refs.siteHeader.ontransitionend = (args) => {
        if (!args || !['transform', 'translate'].includes(args.propertyName)) {
          return
        }

        this.setHeights()
      }
    },

    /**
     * Watch collapsed height to update CSS variable.
     */
    'height.collapsed'() {
      document.documentElement.style.setProperty(
        '--header-collapsed-translate',
        `-${this.height.total - this.height.collapsed}px`,
      )
    },

    /**
     * Watch minimised height to update CSS variable.
     */
    'height.minimised'() {
      document.documentElement.style.setProperty(
        '--header-minimised-translate',
        `-${this.height.total - this.height.minimised}px`,
      )
    },

    /**
     * Watch total height to update CSS variables.
     */
    'height.total'() {
      document.documentElement.style.setProperty(
        '--header-height',
        `${this.height.total}px`,
      )
    },

    /**
     * Watch visible height to update CSS variable.
     */
    'height.visible'() {
      document.documentElement.style.setProperty(
        '--header-visible-height',
        `${this.height.visible}px`,
      )
    },

    /**
     * Watch isMobile to re-calculate header heights.
     */
    async isMobile() {
      await this.$nextTick()
      this.setHeights(true)
    },

    /**
     * Watch loaded stylesheets to set height.
     */
    async loadedStylesheets() {
      if (!this.loadedStylesheets.includes('layout.theme.css')) {
        return
      }

      /**
       * Wait for CSS to be parsed.
       */
      await cnvs.Sleep(200)
      this.setHeights()
    },
  },

  async mounted() {
    await this.$nextTick()
    this.setHeights(true)
    this.setEventListeners()

    const header = document.querySelector('.site-header-group')
    const { height } = header.getBoundingClientRect()

    document.documentElement.style.setProperty(
      '--header-bottom',
      `${height}px`,
    )
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      setScrollStart: 'setScrollStart',
    }),

    /**
     * Set heights of fixed header.
     * - Height.total is used for body offset.
     * - Height.visible is used for overlays etc.
     * - State heights are used for translate offset.
     * - Remove setHeights if header is not fixed.
     * @param {Boolean} mounted - If height is being set on mounted.
     */
    setHeights(mounted) {
      if (mounted) {
        this.getHeaderSections()
        this.height.total = this.getHeaderStateHeight('open')
        this.height.open = this.height.total
        this.height.collapsed = this.getHeaderStateHeight('collapsed')
        this.height.minimised = this.getHeaderStateHeight('minimised')
        document.documentElement.style.setProperty(
          '--header-collapsed-translate',
          `-${this.height.total - this.height.collapsed}px`,
        )
        document.documentElement.style.setProperty(
          '--header-minimised-translate',
          `-${this.height.total - this.height.minimised}px`,
        )
      }

      /**
       * Visible height based on current state.
       */
      this.height.visible = this.height[this.headerState]

      /**
       * Update scroll start height.
       * - This is the point at which the site header will collapse.
       */
      this.setScrollStart(this.height.visible)
    },

    /**
     * Get header sections and states.
     * - .shopify-section-group-site-header class is added by Shopify.
     * - Select first <section> element inside it.
     * - Determine states from data-site-header-states attribute.
     */
    getHeaderSections() {
      const sections = [...document.querySelectorAll('#vue-element .shopify-section-group-site-header-group > section')]

      this.sections = sections.map((element) => {
        return {
          element,
          states: {
            collapsed: element.dataset.siteHeaderStates.includes('collapsed'),
            minimised: element.dataset.siteHeaderStates.includes('minimised'),
            open: element.dataset.siteHeaderStates.includes('open'),
          },
        }
      })
    },

    /**
     * Get header state height.
     * @param {String} state - State to get height for.
     * @returns {Number}
     */
    getHeaderStateHeight(state) {
      let height = 0

      this.sections.forEach((section) => {
        if (!section.states?.[state]) {
          return
        }

        height += section.element.offsetHeight
      })

      return height
    },

    /**
     * Set event listeners.
     * - Listens for site header async component event to update heights.
     */
    setEventListeners() {
      cnvs.EventBus.listen('cnvs:update-site-header-height', () => {
        this.setHeights(true)
      })
    },
  },
}
</script>
