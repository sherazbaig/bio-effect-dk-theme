<template>
  <transition
    name="height"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>

/**
 * Vue: Transition height (transition-height)
 * -----------------------------------------------------------------------------
 * Transitions an element's height from `0` to `auto`.
 *
 */
export default {
  name: 'TransitionHeight',

  props: {
    paddingBottom: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      global: true,
    }
  },

  methods: {

    /**
     * Reset the element's height after transitioning in.
     * @param {HTMLElement} element - the element being transitioned.
     */
    afterEnter(element) {
      element.style.height = 'auto'
    },

    /**
     * Calculate and set the element's computed height.
     * @param {HTMLElement} element - the element being transitioned.
     */
    enter(element) {

      /**
       * Calculate what the element's height would be, if the property was
       * set to `auto`.
       */
      const currentWidth = getComputedStyle(element).width

      element.style.height = 'auto'
      element.style.position = 'absolute'
      element.style.visibility = 'hidden'
      element.style.width = currentWidth
      element.style.paddingBlockEnd = `${this.paddingBottom}px`

      const targetHeight = getComputedStyle(element).height

      element.style.height = 0
      element.style.position = null
      element.style.visibility = null
      element.style.width = null

      /**
       * Force a repaint, to ensure the animation is triggered correctly.
       */
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height

      /**
       * Trigger a transition to the element's target height.
       * - Using `requestAnimationFrame` ensures that the transition will wait
       *   until the starting height is zero, as set above.
       */
      requestAnimationFrame(() => {
        element.style.height = targetHeight
      })
    },

    /**
     * Set height to zero when transitioning out.
     * @param {HTMLElement} element - the element being transitioned.
     */
    leave(element) {

      /**
       * Hardcode the element's height property using the current height.
       */
      const currentHeight = getComputedStyle(element).height
      element.style.height = currentHeight

      /**
       * Force a repaint, to ensure the animation is triggered correctly.
       */
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height

      /**
       * Trigger a transition to zero height.
       * - Using `requestAnimationFrame` ensures that the transition will wait
       *   until the starting height is fixed, and not `auto`.
       */
      requestAnimationFrame(() => {
        element.style.height = 0
        element.style.paddingBlockEnd = 0
      })
    },
  },
}
</script>
