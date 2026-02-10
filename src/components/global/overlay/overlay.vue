<template>
  <transition
    v-if="!noContent"
    :name="transitionName"
  >
    <div
      v-show="isActive"
      v-cloak
      ref="overlay"
      class="overlay critical-hide"
      :class="[
        classContainer,
        $blockClass(blockClass),
        responsiveType,
        `${responsiveType}--${responsiveDirection}`,
      ]"
    >
      <div
        v-if="template"
        ref="scrollElement"
        class="overlay__container"
        :class="[
          $blockClass(blockClass, 'container'),
          $blockClass(responsiveType, 'container'),
        ]"
      >
        <div
          v-if="$slots.title || showClose"
          class="overlay__header"
          :class="[
            {
              'overlay__header--no-title': !$slots.title,
              [$blockClass(blockClass, 'header', 'no-title')]: !$slots.title,
              [$blockClass(responsiveType, 'header', 'no-title')]: !$slots.title,
            },
            $blockClass(blockClass, 'header'),
            $blockClass(responsiveType, 'header'),
          ]"
        >
          <p
            v-if="$slots.title"
            class="overlay__title text-heading-xl text-heading-2xl-desktop"
            :class="[
              $blockClass(blockClass, 'title'),
              $blockClass(responsiveType, 'title'),
            ]"
          >
            <slot name="title" />
          </p>

          <div
            v-if="showClose"
            class="overlay__close-container"
            :class="[
              $blockClass(blockClass, 'close-container'),
              $blockClass(responsiveType, 'close-container'),
            ]"
          >
            <button
              class="overlay__close icon-button"
              :class="[
                $blockClass(blockClass, 'close'),
                $blockClass(responsiveType, 'close'),
              ]"
              type="button"
              @click.prevent="close('button')"
            >
              <span
                class="visually-hidden"
                v-text="$string('accessibility.close')"
              />

              <slot name="close">
                <icon-close />
              </slot>
            </button>
          </div>
        </div>

        <div
          class="overlay__body"
          :class="[
            $blockClass(blockClass, 'body'),
            $blockClass(responsiveType, 'body'),
            { 'overlay__body--no-margin': !$slots.title },
          ]"
        >
          <slot
            v-bind="self"
            name="body"
          />
        </div>
      </div>

      <!-- If template prop is false then just render body slot -->
      <div
        v-else
        ref="scrollElement"
        class="overlay__container"
        :class="[
          $blockClass(blockClass, 'container'),
          $blockClass(responsiveType, 'container'),
        ]"
      >
        <slot
          v-bind="self"
          name="body"
        />
      </div>
    </div>
  </transition>

  <teleport
    :disabled="!teleport"
    to="body"
  >
    <transition name="fade">
      <button
        v-if="isActive && showOverlay"
        class="window-overlay"
        :class="namespace"
        tabindex="-1"
        type="button"
        aria-hidden="true"
        @click.prevent="close('overlay')"
      />
    </transition>
  </teleport>
</template>

<script>

/**
 * Vue: Overlay (overlay)
 * -----------------------------------------------------------------------------
 * Base template for overlays (drawers and modals).
 * - Add `js-overlay="scrollElement"` to element in <slot> to pass that as the
 *   element to disableBodyScroll instead of `.overlay__container`.
 *
 * @param {Boolean} [autoQueue] - Automatically opened overlays are queued.
 * @param {Number} [autoShow] - Time in ms to wait before auto-showing overlay.
 * @param {String} [blockClass] - Block level class to apply to all elements.
 * @param {String} [classContainer] - Class applied to container.
 * @param {String} direction - Open animation direction set using transition
 * styles, `up` or `down` for `modal` and `left` or `right` for `drawer`,
 * supports a combination in the format [mobile direction]-[desktop direction].
 * @param {Boolean} [disableScroll] - Trigger `disableBodyScroll` on open.
 * @param {String} namespace - Unique namespace for overlay, reference when
 * opening/closing the overlay.
 * @param {Boolean} [noContent] - Displays no content, only window overlay, you
 * must manually disable scroll and trap focus in the component which triggers
 * this overlay.
 * @param {Boolean} [showClose] - Show the close button, useful for when you
 * want to bind custom events to when the overlay closes.
 * @param {Boolean} [showOverlay] - Show the window overlay?
 * @param {Boolean} [teleport] - Teleport window overlay to end of <body>.
 * @param {Boolean} [template] - Render with default templating.
 * @param {String} type - Type of overlay, `modal`, `drawer`, or `shelf`,
 * supports a combination in the format [mobile type]-[desktop type].
 *
 * @emits close - Emits overlay close.
 * @emits open - Emits overlay open.
 *
 */
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { mapActions, mapGetters, mapState } from 'vuex'

import IconClose from '~icons/directional-navigation/close.svg'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Overlay',

  components: {
    IconClose,
  },

  props: {
    autoQueue: {
      type: Boolean,
      default: true,
    },
    autoShow: {
      type: Number,
      default: 0,
    },
    blockClass: {
      type: String,
      default: '',
    },
    classContainer: {
      type: String,
      default: '',
    },
    concurrentChildren: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'up',
      required: true,
      validator: (value) => {
        return value.split('-').every((part) => ['up', 'down', 'left', 'right', 'fade'].includes(part))
      },
    },
    disableScroll: {
      type: Boolean,
      default: true,
    },
    namespace: {
      type: String,
      default: '',
      required: true,
    },
    noContent: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    showOverlay: {
      type: Boolean,
      default: true,
    },
    teleport: {
      type: Boolean,
      default: true,
    },
    template: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'modal',
      required: true,
      validator: (value) => {
        return value.split('-').every((part) => ['drawer', 'modal', 'shelf'].includes(part))
      },
    },
  },

  data() {
    return {
      callback: {
        button: false,
        overlay: false,
      },
      cnvsGlobal: true,
      scrollElement: false,
    }
  },

  computed: {

    /**
     * Map Vuex getters.
     */
    ...mapGetters({
      getActiveOverlay: 'overlays/getActiveOverlay',
      getFirstElement: 'accessibility/getFirstElement',
      getActiveOverlays: 'overlays/getActive',
    }),

    /**
     * Map Vuex state.
     */
    ...mapState({
      hydrated: (state) => state.index.hydrated,
      isMobile: (state) => state.index.screen.mobile,
      previousElement: (state) => state.accessibility.previousElement,
    }),

    /**
     * Compute overlay active state.
     * @returns {Boolean}
     */
    isActive() {
      if (!this.concurrentChildren) {
        return this.getActiveOverlay === this.namespace
      }

      return this.getActiveOverlays.includes(this.namespace)
    },

    /**
     * Compute responsive direction based on mobile.
     * @retursn {String}
     */
    responsiveDirection() {
      if (!this.direction.includes('-')) {
        return this.direction
      }

      return this.isMobile
        ? this.direction.split('-')[0]
        : this.direction.split('-')[1]
    },

    /**
     * Compute responsive type based on mobile.
     * @returns {String}
     */
    responsiveType() {
      if (!this.type.includes('-')) {
        return this.type
      }

      return this.isMobile ? this.type.split('-')[0] : this.type.split('-')[1]
    },

    /**
     * Compute overlay API.
     * @returns {Object}
     */
    self() {
      return {
        ...this.$data,
        ...this.$props,
        isActive: this.isActive,
        addCallback: this.addCallback,
        close: (namespace) => this.closeOverlay(namespace || this.namespace),
        open: (args) => this.openOverlay({ namespace: 'cartDrawer', ...args }),
        update: this.update,
      }
    },

    /**
     * Compute transition name based on type.
     * @returns {String}
     */
    transitionName() {
      const type = this.responsiveType === 'modal' ? 'fade' : 'slide'
      return `${type}-${this.responsiveDirection}`
    },
  },

  watch: {

    /**
     * Watch hydrated state to start auto-show countdown.
     */
    hydrated() {
      this.setAutoShow()
    },

    /**
     * Watch active state.
     * - Separate logic for event binding.
     */
    async isActive() {
      if (this.noContent) {
        return
      }

      /**
       * If active then:
       * - Set previous element (to focus on close).
       * - Disable body scroll (if applicable).
       * - Reset scroll element scroll position.
       * - Trap focus inside overlay element.
       * - Focus first trap focus element.
       */
      if (this.isActive) {
        this.setPreviousElement(document.activeElement)

        if (this.disableScroll) {
          this.getScrollElement()
          disableBodyScroll(this.scrollElement, this.bodyScrollOptions())
        }

        await this.$nextTick()

        if (this.scrollElement) {
          this.scrollElement.scrollTo(0, 0)
        }

        this.updateFocusTrap()
        return
      }

      if (this.disableScroll) {
        if (this.scrollElement) {
          enableBodyScroll(this.scrollElement)
        } else {
          clearAllBodyScrollLocks()
        }
      }

      /**
       * If no other active overlay when closing then clear focus trap.
       */
      if (!this.getActiveOverlay) {
        this.clearFocusTrap()
      }

      /**
       * Set focus back to previous element if set.
       * - Also reset previous element state to false.
       */
      if (!this.previousElement || typeof this.previousElement !== 'object') {
        return
      }

      cnvs.Focus(this.previousElement)
      this.setPreviousElement()
    },
  },

  mounted() {
    this.setEventBusListeners()
    this.setAutoShow()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      clearFocusTrap: 'accessibility/clearFocusTrap',
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
      queueOverlay: 'overlays/queue',
      setFocusTrap: 'accessibility/setFocusTrap',
      setPreviousElement: 'accessibility/setPreviousElement',
    }),

    /**
     * Get scroll element.
     */
    getScrollElement() {
      if (!this.$refs.scrollElement) {
        this.scrollElement = false
        return
      }

      this.scrollElement =
        this.$refs.scrollElement.querySelector('[js-overlay="scrollElement"]') ||
        this.$refs.scrollElement
    },

    /**
     * Set modal to autoshow.
     */
    async setAutoShow() {
      if (!this.autoShow || !this.hydrated) {
        return
      }

      await cnvs.Sleep(this.autoShow)

      if (this.autoQueue) {
        this.queueOverlay({ namespace: this.namespace })
        return
      }

      this.openOverlay({ namespace: this.namespace })
    },

    /**
     * Set EventBus listeners.
     */
    setEventBusListeners() {
      cnvs.EventBus.listen('cnvs:esc', () => {
        this.close('esc')
      })

      cnvs.EventBus.listen('overlay:update', (namespace) => {
        if (!this.isActive || namespace !== this.namespace) {
          return
        }

        this.update()
      })
    },

    /**
     * Update body scroll element and focus trap.
     */
    async update() {
      await this.$nextTick()
      this.updateFocusTrap()
      this.updateBodyScroll()
    },

    /**
     * Update focus trap using Vuex.
     */
    updateFocusTrap() {
      this.setFocusTrap({ container: this.$refs.overlay })

      /**
       * Have to use timeout to wait for animation to complete.
       * - Safari doesn't support `preventScroll`.
       */
      setTimeout(() => {
        if (!this.getFirstElement) {
          return
        }

        this.getFirstElement.focus({ preventScroll: true })
      }, this.$timing('normal'))
    },

    /**
     * Update body scroll element.
     */
    updateBodyScroll() {
      if (this.scrollElement) {
        enableBodyScroll(this.scrollElement)
      } else {
        clearAllBodyScrollLocks()
      }

      this.getScrollElement()

      if (cnvs.storybook && !this.scrollElement) {
        return
      }

      disableBodyScroll(this.scrollElement)
    },

    /**
     * Define body scroll options.
     * - Adds support for [js-body-scroll-lock-ignore] attribute which allows
     *   element to maintain scrolling when disableBodyScroll is enabled.
     * @returns {Object}
     */
    bodyScrollOptions() {
      return {
        // eslint-disable-next-line consistent-return
        allowTouchMove: (element) => {
          const ignoredElement = element.closest('[js-body-scroll-lock-ignore]')
          return ignoredElement
        },
      }
    },

    /**
     * Add callback function to run after close.
     * @param {Function} callback - Function to use as callback on close.
     * @param {String} [type] - Optional, either `button` or `overlay` to define
     * when callback should be run.
     */
    addCallback(callback, type) {
      if (!type) {
        this.callback.button = callback
        this.callback.overlay = callback
        return
      }

      this.callback[type] = callback
    },

    /**
     * Handle overlay close.
     * @param {String} type - Type of close, `button`, `esc` or `overlay`.
     */
    close(type) {
      this.closeOverlay(this.namespace)

      if (typeof this.callback[type] !== 'function') {
        return
      }

      this.callback[type]()
    },
  },
}
</script>
