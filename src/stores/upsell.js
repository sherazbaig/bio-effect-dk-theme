import { formatProduct } from '~/helpers/format'
import productByIdQuery from '~graphql/product-by-id.gql'

const DEFAULT_STATE = {
  upsellType: null,
  title: null,
  description: null,
  product: {},
  originalItemProperties: null,
}

export default {
  namespaced: true,

  state: DEFAULT_STATE,

  mutations: {
    setUpsellType(state, type) {
      state.upsellType = type
    },

    setTitle(state, title) {
      state.title = title
    },

    setDescription(state, description) {
      state.description = description
    },

    setUpsellProduct(state, product) {
      state.product = product
    },

    setOriginalItemProperties(state, properties) {
      state.originalItemProperties = properties
    },

    resetState(state) {
      state.upsellType = null
      state.title = null
      state.description = null
      state.product = {}
      state.originalItemProperties = null
    },
  },

  actions: {
    async fetchProduct({ commit }, id) {
      const response = await cnvs.Query({
        query: productByIdQuery,
        variables: {
          country: cnvs.store.country,
          id,
          language: cnvs.store.language,
        },
      })

      if (!response.product) {
        return
      }

      commit('setUpsellProduct', formatProduct(response))
    },
  },
}
