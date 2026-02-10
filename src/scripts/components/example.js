/**
 * Component: Example script
 * -----------------------------------------------------------------------------
 * An example file that contains scripts to function.
 *
 */
import classes from '~/config/classes'

/**
 * DOM selectors.
 */
const selectors = {
  toggleSelector: '[js-example="toggle"]',
}

/**
 * Create a new example object.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    toggleSelector: document.querySelector(selectors.toggleSelector),
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
    nodeSelectors.toggleSelector.addEventListener('click', (event) => {
      event.preventDefault()
      event.currentTarget.classList.add(classes.active)
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
