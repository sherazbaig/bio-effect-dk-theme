/**
 * Core: Event bus
 * -----------------------------------------------------------------------------
 * A global event dispatcher used to communicate between components.
 *
 */
export default () => {

  /**
   * Create a new EventBus instance.
   */
  const eventBus = {}

  /**
   * Listen for the given event.
   * @param {String|Array} events - Event string. eg: namespace:state.
   * @param {Function} handler - Callback function to execute when event is
   * fired.
   */
  function listen(events, handler) {
    return [...[].concat(events)].forEach((event) => {
      eventBus[event] = (eventBus[event] || []).concat(handler)
    })
  }

  /**
   * Trigger all handlers for the given event.
   * @param {String} event - Event string. eg: namespace:state.
   * @param {*} data - Payload to send to listeners.
   */
  function emit(event, data) {
    if (!eventBus[event]) {
      return false
    }

    return [...eventBus[event]].forEach((handler) => handler(data))
  }

  /**
   * Remove listeners for a given event.
   * @param {String} events - Event string. eg: namespace:state.
   */
  function remove(event) {
    return delete eventBus[event]
  }

  /**
   * Fetch all registered event listeners.
   */
  function all() {
    return eventBus
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    all,
    emit,
    listen,
    remove,
  })
}
