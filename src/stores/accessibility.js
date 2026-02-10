/**
 * Store: Accessibility
 * -----------------------------------------------------------------------------
 * Handles tabbable state, trap focus, and previous element.
 * - Tied to the accessibility component.
 * - Only JSDOC custom parameters, ignore module state or object.
 *
 */
import { focusable } from '~/helpers/accessibility'

export default {
  namespaced: true,

  state: () => ({
    focusTrap: [],
    previousElement: false,
  }),

  getters: {

    /**
     * Get first focus trap element.
     * @returns {HTMLElement|Null}
     */
    getFirstElement(state) {
      return state.focusTrap[0]
    },

    /**
     * Get if focus should be trapped (focusTrap has elements).
     * @returns {Boolean}
     */
    getFocusTrapActive(state) {
      return Boolean(state.focusTrap.length)
    },

    /**
     * Get last focus trap element.
     * @returns {HTMLElement|Null}
     */
    getLastElement(state) {
      return state.focusTrap[state.focusTrap.length - 1]
    },
  },

  mutations: {

    /**
     * Set focus trap.
     * - Focus trap is enforced by accessibility component.
     * @param {Array} [focusableElements] - Focusable elements to trap focus on,
     * if no elements are provided then focus trap is removed.
     */
    SET_FOCUS_TRAP(state, focusableElements = []) {
      state.focusTrap = focusableElements
    },

    /**
     * Set previous element.
     * @param {HTMLElement|Boolean} [previousElement] - Previous element or
     * false to unset.
     */
    SET_PREVIOUS_ELEMENT(state, previousElement = false) {
      state.previousElement = previousElement
    },
  },

  actions: {

    /**
     * Clears focus trap elements.
     */
    clearFocusTrap({ commit }) {
      commit('SET_FOCUS_TRAP')
    },

    /**
     * Commit focus trap elements.
     * - Must be provided either container or elements.
     * - Storybook surpresses error messages.
     * @param {Object} config - Config object.
     * @param {HTMLElement|Array} [config.container] - Single container element
     * or array of containers to find focusable elements inside of.
     * @param {Array} [config.elements] - Array of focusable elements.
     * @param {Boolean} [config.includeDisplayNone] - Include `display: none`
     * elements.
     * @param {Boolean} [config.includeHidden] - Include hidden elements.
     * @param {Boolean} [config.includeNonTabbable] - Include elements with -1
     * tabindex.
     */
    setFocusTrap({ commit }, {
      container,
      elements = [],
      includeDisplayNone = false,
      includeHidden = true,
      includeNonTabbable = false,
    } = {}) {
      if (!container && !elements.length) {
        if (cnvs.storybook) {
          return
        }

        throw new Error('No container or elements to trap focus on')
      }

      const focusableElements = []

      if (Array.isArray(container) && container.length) {
        container.forEach((element) => {
          focusableElements.push(...focusable(element, {
            includeDisplayNone,
            includeHidden,
            includeNonTabbable,
          }))
        })

      } else if (container) {
        focusableElements.push(...focusable(container, {
          includeDisplayNone,
          includeHidden,
          includeNonTabbable,
        }))
      }

      if (elements.length) {
        focusableElements.push(...elements)
      }

      /**
       * Sort trap focus by tabindex if value isn't 0.
       */
      focusableElements.sort((first, second) => {
        const firstIndex = first.getAttribute('tabindex')
        const secondIndex = second.getAttribute('tabindex')

        if (firstIndex < secondIndex) {
          return -1
        }

        if (firstIndex > secondIndex) {
          return 1
        }

        return 0
      })

      commit('SET_FOCUS_TRAP', focusableElements)
    },

    /**
     * Commit previous element state.
     * @param {HTMLElement} [previousElement] - Previous element.
     */
    setPreviousElement({ commit }, previousElement) {
      commit('SET_PREVIOUS_ELEMENT', previousElement)
    },
  },
}
