/**
 * Component: Free Samples
 * -----------------------------------------------------------------------------
 * Free samples helper functions.
 *
 */
import freeSamplesQuery from '~graphql/free-samples.gql'
import { formatProduct } from '~/helpers/format'

/**
 * Free Samples Query.
 */
export function fetchFreeSamples() {
  return cnvs.Query({
    query: freeSamplesQuery,
    variables: {
      country: cnvs.store.country,
      language: cnvs.store.language,
    },
  })
}

/**
 * Format free samples metaobject.
 * @param {Object} response - Graphql api response.
 */
export function formatFreeSamples(response) {
  const nodes = response?.metaobject?.list?.references?.nodes || []
  const title = response?.metaobject?.title?.value || ''

  const list = []

  nodes.forEach((node) => {

    /**
     * If product is not available for sale
     * do not add it to free samples list.
     */
    if (!node.available) {
      return
    }

    list.push(formatProduct({ product: node }))
  })

  return {
    title,
    list,
  }
}
