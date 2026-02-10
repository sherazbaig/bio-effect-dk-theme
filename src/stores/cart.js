/**
 * Store: Cart
 * -----------------------------------------------------------------------------
 * Cart state and events.
 * - Only JSDOC custom parameters, ignore module state or object.
 *
 */
import { fetchFreeSamples, formatFreeSamples } from '~/components/freeSamples'

export default {
  namespaced: true,

  state: () => ({
    history: [],
    response: {
      attributes: {},
      cart_level_discount_applications: [],
      currency: null,
      item_count: 0,
      items_subtotal_price: 0,
      items: [],
      note: null,
      original_total_price: 0,
      requires_shipping: false,
      token: null,
      total_discount: 0,
      total_price: 0,
      total_weight: 0,
    },
    status: {
      items: [],
      label: 'loading',
    },
    freeSamples: {
      status: 'done',
    },
  }),

  mutations: {

    /**
     * Adds new event to history.
     * - Latest event is added to the start of the history array.
     * @param {Object} event - Cart event to add.
     */
    SET_HISTORY(state, event) {
      state.history.unshift(event)
    },

    /**
     * Sets the response state.
     * @param {Boolean} response - Cart response data.
     */
    SET_RESPONSE(state, response) {
      state.response = response
    },

    /**
     * Sets current cart status.
     * @param {Object} payload - Mutation payload.
     * @param {Array} payload.items - Array of item keys being updated.
     * @param {String} payload.label - Status description, can be `loading`,
     * `loaded`, `adding`, `removing`, `clearing`, `updating`, `updated`, or
     * `error`.
     */
    SET_STATUS(state, { items, label }) {
      state.status = {
        items: items ? items : [],
        label,
      }
    },

    /**
     * Sets current cart freeSamples.
     * @param {Object} payload - Mutation payload.
     * @param {String} payload.title - Free samples block title,
     * @param {Array} payload.list - Array of free samples products.
     */
    SET_FREE_SAMPLES(state, { title, list }) {
      state.freeSamples = {
        title,
        list: list ? list : [],
      }
    },

    /**
     * Sets current cart freeSamples status.
     * - Sets the status of the cart freeSamples, statuses are
     * - 'done', 'loading'
     */
    SET_FREE_SAMPLES_STATUS(state, freeSamplesStatus = 'done') {
      state.freeSamples = {
        ...state.freeSamples,
        status: freeSamplesStatus,
      }
    },
  },

  actions: {

    /**
     * Actions cart requests.
     * @param {Object} payload - Action payload.
     * @param {String} payload.action - `add`, `clear`, `update`, or `change`.
     * @param {String} payload.body - Stringified body of request.
     * @param {Number} [payload.itemsLeft] - Items left in queue, only set
     * response when no more items are left in queue.
     * @returns {Promise}
     */
    actionCartUpdate({ commit, dispatch }, { action, body, itemsLeft = 0 } = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          let response = await fetch(cnvs.routes.cart[action], {
            body,
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const responseOk = response.ok
          response = await response.json()

          if (!responseOk) {
            commit('SET_STATUS', { label: 'error' })
            reject(response)
            return
          }

          if (!itemsLeft) {
            await dispatch('setResponse')
          }

          // Dispatch free samples handler
          await dispatch('freeSamplesHandler')
          resolve(response)

        } catch (error) {
          commit('SET_STATUS', { label: 'error' })
          reject(error?.description || error)
        }
      })
    },

    /**
     * Adds item(s) to the cart.
     * @param {Array} items - Items to add to cart.
     * @param {Number} items[].id - Item variant ID.
     * @param {Object} [items[].properties] - Object of key: value pairs of
     * properties to add.
     * @param {Number} items[].quantity - Quantity to add.
     * @returns {Promise}
     */
    addItem({ commit, dispatch }, items) {
      return new Promise(async(resolve, reject) => {
        try {
          commit('SET_STATUS', {
            items: items.map((item) => item.id),
            label: 'adding',
          })

          const response = await dispatch('actionCartUpdate', {
            action: 'add',
            body: JSON.stringify({ items }),
          })

          resolve(response)

        } catch (error) {
          reject(error)
        }
      })
    },

    /**
     * Clears the cart of all items.
     * - Cart attributes and cart note are not affected.
     * @returns {Promise}
     */
    clearCart({ commit, dispatch, state }) {
      return new Promise(async(resolve, reject) => {
        try {
          commit('SET_STATUS', {
            items: state.response.items.map((item) => item.key),
            label: 'removing',
          })

          const response = await dispatch('actionCartUpdate', {
            action: 'clear',
          })

          resolve(response)

        } catch (error) {
          reject(error)
        }
      })
    },

    /**
     * Clears cart attributes and note.
     * @returns {Promise}
     */
    clearCartAttributes({ commit, dispatch, state }) {
      return new Promise(async(resolve, reject) => {
        try {
          commit('SET_STATUS', { label: 'updating' })

          const attributes = {}

          Object.keys(state.response.attributes).forEach((key) => {
            attributes[key] = null
          })

          const response = await dispatch('actionCartUpdate', {
            action: 'update',
            body: JSON.stringify({
              attributes,
              note: '',
            }),
          })

          resolve(response)

        } catch (error) {
          reject(error)
        }
      })
    },

    /**
     * Adds new event to history.
     * - Latest event is added to the start of the history array.
     * @param {Object} payload - Action payload.
     * @param {Object} payload.newCart - Updated cart.
     * @param {Object} payload.oldCart - Cart before update.
     */
    setHistory({ commit, state }, { newCart, oldCart }) {
      let action = false

      switch (state.status.label) {
        case 'adding':
          action = 'addToCart'
          break

        case 'removing':
        case 'clearing':
          action = 'removeFromCart'
          break
      }

      if (!action) {
        return
      }

      /**
       * Go through new cart and find new or changed items.
       * - Line item property changes are ignored.
       */
      const items = []

      newCart.items.forEach((newCartItem) => {
        const newItem = { ...newCartItem }

        const oldItem = oldCart.items.find((item) => {
          return item.key === newItem.key
        })

        /**
         * If new item doesn't exist in old cart then it's been added.
         */
        if (!oldItem) {
          items.push(newItem)
          return
        }

        if (oldItem.quantity === newItem.quantity) {
          return
        }

        /**
         * If new item's quantity doesn't match, find the difference and add to
         * items array.
         */
        const difference = newItem.quantity - oldItem.quantity
        newItem.quantity = difference

        items.push(newItem)
      })

      /**
       * Go through old cart and see if any don't exist in new cart.
       * - This means the item has been removed.
       */
      oldCart.items.forEach((oldItem) => {
        const newItem = newCart.items.find((item) => {
          return item.key === oldItem.key
        })

        if (newItem) {
          return
        }

        items.push(oldItem)
      })

      const event = {
        action,
        items,
        totalPriceChange: newCart.total_price - oldCart.total_price,
        totalQuantityChange: newCart.item_count - oldCart.item_count,
      }

      commit('SET_HISTORY', event)
    },

    /**
     * Set cart response after querying cart and custom cart data.
     * - Don't query in storybook as can't access `cart.js`.
     * @param {Boolean} [onHydration] - Setting response from initial site
     * hydration?
     * @returns {Promise}
     */
    setResponse({ commit, dispatch, state }, onHydration = false) {
      if (cnvs.storybook) {
        return null
      }

      /**
       * Query cart.js and extra data from custom cart template.
       */
      const queue = [
        fetch(`${cnvs.routes.cart.js}?no-cache=${new Date().getTime()}`),
        fetch(`${cnvs.routes.cart.url}?view=resource&no-cache=${new Date().getTime()}`),
      ]

      /**
       * Fetch free samples if not already fetched.
       */
      if (!state.freeSamples.list) {
        queue.push(fetchFreeSamples())
      }

      return new Promise(async(resolve, reject) => {
        try {
          const [cartResponse, extraResponse, freeSamplesResponse] = await Promise.all(queue)
          const cart = await cartResponse.json()
          const extra = await extraResponse.json()

          /**
           * Go through each line item and merge extra data.
           */
          const items = cart.items.map((item) => {
            const match = extra.find((extraItem) => {
              return extraItem.key === item.key
            })

            if (!match) {
              return item
            }

            return {
              ...item,
              ...match,
            }
          })

          /**
           * Merge cart items and set state.
           */
          const newCart = {
            ...cart,
            items,
          }

          const oldCart = { ...state.response }

          commit('SET_RESPONSE', newCart)

          /**
           * Update history.
           */
          if (!onHydration) {
            dispatch('setHistory', { newCart, oldCart })
          }

          /**
           * Update status.
           */
          commit('SET_STATUS', {
            label: state.status.label === 'loading' ? 'loaded' : 'updated',
          })

          /**
           * Set free samples if not already set.
           */
          if (freeSamplesResponse) {
            const { title, list } = formatFreeSamples(freeSamplesResponse)

            /**
             * Update freeSamples.
             */
            commit('SET_FREE_SAMPLES', { title, list })
          }

          resolve()

        } catch (error) {
          reject(error)
          cnvs.ReportError('Failed to set cart response', error)
        }
      })
    },

    /**
     * Set cart response manually from story.
     * - Should only be used by cart-based stories.
     * @param {Object} response - Manually formatted cart response.
     */
    setStoryResponse({ commit }, response) {
      commit('SET_RESPONSE', response)
    },

    /**
     * Set status of cart manually from story.
     * - Should only be used by cart-based stories.
     * @param {Object} payload - Action payload.
     * @param {Array} payload.items - Array of item keys being updated.
     * @param {String} payload.label - Status description, can be `loading`,
     * `loaded`, `adding`, `removing`, `clearing`, `updating`, `updated`, or
     * `error`.
     */
    setStoryStatus({ commit }, payload) {
      commit('SET_STATUS', payload)
    },

    /**
     * Updates cart attributes and note.
     * @param {Object} payload - Action payload.
     * @param {Object} [payload.attributes] - Attributes to set.
     * @param {String} [payload.note] - Cart note to set.
     * @returns {Promise}
     */
    updateCartAttributes({ commit, dispatch }, payload) {
      return new Promise(async(resolve, reject) => {
        try {
          commit('SET_STATUS', { label: 'updating' })

          const response = await dispatch('actionCartUpdate', {
            action: 'update',
            body: JSON.stringify(payload),
          })

          resolve(response)

        } catch (error) {
          reject(error)
        }
      })
    },

    /**
     * Updates item(s) in the cart.
     * - Uses /cart/change.js request to only affect items currently in cart.
     * - Item key can be provided directly as a string to remove it.
     * - Or an array of objects each containing id and either properties or
     *   quantity to update the item.
     * @param {Array|String} payload - Action payloads or item key.
     * @param {String} payload[].id - Item key to update.
     * @param {Object} [payload[].properties] - Item properties to update.
     * @param {Number} [payload[].quantity] - Quantity to change item to.
     * @returns {Promise}
     */
    updateItem({ commit, dispatch, state }, payload) {
      let body = ''
      let items = []
      let label = ''

      /**
       * Handle string (removes item).
       */
      if (typeof payload === 'string') {
        body = [{ id: payload, quantity: 0 }]
        items = [payload]
        label = 'removing'

      /**
       * Handle array.
       */
      } else {
        const status = []

        body = payload.map((object) => {
          const { id, properties } = object
          let { quantity } = object
          const field = typeof id === 'string' ? 'key' : 'id'

          /**
           * Find line item being updated.
           * - To find the key of the line item no matter what is passed.
           */
          const lineItem = state.response.items.find((item) => {
            return item[field] === id
          })

          /**
           * Add status to array based on quantity.
           */
          if (typeof quantity === 'number') {
            if (quantity > lineItem.quantity) {
              status.push('adding')
            } else if (quantity < lineItem.quantity) {
              status.push('removing')
            }
          }

          items.push(lineItem.key)

          /**
           * If no quantity then set to current line item quantity.
           * - If other line item has matching properties and id then sum
           *   quantity.
           * - Adds compatibility for when id is id, rather than key.
           */
          if (typeof quantity !== 'number') {
            status.push('updating')

            const matchingItem = state.response.items.find((item) => {
              return (
                item.id === lineItem.id &&
                item.properties === properties
              )
            })

            if (matchingItem) {
              quantity = lineItem.quantity + matchingItem.quantity
            } else {
              quantity = lineItem.quantity
            }
          }

          return { id, properties, quantity }
        })

        /**
         * Go through all statuses to see if they're the same.
         * - Set label if they're all the same.
         * - Set label to `updating` if mixed status.
         */
        const uniqueStatus = []

        status.forEach((statusState) => {
          if (uniqueStatus.includes(statusState)) {
            return
          }

          uniqueStatus.push(statusState)
        })

        label = uniqueStatus.length > 1 ? 'updating' : uniqueStatus[0]
      }

      /**
       * Action cart update.
       */
      return new Promise(async(resolve, reject) => {
        try {
          commit('SET_STATUS', { items, label })

          const response = []
          const queueLength = [...body].length

          for (let index = 0; index < queueLength; index++) {
            if (index) {
              // eslint-disable-next-line no-await-in-loop
              await new Promise((timeoutResolve) => {
                setTimeout(() => {
                  timeoutResolve()
                }, 1000)
              })
            }

            const item = body.shift()

            // eslint-disable-next-line no-await-in-loop
            const itemResponse = await dispatch('actionCartUpdate', {
              action: 'change',
              body: JSON.stringify(item),
              itemsLeft: body.length,
            })

            response.push(itemResponse)
          }

          resolve(response)

        } catch (error) {
          reject(error)
        }
      })
    },

    freeSamplesHandler({ dispatch, state }) {
      if (state.freeSamples.status === 'loading') {
        return
      }

      const cartItems = state?.response?.items
      const freeSamplesList = state?.freeSamples?.list

      const freeProductsIds = freeSamplesList.map((product) => {
        return product.variants.find(variant => variant.available)?.id
      })

      /**
       * If there are no free samples or if there are no available free samples,
       * return early.
       */
      if (!freeProductsIds.length) {
        return
      }

      /* eslint-disable no-underscore-dangle */
      const gift = cartItems
        .find(item => freeProductsIds.includes(item.id) && item.properties?._gift)

      const nonGifts = cartItems.filter((item) => !item.properties?._gift)
      /* eslint-enable no-underscore-dangle */

      dispatch('setFreeSamplesStatus', 'loading')

      if (gift && nonGifts?.length === 0) {

        /**
         * Remove free sample gift if there are no non-gift items left in the
         * cart
         */
        dispatch('updateItem', gift.key)
      } else if (!gift && nonGifts?.length > 0) {

        /**
         * If there is no gift in the cart yet, add the first gift to the cart.
         */
        dispatch('addItem', [
          {
            id: freeProductsIds[0],
            properties: {
              _gift: true,
            },
            quantity: 1,
          },
        ])
      }

      dispatch('setFreeSamplesStatus', 'done')
    },

    /**
     * Sets cart freeSamples status.
     * @param {String} freeSamplesStatus new state for freeSamples
     */
    setFreeSamplesStatus({ commit }, freeSamplesStatus) {
      commit('SET_FREE_SAMPLES_STATUS', freeSamplesStatus)
    },
  },
}
