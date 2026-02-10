/**
 * Storybook: Mixin
 * -----------------------------------------------------------------------------
 * Mixin to add additional functionality to storybook Vue instance.
 *
 */
import collectionQuery from '~graphql/collection.gql'
import productQuery from '~graphql/product.gql'
import { formatCollection, formatProduct } from '~/helpers/format'

/**
 * Expose install method.
 */
export default {
  install: (app) => {
    app.mixin({
      methods: {

        /**
         * Query products and format responses.
         * @param {Array} handles - Product handles to load.
         * @returns {Array}
         */
        async sbQueryProducts(handles) {
          const queries = handles.map((handle) => {
            return cnvs.Query({
              query: productQuery,
              variables: {
                country: cnvs.store.country,
                handle,
                language: cnvs.store.language,
              },
            })
          })

          return new Promise(async (resolve, reject) => {
            try {
              const response = await Promise.all(queries)

              if (!response[0].product) {
                reject()
              }

              const formattedResponse = response.map((product) => {
                return formatProduct(product)
              })

              resolve(formattedResponse)

            } catch (error) {
              reject(error)
            }
          })
        },

        /**
         * Query collection and format response.
         * @param {String} handle - Collection handle to load.
         * @param {Number} first - How many products to load.
         * @returns {Array}
         */
        async sbQueryCollection(handle, first = 4) {
          return new Promise((resolve, reject) => {
            cnvs.Query({
              query: collectionQuery,
              variables: {
                country: cnvs.store.country,
                first,
                handle,
                language: cnvs.store.language,
              },
            })
              .then((response) => {
                resolve(formatCollection(response))
              })
              .catch((error) => reject(error))
          })
        },

        /**
         * Convert product to line item format.
         * - We can't load cart data directly from Shopify so we load products and
         *   convert product data into line items.
         * @param {Object} product - Formatted product data from GraphQL response.
         * @param {Number} quantity - Quantity of product to 'add'.
         * @returns {Object}
         */
        convertProductToLineItem(product, quantity) {
          return {
            compare_at_line_price: (product.compareAtPrice?.amount * quantity),
            compare_at_price: product.compareAtPrice?.amount,
            discounted_price: product.price.amount,
            discounts: [],
            featured_image: {
              alt: product.featuredImage.alt,
              aspect_ratio: (product.featuredImage.width / product.featuredImage.height),
              height: product.featuredImage.height,
              url: product.featuredImage.src,
              width: product.featuredImage.width,
            },
            final_line_price: (product.price.amount * quantity),
            final_price: product.price.amount,
            gift_card: (product.type === 'Gift Cards'),
            grams: product.grams || 0,
            handle: product.handle,
            id: product.variants[0].id,
            image: product.featuredImage.src,
            inventory_quantity: product.inventoryQuantity || 5,
            key: product.variants[0].id,
            line_level_discount_allocations: [],
            line_level_total_discount: 0,
            line_price: (product.price.amount * quantity),
            options_with_values: product.variants[0].selectedOptions,
            original_line_price: (product.price.amount * quantity),
            original_price: product.price.amount,
            price: product.price.amount,
            product_description: product.description,
            product_has_only_default_variant: (product.variants.length === 1),
            product_id: product.id,
            product_title: product.title,
            product_type: product.type,
            quantity: quantity,
            requires_shipping: true,
            sku: product.sku || '12345',
            tags: product.tags,
            taxable: true,
            title: (product.variants.length > 1)
              ? `${product.title} - ${product.variants[0].title}`
              : product.title,
            total_discount: 0,
            url: product.url,
            variant_id: product.variants[0].id,
            variant_options: product.variants[0].title.split(' / '),
            variant_title: (product.variants.length > 1)
              ? product.variants[0].title
              : null,
            vendor: product.vendor || 'cnvs_library',
          }
        },
      },
    })
  }
}
