/**
 * Core: App handler
 * -----------------------------------------------------------------------------
 * Any injected <script> tags will break the Vue container. Because of this,
 * app proxy pages and app blocks need a workaround.
 * - Moves specified elements outside of Vue instance on app proxy pages.
 * - Temporarily moves sections containing app blocks outside the Vue container
 *   until Vue has finished rendering.
 * - Original code by Jenny Liu, updated by Andrew Amistad.
 *
 */
import classes from '~/config/classes'
import { values as timings } from '~/config/timings'

/**
 * DOM selectors.
 */
const selectors = {
  placeholder: '#vue-element [js-app-handler="placeholder"]',
  sections: '#vue-element .shopify-section',
  vueElement: '#vue-element',
}

/**
 * Set global variables.
 */
const appPlacements = {}

/**
 * Create a new app handler object.
 */
export default () => {

  /**
   * Run functionality before Vue instance.
   */
  function beforeVueInit() {
    handleAppSections()
  }

  /**
   * Handle sections containing app blocks.
   */
  function handleAppSections() {

    /**
     * Go through each section, check to see if it has children and if one of
     * those children has 'shopify-app-block' class.
     */
    const appSections = [...document.querySelectorAll(selectors.sections)].filter((section) => {
      if (!section.children) {
        return false
      }

      return [...section.children].find((child) => {
        return child.classList?.contains('shopify-app-block')
      })
    })

    /**
     * Store app section placement.
     */
    appSections.forEach((section) => {
      appPlacements[`#${section.id}`] = {
        parentElementSelector: `${selectors.vueElement} #${section.parentElement?.id}`,
        previousElementSelector: `${selectors.vueElement} #${section.previousElementSibling?.id}`,
      }
    })

    /**
     * Move app section to the end of <body>.
     */
    appSections.forEach((section) => {
      teleportContent(section, document.body)
    })
  }

  /**
   * Teleport content to a different container.
   * @param {HTMLElement} element - Element to teleport.
   * @param {HTMLElement} destination - Element to teleport into.
   */
  function teleportContent(element, destination) {
    if (!element) {
      return
    }

    element.classList.add(classes.moved)
    destination.appendChild(element)
  }

  /**
   * Run functionality after Vue instance.
   */
  function afterVueInit() {
    const placeholder = document.querySelector(selectors.placeholder)

    if (isAppPage() && placeholder) {
      moveElements(placeholder)
      removePlaceholder(placeholder)
    }

    resetAppSectionPlacements()
  }

  /**
   * Check if page is an app proxy page.
   * - Or is a captcha page.
   * @returns {Boolean}
   */
  function isAppPage() {
    if (cnvs.page.type === 'captcha') {
      return true
    }

    const appPages = [
      '/a/',
      '/apps/',
      '/community/',
      '/tools/',
    ]

    return appPages.some((page) => cnvs.request.path.includes(page))
  }

  /**
   * Move elements to end of the body if it's an app proxy page.
   * - Use data-elements on app-handler element to list IDs of elements to move.
   * @param {HTMLElement} placeholder - App handler placeholder element.
   */
  function moveElements(placeholder) {
    const elementIds = placeholder?.dataset.elements?.split(',')

    if (!elementIds.length) {
      return
    }

    elementIds.forEach((id) => {
      teleportContent(document.querySelector(`${selectors.vueElement} #${id}`), document.body)
    })
  }

  /**
   * Remove app handler placeholder.
   * - Placeholder covers the page until the page is finished shifting.
   * - Fade it out, then remove it.
   * @param {HTMLElement} placeholder - App handler placeholder element.
   */
  function removePlaceholder(placeholder) {
    placeholder.classList.remove(classes.visible)

    setTimeout(() => {
      placeholder.remove()
    }, timings.normal)
  }

  /**
   * Move all app sections back to their original placements.
   * - Move it after its original previous sibling if there was one.
   * - Otherwise move to start of its original parent.
   */
  function resetAppSectionPlacements() {
    if (!Object.keys(appPlacements).length) {
      return
    }

    Object.entries(appPlacements).forEach(([sectionId, value]) => {
      const section = document.querySelector(`${sectionId}.${classes.moved}`)
      const { parentElementSelector, previousElementSelector } = value

      const parentElement = document.querySelector(parentElementSelector)
      const previousElement = document.querySelector(previousElementSelector)

      if (previousElement) {
        previousElement.insertAdjacentElement('afterend', section)
        return
      }

      if (!parentElement) {
        return
      }

      parentElement.insertAdjacentElement('afterbegin', section)
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    beforeVueInit,
    afterVueInit,
  })
}
