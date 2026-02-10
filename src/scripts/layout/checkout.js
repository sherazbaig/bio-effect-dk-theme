/**
 * Layout: Checkout
 * -----------------------------------------------------------------------------
 * Entry file for all global checkout scripts.
 *
 */
import { getState } from '@shopify/theme-cart'
import { values as breakpoints } from '~/config/breakpoints'

import { reportError } from '~/core/global-functions'

import { keyboardTabbable } from '~/helpers/checkout'

/**
 * Global Canvas variables.
 */
window.cnvs = window.cnvs || {}

/**
 * Global Canvas functions.
 */
window.cnvs.ReportError = reportError

/**
 * Checkout functions.
 */
export function Checkout() {

  /**
   * Initialise component.
   * @param {Boolean} pageLoad - If the functions are being run on page load,
   * use to run functions only once where running them repeatedly would cause
   * issues such as duplicated content etc.
   */
  async function init(pageLoad = false) {
    if (pageLoad) {
      keyboardTabbable().init()
    }

    /**
     * Early returns for pages that don't support getState().
     */
    if (Shopify.Checkout.step === 'thank_you') {
      orderConfirmation(pageLoad)
      return
    }

    if (Shopify.Checkout.isOrderStatusPage) {
      orderStatusPage(pageLoad)
      return
    }

    /**
     * Load cart data.
     */
    try {
      const cartData = await getState()

      switch (Shopify.Checkout.step) {
        case 'contact_information':
          contactInformation(pageLoad, cartData)
          break

        case 'shipping_method':
          shippingMethod(pageLoad, cartData)
          break

        case 'payment_method':
          paymentMethod(pageLoad, cartData)
          break
      }

    } catch (error) {
      cnvs.ReportError('Failed to run checkout scripts', error)
    }
  }

  /**
   * Functions to run on the contact information step.
   * @param {Boolean} pageLoad - Function is being run on page load.
   * @param {Object} cartData - Cart response data.
   */
  function contactInformation() {

    /**
     * Open the cart summary on mobile.
     */
    if (window.matchMedia(`(max-width: ${breakpoints.m}px)`).matches) {
      document.querySelector('button[aria-controls="disclosure_content"]').click()
    }
  }

  /**
   * Functions to run on the shipping method step.
   * @param {Boolean} pageLoad - Function is being run on page load.
   * @param {Object} cartData - Cart response data.
   */
  function shippingMethod() {
    // Not empty
  }

  /**
   * Functions to run on the payment method step.
   * @param {Boolean} pageLoad - Function is being run on page load.
   * @param {Object} cartData - Cart response data.
   */
  function paymentMethod() {
    // Not empty
  }

  /**
   * Functions to run on the order confirmation page.
   * - Cart data is not available on these pages.
   * @param {Boolean} pageLoad - Function is being run on page load.
   */
  function orderConfirmation() {
    // Not empty
  }

  /**
   * Functions to run on the order status page.
   * - Cart data is not available on these pages.
   * @param {Boolean} pageLoad - Function is being run on page load.
   */
  function orderStatusPage() {
    // Not empty.
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}

[
  'DOMContentLoaded',
  'page:change',
  'page:update',
].forEach((event) => {
  document.addEventListener(event, () => {
    Checkout().init(event === 'DOMContentLoaded')
  })
})
