<template>
  <section
    v-if="!$variable('storybook')"
    class="accessibility critical-hide"
    aria-labelledby="sign-posts-title"
  >
    <span
      id="sign-posts-title"
      class="visually-hidden"
      v-text="$string('accessibility.sign_posts.information')"
    />

    <btn
      v-for="(signPost) of signPosts.head"
      :ref="(element) => setItemRefs(element, 'head')"
      :key="`sign-post-${signPost.id}`"
      class="accessibility__sign-post accessibility__sign-post--head"
      :label="signPost.label"
      modifiers="fill"
      :url="signPost.id"
      @blur="shortcutActive = false"
    />

    <btn
      class="accessibility__sign-post accessibility__information"
      :class="{ [$class('active')]: informationOpen }"
      :label="informationText"
      modifiers="fill"
      :aria-expanded="informationOpen"
      @blur="informationOpen = false"
      @click="informationOpen = !informationOpen"
    />

    <teleport
      v-if="signPosts.main.length"
      to="#main-content-sign-posts"
    >
      <btn
        v-for="(signPost) of signPosts.main"
        :ref="(element) => setItemRefs(element, 'main')"
        :key="`sign-post-${signPost.id}`"
        class="accessibility__sign-post accessibility__sign-post--main"
        :label="signPost.label"
        modifiers="fill"
        :url="signPost.id"
        @blur="shortcutActive = false"
      />
    </teleport>
  </section>
</template>

<script>

/**
 * Vue: Accessibility (core)
 * -----------------------------------------------------------------------------
 * Used to set accessibility states and tab event listeners.
 *
 */
import { mapActions, mapGetters, mapState } from 'vuex'

import Btn from '~global/btn/btn'

import { convertHandleToSentenceCase } from '~/helpers/convert'
import { scrollToElement, throttle } from '~/helpers/general'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Accessibility',

  components: {
    Btn,
  },

  data() {
    return {
      cnvsGlobal: true,
      informationOpen: false,
      itemRefs: {
        head: [],
        main: [],
      },
      scrollFocus: {
        element: false,
        focus: true,
        scrolling: false,
        timeout: {},
      },
      shortcutActive: false,
      signPosts: {
        head: [],
        main: [],
      },
      tabbable: false,
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getFirstElement: 'accessibility/getFirstElement',
      getFocusTrapActive: 'accessibility/getFocusTrapActive',
      getLastElement: 'accessibility/getLastElement',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      components: (state) => state.components,
      focusTrap: (state) => state.accessibility.focusTrap,
      headerState: (state) => state.index.scroll.header,
      previousElement: (state) => state.accessibility.previousElement,
      settings: (state) => state.index.settings,
    }),

    /**
     * Compute information text based on open state.
     * @returns {String}
     */
    informationText() {
      return this.informationOpen
        ? this.$string('accessibility.sign_posts.information')
        : this.$string('accessibility.sign_posts.button')
    },
  },

  watch: {

    /**
     * Watch components state to update sign posts.
     */
    components() {
      this.getSignPosts()
    },

    /**
     * Watch scrollFocus element and wait to see if scroll starts after element
     * has been updated, if it doesn't then focus element.
     */
    'scrollFocus.element'() {
      if (!this.scrollFocus.element) {
        return
      }

      setTimeout(() => {
        if (this.scrollFocus.scrolling) {
          return
        }

        this.handleScroll(true)
      }, this.settings.throttle + 100)
    },

    /**
     * Watch tabblable state to add/remove class to body.
     */
    tabbable() {
      if (!this.tabbable) {
        return
      }

      document.body.classList.add(this.$class('tabbable'))
    },
  },

  mounted() {
    this.setEventListeners()
    this.getSignPosts()
    this.focusHash()
  },

  beforeUpdate() {
    this.itemRefs = {
      head: [],
      main: [],
    }
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      setPreviousElement: 'accessibility/setPreviousElement',
    }),

    /**
     * Set event listeners.
     */
    setEventListeners() {
      window.addEventListener('click', this.handleClick)
      window.addEventListener('keydown', this.handleKeyPress)

      window.addEventListener(
        'scroll',
        throttle(() => this.handleScroll(), this.settings.throttle),
        { passive: true },
      )
    },

    /**
     * Set sign post item refs.
     * @param {HTMLElement} element - Sign post in v-for.
     * @param {String} location - Location of sign post.
     */
    setItemRefs(element, location) {
      if (!element) {
        return
      }

      this.itemRefs[location].push(element)
    },

    /**
     * Handle click.
     * @param {Object} event - Click event.
     */
    handleClick(event) {
      const target = event.target

      if (
        !target ||
        typeof target.attributes.href === 'undefined' ||
        !target.getAttribute('href').startsWith('#')
      ) {
        return
      }

      this.runScroll({ event })
    },

    /**
     * Finds element and runs scroll.
     * @param {Object} event - Click event.
     * @param {String} hash - Hash from URL.
     */
    runScroll({ event, hash }) {
      const id = hash || event.target.getAttribute('href')

      if (id.length === 1) {
        return
      }

      const element = document.querySelector(id)
      const target = event ? event.target : false

      if (!element) {
        return
      }

      /**
       * If scroll is disabled then immediately focus target.
       */
      if (!id && target.dataset.smoothScrollAnimate === 'false') {
        this.scrollFocus.element = element
        this.handleScroll(true)
        return
      }

      /**
       * If link doesn't want to focus then update data.
       */
      this.scrollFocus.focus = id || (target.dataset?.smoothScrollFocus !== 'false')

      if (event) {
        event.preventDefault()
      }

      scrollToElement(element, {
        callback: this.setFocus(element),
        headerState: this.headerState,
      })
    },

    /**
     * Sets element to focus once scrolling stops.
     * @param {HTMLElement} element - Element to focus.
     */
    setFocus(element) {
      this.scrollFocus.element = element
    },

    /**
     * Handle keydown.
     * - Closes all overlays if esc is pressed.
     * - Emits fallback EventBus event.
     * @param {Object} event - Keydown event.
     */
    handleKeyPress(event) {
      if (event.key.toLowerCase() === 'escape' || event.keyCode === 27) {
        if (this.shortcutActive && this.previousElement) {
          cnvs.Focus(this.previousElement)
          this.setPreviousElement()
          this.shortcutActive = false
        }

        cnvs.EventBus.emit('cnvs:esc')
      }

      if (event.key.toLowerCase() === 'tab' || event.keyCode === 9) {
        this.handleTab(event)
      }

      if (!event.altKey) {
        return
      }

      /**
       * Detects Alt + K shortcut.
       * - User can then press esc to return to previously focussed element.
       */
      if (event.key.toLowerCase() === 'k' || event.keyCode === 75) {
        if (!this.itemRefs.head.length) {
          return
        }

        this.setPreviousElement(document.activeElement)
        cnvs.Focus(this.itemRefs.head[0].$el)
        this.shortcutActive = true
      }

      /**
       * Detects Alt + L shortcut.
       * - User can then press esc to return to previously focussed element.
       */
      if (event.key.toLowerCase() === 'l' || event.keyCode === 76) {
        if (!this.itemRefs.main.length) {
          return
        }

        this.setPreviousElement(document.activeElement)
        cnvs.Focus(this.itemRefs.main[0].$el)
        this.shortcutActive = true
      }
    },

    /**
     * Handle tab keydown.
     * - Used to enable tabbable state and trap focus.
     * - Emits fallback EventBus event.
     * @param {Object} event - Keydown event
     */
    handleTab(event) {
      cnvs.EventBus.emit('cnvs:tab', { shiftTab: event.shiftKey })

      if (!this.tabbable) {
        this.tabbable = true
      }

      if (!this.getFocusTrapActive) {
        return
      }

      event.preventDefault()

      const currentIndex = this.focusTrap.findIndex((element) => {
        return element === document.activeElement
      })

      /**
       * If focus is outside trap then focus first element.
       */
      if (currentIndex === -1) {
        cnvs.Focus(this.getFirstElement)
        return
      }

      /**
       * If shift + tab on first element then go to last element in trap.
       * - Otherwise if tab from last element then go to first element in trap.
       */
      if (event.shiftKey) {
        if (document.activeElement === this.getFirstElement) {
          cnvs.Focus(this.getLastElement)
          return
        }

      } else if (document.activeElement === this.getLastElement) {
        cnvs.Focus(this.getFirstElement)
        return
      }

      if (event.shiftKey) {
        cnvs.Focus(this.focusTrap[currentIndex - 1])
        return
      }

      cnvs.Focus(this.focusTrap[currentIndex + 1])
    },

    /**
     * Handle scroll.
     * - Used to detect scroll end to focus element when animating scroll.
     * - Sets timeout which is cleared whilst scrolling.
     * @param {Boolean} noScroll - If scrolling is disabled, focus immediately.
     */
    handleScroll(noScroll = false) {
      clearTimeout(this.scrollFocus.timeout)

      if (!this.scrollFocus.element || !this.scrollFocus.focus) {
        return
      }

      this.scrollFocus.scrolling = true

      if (!this.scrollFocus.element.getAttribute('tabindex')) {
        this.scrollFocus.element.setAttribute('tabindex', -1)
      }

      if (noScroll) {
        cnvs.Focus(this.scrollFocus.element)
        this.scrollFocus.element = false
        this.scrollFocus.scrolling = false
        return
      }

      this.scrollFocus.timeout = setTimeout(() => {
        cnvs.Focus(this.scrollFocus.element)
        this.scrollFocus.element = false
        this.scrollFocus.scrolling = false
      }, this.settings.throttle + 100)
    },

    /**
     * Get sign posts.
     * - Finds all elements with js-sign-post attribute.
     * - Element must also have id to scroll to.
     * - Pulls sign post button text from attribute, or from id.
     * - Use data-priority to specify order, lowest number first.
     */
    getSignPosts() {
      const elements = [...document.querySelectorAll('[js-sign-post]')]

      if (!elements.length) {
        return
      }

      const signPosts = {
        head: [],
        main: [],
      }

      elements.forEach((element) => {
        if (!element.id) {
          return
        }

        const label = element.getAttribute('js-sign-post')
          ? element.getAttribute('js-sign-post')
          : convertHandleToSentenceCase(element.id)

        const priority = element.dataset.signPostPriority
          ? Number(element.dataset.signPostPriority)
          : 100

        const location = element.dataset.signPostLocation
          ? element.dataset.signPostLocation
          : 'head'

        signPosts[location].push({
          id: `#${element.id}`,
          label: this.$string('accessibility.skip_to', { replace: { label } }),
          priority,
        })
      });

      /**
       * Sort into priority order.
       * - If same then whichever element came first has higher priority.
       */
      ['head', 'main'].forEach((location) => {
        this.signPosts[location] = signPosts[location].sort((first, second) => {
          return first.priority - second.priority
        })
      })
    },

    /**
     * Captures hash in URL and focuses on element.
     */
    focusHash() {
      if (!location.hash) {
        return
      }

      this.runScroll({ hash: location.hash })
    },
  },
}
</script>
