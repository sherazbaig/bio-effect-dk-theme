/**
 * Helper: Vue
 * -----------------------------------------------------------------------------
 * Shared Vue methods and prop validation.
 * - Add in alphabetical order.
 *
 */

/**
 * Compute.
 * -----------------------------------------------------------------------------
 * Compute properties.
 *
 */

/**
 * Compute aspect ratio.
 * @param {Boolean|Number|String} ratio - Aspect ratio.
 * @param {Object} image - Image object.
 * @returns {String}
 */
export function computeAspectRatio(ratio, image) {

  /**
   * If ratio is false or 'image' then use image object properties.
   */
  if (ratio === false || ratio === 'image') {
    if (image.aspectRatio || image.aspect_ratio) {
      return image.aspectRatio || image.aspect_ratio
    }

    return image.width / image.height
  }

  /**
   * If ratio is a number then return without changes.
   */
  if (typeof ratio === 'number') {
    return ratio
  }

  /**
   * Replace colon to use CSS aspect-ratio format.
   */
  return ratio.replace(':', ' / ')
}

/**
 * Compute padding bottom.
 * @param {Number|String} aspectRatio - Calculated aspect ratio.
 */
export function computePaddingBottom(aspectRatio) {
  let decimal = aspectRatio

  if (typeof aspectRatio === 'string') {
    const parts = aspectRatio.split('/')
    decimal = Number(parts[0]) / Number(parts[1])
  }

  return `${(1 / decimal) * 100.00}%`
}

/**
 * Emits.
 * -----------------------------------------------------------------------------
 * Validate emits.
 *
 */

/**
 * Emit and validate update request object emit.
 * @param {Object} payload - Passed emit payload.
 * @returns {Boolean}
 */
export function emitUpdateRequestObject(payload) {
  return (
    (typeof payload.response === 'object' || typeof payload.response === 'boolean') &&
    typeof payload.type === 'string'
  )
}

/**
 * Validation.
 * -----------------------------------------------------------------------------
 * Validate props.
 *
 */

/**
 * Validate image prop.
 * @param {Boolean|String} value - Passed prop value.
 * @returns {Object}
 */
export function validateImage(value) {
  return !Object.keys(value).length || value.src || value.url
}

/**
 * Validate ratio prop.
 * @param {Boolean|Number|String} value - Passed prop value.
 * @param {Boolean} desktop - Is desktop ratio prop?
 * @returns {Object}
 */
export function validateRatio(value, desktop) {
  switch (typeof value) {
    case 'boolean':
      return (
        (desktop && typeof value === 'boolean') ||
        (!desktop && value === false)
      )
    case 'number':
      return true
    case 'string':
      return (
        value === '' ||
        value === 'image' ||
        value.match(/^\d+\s\/\s\d+$/g) ||
        value.match(/^\d+:\d+$/g)
      )
    default:
      return false
  }
}
