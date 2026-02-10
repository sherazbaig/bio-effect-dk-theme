<template>
  <div
    class="quantity-selector"
    :class="{
      'quantity-selector--large': large,
      [$class('error')]: state === 'error',
    }"
  >
    <div class="quantity-selector__control quantity-selector__control--button">
      <button
        class="quantity-selector__button"
        :class="{ [$class('disabled')]: disableDecrease }"
        type="button"
        :disabled="disableDecrease"
        @click="handleQuantityUpdate('decrease')"
      >
        <span
          class="visually-hidden"
          v-text="$string('cart.line_item.decrease_quantity')"
        />

        <icon-minus-round />
      </button>
    </div>

    <div class="quantity-selector__control quantity-selector__control--input">
      <label
        class="visually-hidden"
        :for="`quantity-selector-input-${lineItem ? lineItem.key : 'product'}`"
        v-text="$string('cart.line_item.quantity')"
      />

      <input
        :id="`quantity-selector-input-${lineItem ? lineItem.key : 'product'}`"
        class="quantity-selector__input"
        :name="name"
        pattern="[0-9]*"
        readonly
        tabindex="-1"
        type="number"
        :value="quantity"
      >
    </div>

    <div class="quantity-selector__control quantity-selector__control--button">
      <button
        class="quantity-selector__button"
        :class="{ [$class('disabled')]: disableIncrease }"
        type="button"
        :disabled="disableIncrease"
        @click="handleQuantityUpdate('increase')"
      >
        <span
          class="visually-hidden"
          v-text="$string('cart.line_item.increase_quantity')"
        />

        <icon-plus-round />
      </button>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Quantity selector
 * -----------------------------------------------------------------------------
 * Base template and functionality for quantity selector.
 * - Used in product form and line item.
 * - Responsible for emitting events to update quantity, parent components must
 *   action the update.
 *
 * @param {Boolean} [large] - Large styles.
 * @param {Object} [lineItem] - Line item object.
 * @param {Number} [min] - The minimum value the selector can be.
 * @param {Number} quantity - Actual line item quantity selector value as
 * reflected in Shopify's data.
 * @param {String} state - Parent component state.
 *
 * @emits updateQuantity - Emit new quantity value.
 *
 */
import IconMinusRound from '~icons/directional-navigation/minus-round.svg'
import IconPlusRound from '~icons/directional-navigation/plus-round.svg'

export default {
  name: 'QuantitySelector',

  components: {
    IconMinusRound,
    IconPlusRound,
  },

  props: {
    large: {
      type: Boolean,
      default: false,
    },
    lineItem: {
      type: [Boolean, Object],
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    state: {
      type: String,
      default: 'loading',
      required: true,
    },
  },

  emits: {
    'update-quantity': (payload) => typeof payload === 'number',
  },

  data() {
    return {
      localQuantity: 1,
    }
  },

  computed: {

    /**
     * Compute if decrease button should be disabled.
     * @return {Boolean}
     */
    disableDecrease() {
      return (
        this.unavailable ||
        this.state === 'updating' ||
        this.state === 'loading' ||
        this.localQuantity <= this.min
      )
    },

    /**
     * Compute if increase button should be disabled.
     * @return {Boolean}
     */
    disableIncrease() {
      const outOfInventory =
        this.lineItem.inventory_management === 'shopify' &&
        this.lineItem.inventory_policy === 'deny' &&
        this.quantity >= this.inventory

      return (
        this.unavailable ||
        this.state === 'updating' ||
        this.state === 'loading' ||
        outOfInventory
      )
    },

    /**
     * Compute inventory.
     * - Returns 0 if no limit.
     * @returns {Number}
     */
    inventory() {
      return this.lineItem?.inventory_quantity || 0
    },

    /**
     * Compute input name.
     * @return {String}
     */
    name() {
      if (this.lineItem?.key) {
        return 'updates[]'
      }

      return 'quantity'
    },

    /**
     * Compute unavailable.
     * - If object has avaiable = false and no quantity, means it's unavailable
     *   on the product page.
     * @returns {Boolean}
     */
    unavailable() {
      if (!this.lineItem) {
        return false
      }

      return this.lineItem.available === false && !this.lineItem.quantity
    },
  },

  watch: {

    /**
     * Watch actual quantity to update local quantity.
     */
    quantity() {
      this.localQuantity = this.quantity
    },
  },

  mounted() {
    this.localQuantity = this.quantity || 1
  },

  methods: {

    /**
     * Handle quantity selector update.
     * - Buttons only update local quantity which emits an event.
     * - If the event is successful then the quantity prop is updated and this
     *   is used for front-end display.
     * @param {String} type - `decrease` or `increase`.
     */
    handleQuantityUpdate(type) {
      if (
        this.state === 'updating' ||
        (type === 'decrease' && this.disableDecrease) ||
        (type === 'increase' && this.disableIncrease)
      ) {
        return
      }

      if (type === 'decrease') {
        this.localQuantity--
      } else {
        this.localQuantity++
      }

      this.$emit('update-quantity', this.localQuantity)
    },
  },
}
</script>

<style lang="scss">
@import './quantity-selector';
</style>
