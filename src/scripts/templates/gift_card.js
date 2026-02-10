/**
 * Component: Gift card
 * -----------------------------------------------------------------------------
 * Gift card template functionality.
 *
 */
import classes from '~/config/classes'

/**
 * DOM selectors.
 */
const selectors = {
  container: '[js-gift-card="container"]',
  qr: '[js-gift-card="qr"]',
  code: '[js-gift-card="code"]',
  copyMessage: '[js-gift-card="copyMessage"]',
  printButton: '[js-gift-card="print"]',
}

/**
 * Export gift card redemption.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    container: document.querySelector(selectors.container),
    qr: document.querySelector(selectors.qr),
    code: document.querySelector(selectors.code),
    copyMessage: document.querySelector(selectors.copyMessage),
    printButton: document.querySelector(selectors.printButton),
  }

  /**
   * Initialise component.
   */
  function init() {
    if (nodeSelectors.container.dataset.expired === 'true') {
      return
    }

    setEventListeners()
    setQrCode()
  }

  /**
   * Set event listeners.
   */
  function setEventListeners() {
    nodeSelectors.code.addEventListener('click', () => copyCode())

    nodeSelectors.copyMessage.addEventListener('click', () => {
      nodeSelectors.copyMessage.classList.remove(classes.active)
    })

    nodeSelectors.printButton.addEventListener('click', () => {
      window.print()
    })
  }

  /**
   * Copy gift card code.
   */
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(nodeSelectors.code.value)
      nodeSelectors.copyMessage.innerText = nodeSelectors.copyMessage.dataset.copyMessage
      nodeSelectors.copyMessage.classList.add(classes.active)

    } catch (error) {
      cnvs.ReportError('Failed to copy gift card code', error)
    }
  }

  /**
   * Set QR code.
   */
  function setQrCode() {
    new QRCode(nodeSelectors.qr, {
      height: 150,
      imageAltText: nodeSelectors.qr.dataset.qrImageAlt,
      text: nodeSelectors.qr.dataset.identifier,
      width: 150,
    })
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
