/**
 * Helper: Checkout
 * -----------------------------------------------------------------------------
 * Checkout helper utility functions.
 * - Add in alphabetical order.
 *
 */
import classes from '~/config/classes'

/**
 * Enables focus.tabbable class to body
 * - Used to control styling of accessibility focus states.
 */
export function keyboardTabbable() {

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
    document.addEventListener('keydown', handleKeyboardEvent)
  }

  /**
   * Handle keyboard events after validating tab.
   * @param {Event} event - Keyboard keydown event.
   */
  function handleKeyboardEvent(event) {
    if (!isKeyPressIsTab(event)) {
      return
    }

    handleTabEvent()
  }

  /**
   * Check if Tab key has been pressed.
   * @param {Event} event - Keyboard event passed from user input on document.
   */
  function isKeyPressIsTab(event) {
    return event.keyCode === 9
  }

  /**
   * Handle tab keyboard event.
   * @param {Event} event - Key code event set on document.
   */
  function handleTabEvent() {
    document.body.classList.add(classes.tabbable)
    document.removeEventListener('keydown', handleKeyboardEvent)
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
