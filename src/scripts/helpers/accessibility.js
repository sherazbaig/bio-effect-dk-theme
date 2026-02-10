/**
 * Helper: Accessibility
 * -----------------------------------------------------------------------------
 * Functions used by accessibility.js Vuex store.
 * - Add in alphabetical order.
 *
 */
import { isVisible } from '~/helpers/general'

/**
 * Get all focusable elements within targeted container.
 * - Force included parameters defined in config.
 * - Remove excluded elements defined in config.
 * @param {Element} container - Target container to get focusable elements from.
 * @param {Object} config - Config object.
 * @param {Array} exclude - Array of selectors to exclude.
 * @param {Array} include - Array of selectors to include.
 * @param {Boolean} includeDisplayNone - Include `display: none` elements.
 * @param {Boolean} includeHidden - Include hidden elements.
 * @param {Boolean} includeNonTabbable - Include elements with -1 tabindex.
 * @returns {Object}
 */
export function focusable(container, {
  exclude = [],
  include = [],
  includeDisplayNone = false,
  includeHidden = false,
  includeNonTabbable = false,
} = {}) {
  const defaults = [
    '[tabindex]',
    '[draggable]',
    'a[href]',
    'area',
    'button:enabled',
    'input:not([type=hidden]):enabled',
    'object',
    'select:enabled',
    'textarea:enabled',
  ]

  /**
   * Override default settings with component configuration.
   */
  if (include.length) {
    include.forEach((selector) => defaults.push(selector))
  }

  const elements = [...container.querySelectorAll(defaults.join())]
  let focusableElements = elements

  /**
   * Filter out hidden elements according to settings.
   */
  if (!includeHidden) {
    focusableElements = elements.filter((element) => isVisible(element))
  }

  /**
   * Filter out elements with `tabindex="-1"` according to settings.
   */
  if (!includeNonTabbable) {
    focusableElements = focusableElements.filter((element) => {
      return element.getAttribute('tabindex') !== '-1'
    })
  }

  /**
   * Filter out elements with styles set to display none according to settings.
   */
  if (!includeDisplayNone) {
    focusableElements = focusableElements.filter((element) => {
      return getComputedStyle(element)?.display !== 'none'
    })
  }

  /**
   * Filter out excluded elements.
   */
  if (exclude.length) {
    const exclusionList = [...container.querySelectorAll(exclude.join())]

    focusableElements = focusableElements.filter((element) => {
      return !exclusionList.includes(element)
    })
  }

  return focusableElements
}

/**
 * Set tabindex on focusable elements within target container.
 * @param {Element} container - Target container to get focusable elements from.
 * @param {Integer} tabindex - Tabindex value (Default: 0).
 */
export function updateTabindexOnElement(container, tabindex = 0) {
  const focusableElements = focusable(container, {
    includeHidden: true,
    includeNonTabbable: true,
  })

  if (!focusableElements) {
    throw new Error('Could not find any focusable elements in container')
  }

  focusableElements.forEach((element) => {
    element.setAttribute('tabindex', tabindex)
  })
}
