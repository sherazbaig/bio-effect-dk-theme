<template>
  <div
    class="line-item"
    :class="{
      [$class('loading')]: !lineItem,
      [$class('updating')]: state === 'updating',
    }"
  >
    <div class="line-item__grid">
      <div class="line-item__image-container">
        <responsive-image
          class="line-item__image"
          :image="lineItem.featured_image"
          lazy-load
          min-max="95-130"
          ratio="1:1"
          sizes="(min-width: 1024px) 99px, 95px"
        />
      </div>

      <div class="line-item__details">
        <div class="line-item__titles">
          <a
            class="
              line-item__title
              text-p-bold
            "
            :href="lineItem.url"
            v-text="lineItem.product_title"
          />

          <p
            v-if="!lineItem.product_has_only_default_variant || lineItem.gift_card"
            class="
              line-item__variant
              text-tags
            "
            v-text="variantText"
          />
        </div>

        <div
          v-if="lineItem.fgwp"
          class="line-item__fgwp"
        >
          <p
            class="text-tags"
            v-text="$string('cart.free_gift_with_purchase.fgwp')"
          />
        </div>

        <quantity-selector
          v-if="!lineItem.properties?._is_fgwp"
          class="line-item__quantity-selector"
          :line-item="lineItem"
          :quantity="quantity"
          :state="state"
          :min="1"
          @update-quantity="handleQuantityUpdate"
        />
      </div>

      <product-prices
        v-if="!lineItem.properties?._is_fgwp"
        class="line-item__total"
        class-price="text-mobile-p-bold"
        price-first
        :price="lineItem?.final_line_price"
        class-compare-at-price="text-p-xs-bold"
        :compare-at-price="lineItem?.compare_at_line_price || false"
        :original-line-price="lineItem?.original_line_price || false"
        aria-labelledby="total-title"
      />

      <product-prices
        v-else
        class="line-item__total line-item__free-tag-total"
        class-price="text-mobile-p-bold line-item__free-tag"
        :price="lineItem?.final_line_price"
        class-compare-at-price="text-p-xs-bold"
        :compare-at-price="0"
        :original-line-price="lineItem?.original_line_price || false"
        aria-labelledby="total-title"
      />

      <button
        class="line-item__remove text-p-small"
        :class="{ [$class('disabled')]: state === 'updating' }"
        type="button"
        @click="handleRemove"
        v-text="$string('cart.line_item.remove')"
      />
    </div>
  </div>
</template>

<script>

/**
 * Vue: Line item (line-item)
 * -----------------------------------------------------------------------------
 * Displays line items cart drawer.
 *
 * @param {Boolean|Object} lineItem - Line item in cart response.
 *
 */
import { mapActions, mapState } from 'vuex'

import ProductPrices from '~global/product-prices/product-prices'
import QuantitySelector from '~async/quantity-selector/quantity-selector'
import ResponsiveImage from '~global/images/responsive-image'

export default {
  name: 'LineItem',

  components: {
    ProductPrices,
    QuantitySelector,
    ResponsiveImage,
  },

  props: {
    lineItem: {
      type: [Boolean, Object],
      default: false,
      required: true,
    },
  },

  data() {
    return {
      quantity: 1,
      state: 'loading',
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cartStatus: (state) => state.cart.status,
    }),

    /**
     * Compute compare at price.
     * - Uses compare at price if it exists.
     * - Otherwise if script discount has been applied use original price.
     * - This way it always shows the largest original price.
     * - Otherwise show no compare at price.
     * @returns {Number|Boolean}
     */
    compareAtPrice() {
      if (this.lineItem?.compare_at_price) {
        return this.lineItem?.compare_at_price
      }

      if (this.lineItem?.original_price !== this.lineItem?.final_price) {
        return this.lineItem?.original_price
      }

      return false
    },

    /**
     * Compute if line item is limited by inventory quantity.
     * @returns {Boolean}
     */
    limitedInventory() {
      return (
        this.lineItem.inventory_management &&
        this.lineItem.inventory_policy === 'deny'
      )
    },

    /**
     * Compute variant text.
     * @returns {String}
     */
    variantText() {
      if (this.lineItem.gift_card) {
        return this.$formatMoney(this.lineItem.original_price)
      }

      if (!this.lineItem.options_with_values) {
        return this.lineItem.variant_title
      }

      return this.lineItem.options_with_values.map((option) => {
        return option.value
      }).join(' / ')
    },
  },

  watch: {

    /**
     * Watch cart status items to see if item is being updated.
     */
    'cartStatus.items'() {
      if (this.cartStatus.items.includes(this.lineItem.key)) {
        this.state = 'updating'
        return
      }

      this.state = 'ready'
    },

    /**
     * Watch item quantity to update quantity if updated elsewhere.
     */
    'lineItem.quantity'() {
      this.quantity = this.lineItem.quantity
    },
  },

  mounted() {
    this.state = 'ready'
    this.quantity = this.lineItem.quantity
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      updateItem: 'cart/updateItem',
      removeItem: 'cart/updateItem',
    }),

    /**
     * Handle quantity update event.
     * @param {String} quantity - New quantity.
     */
    async handleQuantityUpdate(quantity) {
      this.quantity = quantity

      try {
        this.state = 'updating'

        await this.updateItem([
          {
            id: this.lineItem.key,
            quantity: this.quantity,
          },
        ])

        this.state = 'ready'

      } catch (error) {
        this.quantity = this.lineItem.quantity
        this.state = 'error'
      }
    },

    /**
     * Handle remove click.
     */
    handleRemove() {
      if (this.state === 'updating') {
        return
      }

      this.removeItem(this.lineItem.key)
    },
  },
}
</script>

<style lang="scss">
@import './line-item';
</style>
