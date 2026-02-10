<template>
  <div class="cart-drawer critical-component-hide">
    <free-shipping-notification
      v-if="showFreeShipping"
      :free-shipping-threshold="liquid.freeShippingThreshold"
    />

    <form
      v-if="cart.item_count > 0 || cartStatus.label === 'adding'"
      class="cart-drawer__form"
      :action="$variable('routes.cart.url')"
      method="post"
    >
      <div
        class="cart-drawer__line-items"
        js-overlay="scrollElement"
      >
        <div
          v-if="loading"
          class="cart-drawer__loading"
        >
          <loading-indicator />
        </div>

        <free-gift-with-purchase-list
          v-if="showThresholdFGWP"
          :free-gifts="freeGiftWithPurchase.gifts"
          :threshold="freeGiftWithPurchase.threshold"
        />

        <div
          class="cart-drawer__line-items--body"
          :class="{ [$class('loading')]: loading }"
        >
          <template
            v-for="lineItem of cartItems"
            :key="getCartItemKey(lineItem)"
          >
            <line-item
              v-if="!lineItem.properties?.['_gift']"
              class="cart-drawer__line-item"
              :line-item="lineItem"
            />

            <free-gift-with-purchase-list
              v-if="checkGiftForItemApplicable(lineItem) && lineItem.fgwp"
              :free-gifts="lineItem.fgwp"
              :attached-variant-id="lineItem.variant_id"
            />
          </template>

          <free-samples
            class="cart-drawer__freeSamples"
            :loading="loading"
          />

          <div
            class="cart-drawer__details"
            :class="{ [$class('loading')]: loading }"
          >
            <table class="cart-drawer__details-table">
              <tbody>
                <tr>
                  <th
                    class="text-p-small"
                    scope="row"
                    v-text="$string('cart.details.priceLabel')"
                  />
                  <td
                    class="text-button"
                    v-text="$formatMoney(cart.total_price)"
                  />
                </tr>
                <tr v-if="liquid.taxLineEnabled">
                  <th
                    class="text-p-small"
                    scope="row"
                    v-text="$string('cart.details.taxLabel')"
                  />
                  <td
                    class="text-button"
                    v-text="$string('cart.details.taxMessage')"
                  />
                </tr>
                <tr>
                  <th
                    class="text-p-small"
                    scope="row"
                    v-text="$string('cart.details.shippingLabel')"
                  />
                  <td
                    class="text-button"
                    v-text="$string('cart.details.shippingMessage')"
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <cart-summary
        v-if="cart.item_count > 0"
        class="cart-drawer__footer"
        :loading="loading"
        :terms-enabled="liquid.termsEnabled"
        :terms-label="liquid.termsLabel"
      />
    </form>

    <div
      v-else
      class="cart-drawer__empty"
    >
      <p
        class="text-h6"
        v-text="$string('cart.empty.drawer_text')"
      />

      <btn
        class="cart-drawer__close text-button"
        :label="$string('cart.empty.continue_shopping')"
        name="checkout"
        type="button"
        @click="toggleModal"
      />
    </div>
  </div>
</template>

<script>

/**
 * Vue: Cart drawer (cart-drawer)
 * -----------------------------------------------------------------------------
 * Displays contents of cart.
 *
 * @param {Object} liquid - Free shipping and T&C settings Liquid object.
 * @param {Object} overlay - Overlay API.
 *
 */
import { mapActions, mapState } from 'vuex'

import CartSummary from '~async/cart-summary/cart-summary'
import LineItem from '~async/line-item/line-item'
import FreeGiftWithPurchaseList from '~async/free-gift-with-purchase-list/free-gift-with-purchase-list'
import Btn from '~global/btn/btn'
import LoadingIndicator from '~async/loading-indicator/loading-indicator'
import FreeShippingNotification from '~async/free-shipping-notification/free-shipping-notification'
import FreeSamples from '~async/free-samples/free-samples'

export default {
  name: 'CartDrawer',

  components: {
    CartSummary,
    LineItem,
    FreeGiftWithPurchaseList,
    Btn,
    LoadingIndicator,
    FreeShippingNotification,
    FreeSamples,
  },

  props: {
    liquid: {
      type: Object,
      default: () => ({
        freeShippingEnabled: false,
        freeShippingThreshold: 0,
        termsEnabled: false,
        termsLabel: '',
        taxLineEnabled: false,
      }),
    },
    overlay: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      // State where cart data change.
      cartMutatingStates: ['loading', 'adding', 'removing', 'clearing', 'updating'],
      freeGiftWithPurchase: false,
      showThresholdFGWP: false,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
      cartStatus: (state) => state.cart.status,
      freeSamples: (state) => state.cart.freeSamples,
    }),

    /**
     * Compute cart items.
     * - For each item that is being added, check if it's already in the cart.
     * - Check against key (if adding from cart) or id (if adding from other).
     * - If it isn't then add a false item to act as a loading placeholder.
     * @returns {Array}
     */
    cartItems() {
      if (this.cartStatus.label !== 'adding') {
        return this.cart.items
      }

      const placeholders = []

      this.cartStatus.items.forEach((addedItem) => {
        const match = this.cart.items.find((cartItem) => {
          const cartItemProperty = typeof addedItem === 'string'
            ? cartItem.key
            : cartItem.id

          return cartItemProperty === addedItem
        })

        if (match) {
          return
        }

        const gift = this.freeSamples.list
          .find(product => {
            const availableVariant = product.variants.find(variant => variant.available)
            return availableVariant.id === addedItem
          })

        // Do not add loading placeholder for gift.
        if (gift) {
          return
        }

        placeholders.push(false)
      })

      return [
        ...placeholders,
        ...this.cart.items,
      ]
    },

    /**
     * Compute is cart is in loading / mutating state.
     * @returns {Boolean}
     */
    loading() {
      return this.cartMutatingStates.includes(this.cartStatus.label || '')
    },

    /**
     * Showing free shipping bar conditions
     */
    showFreeShipping() {
      return !this.showThresholdFGWP &&
        this.liquid.freeShippingEnabled && (this.cart.item_count > 0 || this.cartStatus.label === 'adding')
    },
  },

  watch: {

    /**
     * Watch cart items to update focus trap.
     */
    'cart.items'() {
      if (!this.overlay.isActive) {
        return
      }

      this.overlay.update({ currentElement: document.activeElement })
      this.setThresholdGiftData()
      this.checkThresholdApplicable()
      this.removeFreeGiftOnCartChange()
    },
  },

  mounted() {
    if (!this.overlay.isActive) {
      return
    }

    this.overlay.update()
    this.setThresholdGiftData()
    this.checkThresholdApplicable()
    this.removeFreeGiftOnCartChange()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      toggleOverlay: 'overlays/toggle',
      removeItem: 'cart/updateItem',
      updateItem: 'cart/updateItem',
    }),

    /**
     * Toggle Modal.
     */
    toggleModal() {
      this.toggleOverlay({
        ignoreDismissed: true,
        namespace: 'cartDrawer',
      })
    },

    /**
     * Get cart item key.
     * @param {Object} item - Line item.
     * @param {Number} index - Line item index.
     * @returns {String}
     */
    getCartItemKey(item, index) {
      if (!item) {
        return `cart-line-item-loading-${index}`
      }

      return `cart-line-item-${item.key}`
    },

    /**
     * Shopify section editor select event.
     */
    shopifySectionSelect() {
      this.overlay.open({
        component: 'cart-drawer',
        ignoreDismissed: true,
      })
    },

    /**
     * Shopify section editor deselect event.
     */
    shopifySectionDeselect() {
      this.overlay.close()
    },

    setThresholdGiftData() {
      if (window.cnvs.fgwp.threshold?.length) {
        if (window.cnvs.fgwp.threshold.length > 2) {
          window.cnvs.fgwp.threshold = window.cnvs.fgwp.threshold.slice(0, 2)
        }

        window.cnvs.fgwp.threshold.sort((a, b) => a - b)

        const giftsTempStorage = window.cnvs.fgwp.gifts

        this.freeGiftWithPurchase = { ...window.cnvs.fgwp }
        this.freeGiftWithPurchase.gifts =
          (giftsTempStorage || []).filter((gift) => {
            return !this.cart.items.some((item) => {
              return gift.id === item.id
            })
          })
      }
    },

    checkThresholdApplicable() {
      const thresholdData = this.freeGiftWithPurchase.threshold

      if (!thresholdData?.length) {
        return
      }

      const doubleThresholdRemove = this.shouldDoubleThresholdBeRemoved()
      const singleThresholdRemove = this.shouldSingleThresholdBeRemoved()
      let thresholdItemInBasket = 0

      if (this.thresholdData?.length) {
        this.showThresholdFGWP = false
      }

      if (doubleThresholdRemove || singleThresholdRemove) {
        this.removeThresholdItems()
      } else {
        this.cart.items.forEach((item) => {
          const { _is_threshold_item: isThresholdItem } = item.properties || {}

          if (isThresholdItem) {
            thresholdItemInBasket += 1
          }

          return isThresholdItem
        })
      }

      const thresholdPointsExist = (thresholdData || []).length
      const thresholdGiftsExist = (this.freeGiftWithPurchase.gifts || []).length

      this.showThresholdFGWP =
        !(thresholdItemInBasket === thresholdPointsExist) &&
        thresholdPointsExist &&
        thresholdGiftsExist
    },

    /**
     * Check if double threshold items should be removed
     */
    shouldDoubleThresholdBeRemoved() {
      const thresholdData = this.freeGiftWithPurchase.threshold
      const thresholdItemCountInCart = this.getThresholdItemCount()
      const isThresholdLessCartValue =
        thresholdData[thresholdData.length - 1] > this.cart.total_price / 100

      return thresholdItemCountInCart === 2 &&
        thresholdData.length > 1 &&
        isThresholdLessCartValue
    },

    /**
     * Check if single threshold item should be removed
     */
    shouldSingleThresholdBeRemoved() {
      const thresholdData = this.freeGiftWithPurchase.threshold
      const thresholdItemCountInCart = this.getThresholdItemCount()
      const isThresholdLessCartValue = thresholdData[0] > this.cart.total_price / 100

      return thresholdItemCountInCart === 1 &&
        thresholdData.length > 0 &&
        isThresholdLessCartValue
    },

    getThresholdItemCount() {
      let thresholdItemCount = 0

      this.cart.items.forEach((item) => {
        const { _is_threshold_item: isThresholdItem } = item.properties || {}

        if (isThresholdItem) {
          thresholdItemCount += 1
        }
      })

      return thresholdItemCount
    },

    /**
     * Remove gift items set by threshold
     */
    async removeThresholdItems() {
      const gifts = this.cart?.items
        // eslint-disable-next-line no-underscore-dangle
        .filter(item => item.properties?._is_threshold_item)

      const removeQueries = gifts.map((item) => {
        return {
          id: item.key,
          quantity: 0,
        }
      })

      await this.removeItem(removeQueries)
    },

    checkGiftForItemApplicable(item) {
      return !this.cart.items.some((cartItem) => {
        // eslint-disable-next-line no-underscore-dangle
        return cartItem.properties?._parent_variant === item.variant_id
      })
    },

    /**
     * Remove gift item related to a product in cart
     */
    removeFreeGiftOnCartChange() {
      // Do not run if cart still updating.
      if (this.loading) {
        return
      }

      this.cart.items.forEach(async item => {
        const giftItemParent = this.cart.items.find((itemInner) => {
          // eslint-disable-next-line no-underscore-dangle
          return itemInner.variant_id === item.properties?._parent_variant
        })

        // eslint-disable-next-line no-underscore-dangle
        if (item.properties?._is_fgwp && !item.properties?._is_threshold_item &&
          !giftItemParent) {
          await this.removeItem(item.key)
        }

        if (
          // eslint-disable-next-line no-underscore-dangle
          item.properties?._is_fgwp &&
          giftItemParent &&
          item.quantity !== giftItemParent.quantity
        ) {
          await this.updateItem([
            {
              id: item.key,
              quantity: giftItemParent.quantity,
            },
          ])
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import './cart-drawer';
</style>
