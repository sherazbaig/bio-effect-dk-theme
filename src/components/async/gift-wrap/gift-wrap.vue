<template>
  <div
    v-if="giftWrap.id"
    class="gift-wrap"
  >
    <p
      class="gift-wrap__title text-p-small"
      v-text="$string('cart.gift_wrap.heading')"
    />

    <button
      class="gift-wrap__item"
      :aria-label="label"
      :class="{ 'selected': isInCart }"
      :disabled="loading"
      type="button"
      @click="toggle"
    >
      <div class="gift-wrap__left-hand">
        <div class="gift-wrap__item-image-container">
          <img
            class="gift-wrap__item-image"
            :src="giftWrap.featured_image.src"
            :alt="giftWrap.featured_image.alt || giftWrap.name"
            loading="lazy"
          >
        </div>

        <div class="gift-wrap__item-titles">
          <p
            class="
            line-item__title
            text-p-bold-desktop
            text-mobile-p-bold
          "
            v-text="giftWrap.name"
          />

          <p
            class="
            line-item__variant
            text-tags
          "
            v-text="$formatMoney(giftWrap.price)"
          />
        </div>
      </div>

      <p
        class="
        gift-wrap__cta
        line-item__title
        text-p-bold-desktop
        text-mobile-p-bold
      "
        v-text="$string('cart.gift_wrap.cta')"
      />
    </button>
  </div>
</template>

<script>

/**
 * Vue: Gift wrap (gift-wrap)
 * -----------------------------------------------------------------------------
 * Optional free gift wrapping tile for cart drawer.
 *
 * @param {Boolean|Object} giftWrap - Gift wrap variant data (id, name, price, featured_image).
 *
 */
import { mapActions, mapState } from 'vuex'

export default {
  name: 'GiftWrap',

  props: {
    giftWrap: {
      type: [Boolean, Object],
      default: false,
    },
  },

  data() {
    return {
      loading: false,
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
     * Whether the gift wrap item is currently in the cart.
     * @returns {Boolean}
     */
    isInCart() {
      // eslint-disable-next-line no-underscore-dangle
      return this.cart.items.some((item) => item.properties?._is_gift_wrap)
    },

    /**
     * Checkbox label.
     * @returns {String}
     */
    label() {
      return this.$string('cart.gift_wrap.label')
    },
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      removeItem: 'cart/updateItem',
    }),

    /**
     * Toggle gift wrap item in cart.
     */
    async toggle() {
      if (!this.giftWrap?.id || this.loading) {
        return
      }

      this.loading = true

      try {
        if (this.isInCart) {
          const giftWrapItem = this.cart.items.find((item) => {
            // eslint-disable-next-line no-underscore-dangle
            return item.properties?._is_gift_wrap
          })

          await this.removeItem({ id: giftWrapItem.key, quantity: 0 })
        } else {
          await this.addItem([
            {
              id: this.giftWrap.id,
              quantity: 1,
              properties: {
                _is_gift_wrap: true,
              },
            },
          ])
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
@import './gift-wrap';
</style>
