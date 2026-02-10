/**
 * Helper: General
 * -----------------------------------------------------------------------------
 * General helper utility functions.
 * - Functions which don't fit into any of the other utils files.
 * - Add in alphabetical order.
 *
 */

/**
 * Debounce functions.
 * - Calls a function when a user hasn't carried out an event for a specific
 *   amount of time.
 * @param {Function} callback The function to debounce.
 * @param {Number} wait - The amount of time before debounce call is triggered.
 * @param {Boolean} immediate - Trigger the immediately.
 */
export function debounce(callback, wait, immediate) {
  let timeout = null

  return function debounceFunc(...args) {
    const callNow = immediate && !timeout

    function later() {
      timeout = null
      if (!immediate) {
        callback.apply(this, args)
      }
    }

    window.clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)

    if (callNow) {
      callback.apply(this, args)
    }
  }
}

/**
 * Handles pluralisation of strings based on Unicode plural rules.
 * - https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html
 * - Follows English plural rules.
 * - Zero + (One|Single) + (Two + Few) + (Other|Many|Plural).
 * @param {Object} strings - Strings object containing locale strings.
 * @param {Number} number - Number to use for plural rules.
 * @returns {String}
 */
export function handlePluralisation(strings, number) {
  if (strings.zero && number === 0) {
    return strings.zero
  }

  const one = strings.one || strings.single

  if (one && number === 1) {
    return one
  }

  if (strings.two && number === 2) {
    return strings.two
  }

  const many = strings.other || strings.many || strings.plural

  if (strings.few) {
    if (many && strings.two && number === 3) {
      return strings.few
    }

    if (!many && strings.two && number > 2) {
      return strings.few
    }

    if (!many && number > 1) {
      return strings.few
    }
  }

  return many
}

/**
 * Test if a URL is a Shopify CDN URL.
 * - Returns true if URL contains:
 * -- cdn.shopify.com/
 * -- [custom-domain].[tld]/cdn/
 * -- [store].myshopify.com/cdn/
 * @param {String} url - URL to test.
 * @returns {Boolean}
 */
export function isCdnUrl(url) {
  const cdnUrls = [
    'cdn.shopify.com/',
    `${cnvs.store.shopDomain.replaceAll('/', '')}/cdn/`,
    `${cnvs.store.permanentDomain.replaceAll('/', '')}/cdn/`,
  ]

  return cdnUrls.some((cdnUrl) => url.includes(cdnUrl))
}

/**
 * Test if a part of an element is in the viewport.
 * @param {HTMLElement} element - Element to check.
 * @returns {Boolean} - True if element is at least partially in viewport.
 */
export function isVisible(element) {
  const windowHeight = window.innerHeight

  const elementRectangle = element.getBoundingClientRect()
  const elementTop = elementRectangle.top
  const elementBottom = elementRectangle.bottom

  const topInView = (elementTop > 0) && (elementTop < windowHeight)
  const bottomInView = (elementBottom > 0) && (elementBottom < windowHeight)

  return topInView || bottomInView
}

/**
 * Scrolls page smoothly to element.
 * @param {HTMLElement} element - Element to scroll to.
 * @param {Object} data - Additional data.
 * @param {Function} data.callback - Function run after completion.
 * @param {String} data.headerState - State of header when function is run.
 * @param {HTMLElement} data.page - Element to scroll.
 */
export function scrollToElement(element, { callback, headerState, page = window } = {}) {
  let viewportFromPageTop = window.pageYOffset

  if (page !== window) {
    viewportFromPageTop = 0
  }

  /**
   * Get element scroll position.
   */
  const elementRectangle = element.getBoundingClientRect()
  const elementFromViewportTop = Math.floor(elementRectangle.top)
  let position = viewportFromPageTop + elementFromViewportTop

  /**
   * Retrieve variables.
   */
  const headerHeight = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')
      .replace('px', ''),
  )

  const fontSize = Number(
    getComputedStyle(document.documentElement).fontSize
      .replace('px', ''),
  )

  let spacingM = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--spacing-m')
      .replace('rem', ''),
  )

  spacingM *= fontSize

  /**
   * Offset height of header and update position.
   * - Assumes that when header is collapsed it has a height of 0.
   * - If it doesn't then update each condition with a new variable.
   * - Don't use --header-visible-height as that isn't updated in time.
   */
  const threshold = headerState === 'collapsed'
    ? spacingM
    : headerHeight + spacingM

  if (elementFromViewportTop === threshold) {
    return
  }

  const dynamicHeaderHeight = elementFromViewportTop > threshold
    ? 0
    : headerHeight

  position -= dynamicHeaderHeight
  position -= spacingM

  /**
   * Disable smooth scroll if prefers reduced motion.
   */
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  page.scroll({
    behavior,
    left: 0,
    top: position,
  })

  if (typeof callback === 'function') {
    callback()
  }
}

/**
 * Set intersection observers to detect when add to cart button leaves viewport.
 * @param {Object} data - Data object.
 * @param {Object} data.callback - Function to run when intersecting.
 * @param {HTMLElement} data.element - Element to set observer on.
 * unobserved, must be a Vue element.
 * @param {String} [data.rootMargin] - Values to grow or shrink each side of the
 * root element's bounding box before computing intersections.
 * @param {Number|Array} [data.threshold] - Intersection observer threshold, 0.5
 * means the intersection is triggered when 50% of the element is in view.
 * @returns {Function}
 */
export function setIntersectionObserver({
  callback,
  element,
  rootMargin = '0px',
  threshold = 0.5,
}) {
  const options = {
    root: null,
    rootMargin,
    threshold,
  }

  const observer = new IntersectionObserver(callback, options)
  observer.observe(element)
}

/**
 * Throttle functions.
 * - Calls a function at intervals of a specified amount of time while the user
 *   is still carrying out the event.
 * @param {Function} callback - The function to execute when timer is passed.
 * @param {Number} wait - The amount of time before debounce call is triggered.
 * @param {Boolean} immediate - Trigger the immediately.
 */
export function throttle(callback, wait, immediate = false) {
  let timeout = null
  let initialCall = true

  return function throttleFunc(...args) {
    const callNow = immediate && initialCall

    function next() {
      callback.apply(this, args)
      timeout = null
    }

    if (callNow) {
      initialCall = false
      next()
    }

    if (!timeout) {
      timeout = window.setTimeout(next, wait)
    }
  }
}
