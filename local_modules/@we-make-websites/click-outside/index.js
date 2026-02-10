/**
 * Directives
 * -----------------------------------------------------------------------------
 * Vue plugin to extend Vue instance with global click outside directive.
 *
 */

/**
 * Expose install method.
 */
export default {
  install: (app) => {

    /**
     * Sets a `v-click-outside` directive to detect click outside events.
     * - Add `v-click-outside` to an element and pass in an event handler.
     * - e.g. `v-click-outside="hideElement"`.
     */
    app.directive('click-outside', {
      beforeMount(element, binding) {
        element.clickOutsideEvent = (event) => {
          if (element === event.target || element.contains(event.target)) {
            return
          }

          binding.value(event, element)
        }
        document.body.addEventListener('click', element.clickOutsideEvent)
      },
      unmounted(element) {
        document.body.removeEventListener('click', element.clickOutsideEvent)
      },
    })
  },
}
