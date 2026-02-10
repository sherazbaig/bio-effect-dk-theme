/**
 * Component: Tabs sciprt.
 * -----------------------------------------------------------------------------
 * Tabs script which creates tabs functionality in account page.
 *
 */
import classes from '~/config/classes'

/**
 * DOM selectors.
 */
const selectors = {
  navigationList: '[js-tabs]',
  navigationListItems: '.customers-header__navigation-item',
  navigationsContent: '[js-tabs-panel]',
  gridContainer: '.customers-account__grid',
}

/**
 * Create a new example object.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    navigationList: document.querySelectorAll(selectors.navigationList),
    gridContainer: document.querySelector(selectors.gridContainer),
  }

  /**
   * Initialise component.
   */
  function init() {
    setActiveTab()
    setEventListeners()
  }

  /**
   * Set event listeners.
   */
  function setEventListeners() {
    nodeSelectors.navigationList.forEach(node => {
      node.addEventListener('click', (event) => {
        event.preventDefault()
        const toActivateNode = event.currentTarget.parentNode
        const tabName = event.currentTarget.getAttribute('js-tabs')
        const toActivateContent = document.querySelector(
          `[js-tabs-panel="${tabName}"]`,
        )

        updateQueryParams(tabName)
        unselectAll()
        hideAllPanels()

        toActivateNode.classList.toggle(classes.active)
        toActivateContent.classList.remove('invisible-tab')
      })
    })

    window.addEventListener('popstate', () => {
      setActiveTab()
    })
  }

  /**
   * Update query params.
   * @param {String} tabName
   */
  function updateQueryParams(tabName) {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('tab', tabName)
    url.search = params.toString()
    window.history.pushState({}, '', url)
  }

  /**
   * Hide active classes.
   */
  function unselectAll() {
    document.querySelectorAll(selectors.navigationListItems).forEach(node => {
      node.classList.remove(classes.active)
    })
  }

  /**
   * Hide all panels.
   */
  function hideAllPanels() {
    document.querySelectorAll(selectors.navigationsContent).forEach((node) => {
      node.classList.add('invisible-tab')
    })
  }

  /**
   * Set active tab.
   */
  function setActiveTab() {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const param = params.get('tab') || 'MyOrders'

    hideAllPanels()
    const activePanel = document.querySelector(`[js-tabs-panel="${param}"]`)
    if (activePanel) {
      activePanel.classList.remove('invisible-tab')
    }

    nodeSelectors.navigationList.forEach(node => {
      if (node.getAttribute('js-tabs') === param) {
        node.parentNode.classList.add(classes.active)

        return
      }

      node.parentNode.classList.remove(classes.active)
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
