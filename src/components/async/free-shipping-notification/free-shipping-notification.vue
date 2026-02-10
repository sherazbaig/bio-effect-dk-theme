<template>
  <div class="free-shipping-notification">
    <div class="free-shipping-notification__track">
      <div
        class="free-shipping-notification__progress"
        :style="{width: `${percentage}%`}"
      />
    </div>

    <p
      class="free-shipping-notification__message text-p"
      v-text="title"
    />
  </div>
</template>

<script>

/**
 * Vue: Free shipping notification (free-shipping-notification)
 * -----------------------------------------------------------------------------
 * Free Shipping Notification snippet that takes in a threshold and displays
 * a progress bar for how far away the user is from receiving free shipping.
 *
 */
import { mapState } from 'vuex'

export default {
  name: 'FreeShippingNotification',

  components: {
  },

  props: {
    freeShippingThreshold: {
      type: Number,
      default: 0,
    },
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
    }),

    /**
     * Compute amount to spend before meeting set threshold.
     * @returns {Number}
     */
    amountToSpend() {
      return this.freeShippingThreshold - this.cart.total_price
    },

    /**
     * Compute percentage of threshold spent.
     * - Percentage can never be below or above 0/100
     * @returns {Number}
     */
    percentage() {
      const percentage = (this.cart.total_price / this.freeShippingThreshold) * 100

      if (percentage > 100) {
        return 100
      }

      if (percentage < 0) {
        return 0
      }

      return percentage
    },

    /**
     * Compute title.
     * - Check amount left to spend before reaching set threshold.
     * - Display success message if met.
     * - If it isn't then show amount left to spend message.
     * @returns {String}
     */
    title() {
      if (this.amountToSpend <= 0) {
        return this.$string('cart.free_shipping_notification.title_successful')
      }

      const amount = this.$formatMoney(this.amountToSpend)
      const options = { replace: { amount } }

      return this.$string('cart.free_shipping_notification.title_amount_to_spend', options)
    },
  },
}
</script>

<style lang="scss">
@import './free-shipping-notification';
</style>
