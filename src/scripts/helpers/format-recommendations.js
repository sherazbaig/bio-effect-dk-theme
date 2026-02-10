/**
 * Helper: Format recommendations
 * -----------------------------------------------------------------------------
 * Formats product recommendation values and objects.
 *
 */
/* eslint-disable no-constant-binary-expression */
import { formatMoney } from '@we-make-websites/theme-currency'

/**
 * Format recommendation product from JSON API.
 * @param {Object} product - JSON response.
 * @returns {Object}
 */
export function formatRecommendationProduct(product) {
  const images = formatImages(product)

  return {
    available: product.available,
    compareAtPrice: formatProductPrice(product, 'compare_at_price'),
    featuredImage: images[0],
    handle: product.handle,
    images,
    price: formatProductPrice(product, 'price'),
    secondaryImage: images.length > 1 ? images[1] : {},
    tags: product.tags,
    title: product.title,
    type: product.type,
    url: product.url,
    variants: formatVariants(product),
    vendor: product.vendor,
  }
}

/**
 * Formats product price.
 * @param {Object} product - JSON response.
 * @param {String} type - `price` or `compare_at_price`.
 * @returns {Object}
 */
function formatProductPrice(product, type) {
  return {
    amount: Number(product[type]) ?? false,
    currencyCode: cnvs.store.currency,
    max: Number(product[`${type}_max`]) ?? false,
    min: Number(product[`${type}_min`]) ?? false,
    varies: product[`${type}_varies`],
  }
}

/**
 * Formats images.
 * - Uses the media array as the JSON API returns just an array of URLs for
 *   the images array.
 * - Index matches the index when the whole media array is formatted, meaning
 *   there may be missing indices if product has non-image media.
 * @param {Object} product - JSON response.
 * @returns {Array}
 */
function formatImages(product) {
  if (!product.media) {
    return []
  }

  return product.media
    .filter((mediaObject) => {
      return mediaObject.media_type === 'image'
    })
    .map((mediaObject) => {
      return {
        alt: mediaObject.altText,
        height: mediaObject.height,
        id: mediaObject.id,
        index: mediaObject.position - 1,
        src: mediaObject.src,
        width: mediaObject.width,
      }
    })
}

/**
 * Formats variants.
 * @param {Object} response - Product response.
 * @returns {Array}
 */
function formatVariants(product) {
  return product.variants.map((variant) => {
    const formattedVariant = {
      available: variant.available,
      compareAtPrice: formatVariantPrice(variant.compareAtPrice),
      id: variant.id,
      image: {
        ...variant.image,
        src: variant.image?.url,
      } ?? false,
      inventory: variant.quantityAvailable,
      price: formatVariantPrice(variant.price),
      selectedOptions: variant.options.map((option) => {
        return {
          name: option.name,
          value: option.value,
        }
      }),
    }

    /**
     * Wait for prices to be formatted before determining title.
     * - Gift card variants show price as their title for localisation purposes.
     */
    formattedVariant.title = product.giftCard
      ? formatMoney(formattedVariant.price.amount, cnvs.store.moneyFormat)
      : variant.title

    return formattedVariant
  })
}

/**
 * Formats variant price.
 * @param {Object} price - Variant price response.
 * @returns {Object}
 */
function formatVariantPrice(price) {
  if (!price) {
    return {
      amount: false,
      currencyCode: false,
    }
  }

  return {
    amount: Number(price),
    currencyCode: price.currencyCode || cnvs.store.currency,
  }
}
