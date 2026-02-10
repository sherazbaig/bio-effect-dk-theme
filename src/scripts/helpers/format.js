/**
 * Helper: Format
 * -----------------------------------------------------------------------------
 * Formats values and objects.
 * - Add in alphabetical order.
 *
 */
/* eslint-disable no-constant-binary-expression */
import { formatMoney } from '@we-make-websites/theme-currency'

import { convertToHandle } from '~/helpers/convert'
import { isCdnUrl } from '~/helpers/general'
import { decodeApiId, transformEdges } from '~/helpers/graphql'

/**
 * Formats response from product.
 * @param {Object} response - GraphQL response.
 * @returns {Object}
 */
export function formatProduct(response) {
  const product = response.product

  const awards = formatAwards(product)

  const formattedProduct = {
    available: product.available,
    awards,
    badge: formatBadge(product),
    badge_text: product?.badge_text?.value,
    badge_color: product?.badge_color?.value,
    compareAtPrice: formatProductPrice(product.compareAtPriceRange),
    description: product.descriptionHtml,
    giftCard: product.giftCard,
    handle: product.handle,
    hidden: product?.hidden?.value || 0,
    id: decodeApiId(product.id),
    images: formatImages(product),
    media: formatMedia(product),
    options: formatOptions(product),
    price: formatProductPrice(product.priceRange),
    tags: product.tags,
    title: product.title,
    type: product.type,
    url: `//${location.host}${cnvs.routes.normalisedRoot}products/${product.handle}`,
    variants: formatVariants(product),
    vendor: product.vendor,
    excerpt: product?.excerpt?.value,
    badges: product?.badge_text?.value ? [product.badge_text.value] : [],
    upsellTitle: product?.upsell_title?.value
      ? product.upsell_title.value
      : false,
    upsellDescription: product?.upsell_description?.value
      ? product.upsell_description.value
      : false,
    upsellProduct: product?.upsell_product?.value
      ? product.upsell_product.value
      : false,
    upsellType: product?.upsell_type?.value
      ? product.upsell_type.value
      : null,
  }

  /**
   * Add additional values which rely on formatted response.
   */
  const featuredImages = formatImages(product, transformEdges(product.featuredImages))
  formattedProduct.featuredImage = featuredImages[0]

  formattedProduct.secondaryImage = featuredImages.length > 1
    ? featuredImages[1]
    : {}

  formattedProduct.hasOnlyDefaultVariant = formattedProduct.variants.every((variant) => {
    return variant.title.trim().toLowerCase() === 'default title'
  })

  return formattedProduct
}

/**
 * Formats product price.
 * @param {Object} price - Product price response.
 * @returns {Object}
 */
function formatProductPrice(price) {
  return {
    amount: Number(price?.minVariantPrice.amount) * 100 ?? false,
    currencyCode: price?.minVariantPrice.currencyCode,
    max: Number(price?.maxVariantPrice.amount) * 100 ?? false,
    min: Number(price?.minVariantPrice.amount) * 100 ?? false,
    varies: price?.maxVariantPrice.amount !== price?.minVariantPrice.amount,
  }
}

/**
 * Formats images.
 * @param {Object} response - GraphQL response.
 * @param {Array} [images] - Custom array of images for formatting.
 * @returns {Array}
 */
function formatImages(product, images = false) {
  const imagesArray = images ? images : transformEdges(product?.images)

  if (!imagesArray.length) {
    return []
  }

  const formattedImages = imagesArray.map((image, index) => {
    if (!image.url) {
      return {}
    }

    const linkedVariant = product.variants?.length
      ? transformEdges(product.variants).find((variant) => {
        return variant.image.id === image.id
      })
      : false

    return {
      alt: image.altText,
      height: image.height,
      id: decodeApiId(image.id),
      index,
      src: image.url,
      variant: decodeApiId(linkedVariant?.id) || false,
      width: image.width,
    }
  })

  return formattedImages
}

/**
 * Formats media.
 * @param {Oject} product - GraphQL response.
 * @returns {Array}
 */
function formatMedia(product) {
  const mediaArray = transformEdges(product.media)

  if (!mediaArray.length) {
    return []
  }

  return mediaArray.map((media, index) => {
    const formattedMedia = {
      alt: media.alt,
      id: decodeApiId(media.id) || false,
      index,
      mediaType: media.mediaType.toLowerCase(),
    }

    switch (formattedMedia.mediaType) {
      case 'external_video':
        formattedMedia.embedUrl = media.embedUrl
        formattedMedia.host = media.host
        formattedMedia.previewImage = formatImages(false, [media.previewImage])
        break

      case 'image':
        formattedMedia.image = formatImages(false, [media.image])
        break

      case 'model_3d':
        formattedMedia.previewImage = formatImages(false, [media.previewImage])

        formattedMedia.sources = media.sources.map((source) => {
          return {
            format: source.format,
            mimeType: source.mimeType,
            url: source.url,
          }
        })
        break

      case 'video':
        formattedMedia.previewImage = formatImages(false, [media.previewImage])

        formattedMedia.sources = media.sources.map((source) => {
          return {
            format: source.format,
            height: source.height,
            mimeType: source.mimeType,
            url: source.url,
            width: source.width,
          }
        })
        break
    }

    return formattedMedia
  })
}

/**
 * Formats options.
 * @param {Object} response - GraphQL response.
 * @returns {Array}
 */
function formatOptions(product) {
  return product.options.map((option, index) => {
    return {
      index,
      name: option.name,
      values: option.values,
    }
  })
}

/**
 * Formats variants.
 * @param {Object} response - GraphQL response.
 * @returns {Array}
 */
function formatVariants(product) {
  return transformEdges(product.variants).map((variant) => {
    const formattedVariant = {
      available: variant.available,
      compareAtPrice: formatVariantPrice(variant.compareAtPrice),
      id: decodeApiId(variant.id),
      image: {
        ...variant.image,
        src: variant.image?.url,
      } ?? false,
      inventory: variant.quantityAvailable,
      price: formatVariantPrice(variant.price),
      selectedOptions: variant.selectedOptions.map((option) => {
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
    amount: Number(price.amount) * 100,
    currencyCode: price.currencyCode,
  }
}

/**
 * Formats response from collection.
 * @param {Object} response - GraphQL response.
 * @returns {Object}
 */
export function formatCollection(response) {
  const collection = response.collection

  const formattedCollection = {
    description: collection.descriptionHtml,
    handle: collection.handle,
    id: decodeApiId(collection.id),
    pageInfo: {
      ...collection.products?.pageInfo,
      currentPage: 1,
    },
    title: collection.title,
    url: `//${location.host}${cnvs.routes.normalisedRoot}collections/${collection.handle}`,
  }

  /**
   * Format products.
   */
  formattedCollection.products = transformEdges(collection.products).map((productResponse) => {
    const product = productResponse

    return {
      available: product.available,
      compareAtPrice: formatProductPrice(product.compareAtPriceRange),
      featuredImage: formatImages(product)[0],
      handle: product.handle,
      price: formatProductPrice(product.priceRange),
      tags: product.tags,
      title: product.title,
      type: product.type,
      url: `//${location.host}${cnvs.routes.normalisedRoot}collections/${collection.handle}/products/${product.handle}`,
    }
  })

  return formattedCollection
}

/**
 * Formats response from menu.
 * @param {String} [prefix] - Prefix to prepend to handle to make it unique.
 * @param {String} [previousHandle] - Previous tier's handle.
 * @param {Object} response - GraphQL response or nested items array.
 * @param {Number} [tier] - Current tier number.
 * @returns {Array}
 */
export function formatMenu({
  prefix = 'mobile',
  previousHandle,
  response,
  tier = 1,
} = {}) {
  const menu = response?.menu?.items.length ? response.menu.items : response

  return menu.map((object, index) => {
    const handle = previousHandle
      ? `${prefix}-${previousHandle}-${convertToHandle(object.title)}-${tier}-${index}`
      : `${prefix}-${convertToHandle(object.title)}-${tier}-${index}`

    const links = object.items?.length
      ? formatMenu({
        prefix,
        previousHandle: handle,
        response: object.items,
        tier: tier + 1,
      })
      : []

    /**
     * Format url if storefront API URL uses .myshopify.com domain.
     */
    const urlPath =
      object.url.split(cnvs.store.localisedPermanentDomain)[1] ||
      object.url.split(cnvs.store.permanentDomain)[1]

    const objectUrl = object.url.includes('myshopify.com') ? `//${location.host}${cnvs.routes.normalisedRoot}${urlPath}` : object.url

    return {
      handle,
      links,
      tier,
      title: object.title,
      url: objectUrl,
    }
  })
}

/**
 * Format Shopify image URL.
 * @param {String} src - Image URL, can include existing parameters.
 * @param {Object|String} options - Image options object, or image size string.
 * @param {String} options.crop - Crop image positioning when height and width
 * are set.
 * @param {Number} options.height - Height of image in pixels.
 * @param {String} options.pad_color - Background colour to pad image when image
 * cannot be cropped.
 * @param {Number} options.width - Width of image in pixels.
 * @returns {String}
 */
export function formatImageUrl(src, options) {
  if (!isCdnUrl(src)) {
    return src
  }

  const filetype = src.split('.').reverse()[0]?.split('?')[0]
  let version = src.match(/(?!\?|&)(?<version>v=\d+)/gi)

  if (!filetype || !version) {
    return src
  }

  version = version[0]
  const parameters = []

  /**
   * Clean up image URL.
   * - Remove URL parameters.
   * - Standardise protocol.
   * - Remove progressive filetype prefix.
   * - Remove filetype.
   * - Remove sizing, crop, and scale.
   */
  let url = src
    .split('?')[0]
    .split('//')[1]
    .replace('.progressive.', '.')
    .replace(`.${filetype}`, '.')
    .replace(/(?<size>_(?:\d+)?x(?:\d+)?)?(?<crop>_crop_(?:top|center|bottom|left|right))?(?<scale>@(?:2|3)x)?\./g, '.')

  url = `//${url}${filetype}?${version}`

  /**
   * If no options provided then return URL.
   */
  if (!options) {
    return url
  }

  /**
   * Get parameters from options object.
   */
  if (typeof options === 'object') {
    Object.entries(options).forEach(([key, value]) => {
      if (!value || key === 'format') {
        return
      }

      let formattedValue = value

      if (key === 'pad_color') {
        formattedValue = value.replace('#', '')
      }

      parameters.push(`${key}=${formattedValue}`)
    })
  }

  /**
   * Get width and height parameters from options string.
   */
  if (typeof options === 'string') {
    const sizes = options.split('x')

    if (sizes[0]) {
      parameters.push(`width=${sizes[0]}`)
    }

    if (sizes[1]) {
      parameters.push(`height=${sizes[1]}`)
    }

    if (sizes[0] && sizes[1]) {
      parameters.push('crop=center')
    }
  }

  return parameters.length
    ? `${url}&${parameters.join('&')}`
    : url
}

/**
 * Formats response from article.
 * @param {Object} response - GraphQL response.
 * @returns {Object}
 */
export function formatArticle(response) {
  const article = response.article
  const badges = formatBadges(article)

  return {
    excerpt: article.excerpt,
    title: article.title,
    url: article.url,
    badges,
  }
}

/**
 * Formats response from page.
 * @param {Object} response - GraphQL response.
 * @returns {Object}
 */
export function formatPage(response) {
  const page = response.page

  const formattedPage = {
    excerpt: page.excerpt,
    title: page.title,
    url: page.url,
  }

  return formattedPage
}

/**
 * Compute badges from Shopify resource (product, article) tags.
 * @param {Object} resource - Shopify resource (product, article).
 * @returns {Array}
 */
function formatBadges(resource = {}) {
  if (!resource.tags || resource.tags.length === 0) {
    return []
  }

  const badges = []
  resource.tags.forEach((tag) => {
    if (tag.startsWith('badge:')) {
      const title = tag.split('badge:').pop()
      badges.push(title)
    }
  })

  return badges
}

/**
 * Format product awards images.
 * @param {Object} product - Shopify product.
 * @returns {Array}
 */
function formatAwards(product) {
  if (!product?.awards?.references?.nodes?.length) {
    return []
  }

  const awards = []
  const imageNodes = product?.awards?.references?.nodes

  imageNodes.forEach((imageNode) => {
    const image = imageNode?.image

    if (!image?.url) {
      return
    }

    awards.push({
      alt: image.altText,
      height: image.height,
      id: decodeApiId(image.id),
      src: image.url,
      width: image.width,
    })
  })

  return awards
}

/**
 * Format product badge image.
 * @param {Object} product - Shopify product.
 * @returns {Array}
 */
function formatBadge(product) {
  const badge = product?.badge?.reference?.image

  if (!badge) {
    return null
  }

  return {
    alt: badge.altText,
    height: badge.height,
    id: decodeApiId(badge.id),
    src: badge.url,
    width: badge.width,
  }
}
