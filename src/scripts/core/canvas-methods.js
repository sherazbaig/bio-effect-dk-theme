/**
 * Core: Canvas methods
 * -----------------------------------------------------------------------------
 * Methods used directly by the top-level Canvas Vue instance.
 * - These methods are only available to first level components.
 *
 */
import { convertToCamelCase } from '~/helpers/convert'
import { isVisible, setIntersectionObserver } from '~/helpers/general'

/**
 * DOM selectors.
 */
const selectors = {
  componentAnimation: '[data-component-animation]',
  componentHandle: '[data-component-handle="*"]',
}

/**
 * Export methods.
 * @param {Object} asyncComponents - Components to be asynchronously loaded.
 * @returns {Object}
 */
export default (asyncComponents) => {

  /**
   * Set global variables.
   */
  const componentStates = {}

  const events = [
    'shopify:inspector:activate',
    'shopify:inspector:deactivate',
    'shopify:section:load',
    'shopify:section:unload',
    'shopify:section:select',
    'shopify:section:deselect',
    'shopify:section:reorder',
    'shopify:block:select',
    'shopify:block:deselect',
  ]

  return {

    /**
     * Emit start event so Vue ready can be triggered.
     * - Doesn't use EventBus as it's not always available in time.
     * - See customers.js for an example use.
     */
    emitStartEvent() {
      document.dispatchEvent(new Event('cnvs:start'))
      cnvs.started = true
    },

    /**
     * Go through each async component and set its state based on its type.
     */
    setAsyncComponentStates() {
      Object.keys(asyncComponents).forEach((handle) => {
        const selector = selectors.componentHandle.replace('*', handle)
        const elements = [...document.querySelectorAll(selector)]

        if (!elements.length) {
          return
        }

        /**
         * Get type of first instance of component.
         */
        const element = elements[0]
        const type = element.dataset.componentType

        /**
         * Immediately set loading for load types or when in theme editor.
         */
        if (type === 'load' || Shopify.designMode) {
          componentStates[handle] = cnvs.states.loading
          return
        }

        /**
         * Handle scroll type component.
         */
        if (type === 'scroll') {
          this.handleScrollType(elements, handle)
          return
        }

        /**
         * Otherwise if trigger type then wait.
         */
        componentStates[handle] = cnvs.states.waiting
      })

      /**
       * Update all component states simultaneously.
       */
      this.setComponentStates(componentStates)
    },

    /**
     * Handle scroll type components.
     * - If already visible or not supported then immediately load.
     * - Adds observers to all elements so it's triggered no matter where the
     *   user is scrolling from.
     * @param {Array} elements - All elements with the component handle.
     * @param {String} handle - Component handle.
     */
    handleScrollType(elements, handle) {
      elements.forEach((element, index) => {
        if (
          isVisible(element) ||
          'IntersectionObserver' in window === false
        ) {
          componentStates[handle] = cnvs.states.loading
          return
        }

        if (index === 0) {
          componentStates[handle] = cnvs.states.waiting
        }

        setIntersectionObserver({
          callback: this.handleComponentIntersection,
          element,
          rootMargin: element.dataset.intersectionRootMargin || '0px',
          threshold: Number(element.dataset.intersectionThreshold) || 0.1,
        })
      })
    },

    /**
     * Handle component intersection.
     * @param {Array} entries - Intersection entries.
     * @param {Object} observer - Intersection observer.
     */
    handleComponentIntersection(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        this.loadComponent(entry.target.dataset.componentHandle)
        observer.unobserve(entry.target)
      })
    },

    /**
     * Add component animation intersection observers.
     * - Have to find all instances of component so the attribute is updated on
     *   each individually as they become visible.
     * - Override intersection defaults with data-intersection-root-margin
     *   and data-intersection-threshold attribute values.
     */
    setAnimationIntersectionObservers() {
      const elements = [...document.querySelectorAll(selectors.componentAnimation)]

      elements.forEach((element) => {
        if (element.dataset.componentAnimation !== '') {
          return
        }

        if (
          isVisible(element) ||
          'IntersectionObserver' in window === false
        ) {
          element.setAttribute('data-component-animation', true)
          return
        }

        setIntersectionObserver({
          callback: this.handleAnimationIntersection,
          element,
          rootMargin: element.dataset.intersectionRootMargin || '0px',
          threshold: Number(element.dataset.intersectionThreshold) || 0.3,
        })
      })
    },

    /**
     * Handle animation intersection.
     * @param {Array} entries - Intersection entries.
     * @param {Object} observer - Intersection observer.
     */
    handleAnimationIntersection(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.setAttribute('data-component-animation', true)
        observer.unobserve(entry.target)
      })
    },

    /**
     * Set event listeners.
     * - Used to trigger functions inside components.
     */
    setEventListeners() {
      events.forEach((event) => {
        document.addEventListener(event, this.emitEvent)
      })
    },

    /**
     * Emit section event to EventBus.
     * - Can't use Vuex as it isn't available at this point.
     * @param {Object} event - Event name.
     * @param {Object} detail - Section event detail.
     */
    emitEvent({ detail, type: event } = {}) {
      const vueFunction = convertToCamelCase(event)

      cnvs.EventBus.emit('cnvs:section-editor-event', {
        event,
        detail,
        vueFunction,
      })
    },

    /**
     * Remove event listeners to avoid duplicate event emits.
     */
    removeEventListeners() {
      events.forEach((event) => {
        document.removeEventListener(event, this.emitEvent)
      })
    },

    /**
     * Events
     * -------------------------------------------------------------------------
     * Emitted events from child components.
     *
     */

    /**
     * Update current request object on event emit.
     * @param {Object} data - Data object.
     * @param {Boolean|Object} data.response - Formatted query response object.
     * @param {String} data.type - Type of page, `product`, `collection` etc.
     */
    updateRequestObject({ response = false, type }) {
      this[type] = response
    },
  }
}
