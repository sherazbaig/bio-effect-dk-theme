/**
 * Helper: GraphQL
 * -----------------------------------------------------------------------------
 * Handles GraphQL responses.
 * - Add in alphabetical order.
 *
 */

/**
 * Decodes Shopify API IDs into Liquid format IDs.
 * @param {String} string - Encoded string.
 * @returns {String}
 */
export function decodeApiId(string) {
  if (!string) {
    return null
  }

  return Number(string.split('/').pop())
}

/**
 * Removes edges and nodes from GraphQL data.
 * @param {Object} object - GraphQL data.
 * @param {String} field - Optional string to filter by.
 * @returns {Object}
 */
export function transformEdges(object, field) {
  if (!object) {
    return []
  }

  if (!field) {
    return object.edges.map((edge) => {
      return edge.node
    })
  }

  return object.edges.map((edge) => {
    return edge.node[field]
  })
}
