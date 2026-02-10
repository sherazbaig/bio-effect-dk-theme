/**
 * Component: Accordion script
 * -----------------------------------------------------------------------------
 * Accordion script which creates accordion functionality in account page.
 *
 */
import classes from '~/config/classes'

/**
 * DOM selectors.
 */
const selectors = {
  toggleSelector: '[js-accordion="wrapper"]',
}

/**
 * Create a new example object.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    toggleSelector: document.querySelectorAll(selectors.toggleSelector),
  }

  /**
   * Initialise component.
   */
  function init() {
    setEventListeners()
  }

  /**
   * Set event listeners.
   */
  function setEventListeners() {
    nodeSelectors.toggleSelector.forEach(node => {
      node.addEventListener('click', (event) => {
        const toOpenNode = event.currentTarget.nextSibling

        if (!toOpenNode) {
          return
        }

        toOpenNode.classList.toggle(classes.open)

        if (toOpenNode.classList.contains(classes.open)) {
          let height = 0

          toOpenNode.childNodes.forEach(childNode => {
            height += childNode.clientHeight
            height += parseInt(window.getComputedStyle(childNode).marginBottom)
          })

          toOpenNode.style.maxHeight = `${height}px`
          toggleIcons(event.currentTarget, 'opening')

          return
        }

        toggleIcons(event.currentTarget, 'closing')
        toOpenNode.style.maxHeight = 0
      })
    })
  }

  /**
   * Show/Hide plus, minus icons based on state
   * @param {HTMLElement} parent
   * @param {String} state
   */
  function toggleIcons(parent, state) {
    if (state === 'opening') {
      parent.querySelector('.icon__outlined-plus').style.display = 'none'
      parent.querySelector('.icon__outlined-minus').style.display = 'block'

      return
    }
    parent.querySelector('.icon__outlined-plus').style.display = 'block'
    parent.querySelector('.icon__outlined-minus').style.display = 'none'
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
