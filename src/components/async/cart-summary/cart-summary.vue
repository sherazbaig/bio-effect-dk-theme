<template>
  <div
    class="cart-summary critical-component-clear"
    :class="{ [$class('loading')]: loading }"
  >
    <div
      v-if="totalDiscounts"
      class="cart-summary__discount"
    >
      <p
        class="cart-summary__discountLabel"
      >
        <span
          class="text-h5"
          v-text="$string('cart.summary.discount_label')"
        />
        <icon-tag />
      </p>

      <p
        class="text-h5 cart-summary__discountPrice"
        v-text="$formatMoney(totalDiscounts)"
      />
    </div>

    <div class="cart-summary__total">
      <p
        class="cart-summary__totalLabel"
      >
        <span
          class="text-h5"
          v-text="$string('cart.summary.total_label')"
        />

      </p>

      <p
        class="text-h5 cart-summary__totalPrice"
        v-text="$formatMoney(cart.total_price)"
      />
    </div>

    <div
      v-if="termsEnabled"
      class="cart-summary__terms-and-conditions"
    >
      <checkbox-input
        id="accepts-terms-and-conditions-cart"
        :label="termsLabel"
        :checked="termsChecked"
        :disabled="loading"
        name="customer[accepts_terms-and-conditions-cart]"
        @change="toggleInput"
      />
    </div>

    <btn
      class="cart-summary__submit text-button"
      :disabled="loading || (!termsChecked && termsEnabled)"
      :label="$string('cart.checkout')"
      name="checkout"
      type="submit"
    />
  </div>
</template>

<script>

/**
 * Vue: Cart summary (cart-summary)
 * -----------------------------------------------------------------------------
 * Summary of cart metrics with checkout CTA.
 *
 * @param {Boolean} [loading] - is cart in loading / mutating state.
 * @param {Boolean} termsEnabled - Term and Conditions checkbox enabled or not.
 * @param {String} termsLabel - Label of the Terms and Conditions checkbox.
 *
 */
import { mapState } from 'vuex'

import Btn from '~global/btn/btn'
import IconTag from '~icons/general/tag.svg'
import CheckboxInput from '~async/utils/checkbox-input/checkbox-input.vue'

export default {
  name: 'CartSummary',

  components: {
    Btn,
    IconTag,
    CheckboxInput,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    termsEnabled: {
      type: Boolean,
      default: false,
    },
    termsLabel: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      termsChecked: false,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
    }),

    /**
     * Compute total discounts.
     * - Includes just script discounts.
     * @returns {Number}
     */
    totalDiscounts() {
      let discounts = 0

      this.cart.items.forEach((lineItem) => {
        discounts += lineItem.line_level_total_discount
      })

      return discounts
    },
  },

  methods: {
    toggleInput() {
      this.termsChecked = !this.termsChecked
    },
  },
}
</script>

<style lang="scss">
@import './cart-summary';
</style>
