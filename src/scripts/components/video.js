/**
 * Component: Video
 * -----------------------------------------------------------------------------
 * Script for HTML video functionality which allow play/pause video.
 *
 */
import classes from '~/config/classes'

/**
 * DOM selectors.
 */
const selectors = {
  toggle: `[js-video="toggle"]`,
  video: '[js-video="video"]',
}

/**
 * Create a new example object.
 */
export default () => {
  let nodeSelectors = {}

  /**
   * @param {String} sectionId - Section ID.
   * Initialise component.
   */
  function init(sectionId) {
    setNodeSelectors(sectionId)
    setEventListeners()
  }

  /**
   * DOM node selectors.
   * @param {String} sectionId - Section ID.
   */
  function setNodeSelectors(sectionId) {
    nodeSelectors = {
      toggle: document.querySelector(
        `[data-section-id="${sectionId}"] ${selectors.toggle}`,
      ),
      video: document.querySelector(
        `[data-section-id="${sectionId}"] ${selectors.video}`,
      ),
    }
  }

  /**
   * Set event listeners.
   */
  function setEventListeners() {
    nodeSelectors.toggle?.addEventListener('click', () => {
      const isPlaying = Boolean(nodeSelectors.video.currentTime > 0 &&
        !nodeSelectors.video.paused &&
        !nodeSelectors.video.ended &&
        nodeSelectors.video.readyState > 2)

      if (isPlaying) {
        nodeSelectors.video.pause()
        showPauseControls()
        return
      }

      nodeSelectors.video.play()
      hidePauseControls()
    })
  }

  /**
   * Show the pause button and hide the play button.
   */
  function showPauseControls() {
    nodeSelectors.toggle.classList.remove(classes.hidden)
  }

  /**
   * Show the pause button and hide the play button.
   */
  function hidePauseControls() {
    nodeSelectors.toggle.classList.add(classes.hidden)
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
