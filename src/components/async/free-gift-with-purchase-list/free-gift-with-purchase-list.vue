<template>
  <div
    class="free-gift-with-purchase-list"
    :class="[{ 'threshold-not-reached': !isThresholdReached }]"
  >
    <div
      v-if="threshold"
      class="free-gift-with-purchase-list__title-wrapper-threshold"
    >
      <div class="free-gift-with-purchase-list__threshold-progress-bar">
        <div class="free-gift-with-purchase-list__track">
          <div
            class="free-gift-with-purchase-list__progress"
            :style="{width: `${percentage}%`}"
          />
        </div>

        <div
          v-if="threshold.length > 1"
          class="free-gift-with-purchase-list__progress-prize-one"
          :class=" { 'reached': firstPrizeReached } "
          :style="{left: `calc(${firstPrizePosition}% - 12px)`}"
        >
          <icon-prize />
        </div>
        <div
          class="free-gift-with-purchase-list__progress-prize-two"
          :class=" { 'reached': secondPrizeReached } "
        >
          <icon-prize />
        </div>
      </div>

      <template v-for="(amount, index) of threshold">
        <div
          v-if="index < 2"
          :key="index"
          class="free-gift-with-purchase-list__threshold-check-wrapper"
        >
          <icon-check v-if="index === 0 ? firstPrizeReached : secondPrizeReached" />
          <div
            v-else
            class="free-gift-with-purchase-list__selection-circle"
          />
          <p
            class="free-gift-with-purchase-list__title text-p-small"
            v-text="formattedTitleText(amount, index)"
          />
        </div>
      </template>
    </div>
    <div
      class="free-gift-with-purchase-list__folding-container"
      :class=" { 'folded': productsHidden, } "
    >
      <div
        v-if="!threshold"
        class="free-gift-with-purchase-list__title-wrapper"
      >
        <icon-prize />
        <p
          class="free-gift-with-purchase-list__title text-p-small"
          v-text="$string('cart.free_gift_with_purchase.title')"
        />
      </div>

      <div
        v-else
        class="free-gift-with-purchase-list__selected-count"
      >
        <p
          class="free-gift-with-purchase-list__selected-item-count text-p-small"
          v-text="$string('cart.free_gift_with_purchase.gifts_selected',
                          { replace: {
                            selected: selectedItems.length + giftItemCountInCart,
                            allowed: productAddLimit
                          } })"
        />
      </div>

      <div
        v-if="!shouldCollapseProducts"
        class="free-gift-with-purchase-list__wrapper"
      >
        <button
          v-for="giftItem of freeGifts"
          :key="giftItem.id"
          class="free-gift-with-purchase-list__item"
          :class="{ 'selected': selectedItems.includes(giftItem.id) }"
          type="button"
          @click="selectItem(giftItem.id)"
        >
          <div class="free-gift-with-purchase-list__left-hand">
            <div
              class="free-gift-with-purchase-list__item-image-container"
            >
              <responsive-image
                class="free-gift-with-purchase-list__item-image"
                :image="giftItem.featured_image"
                min-max="95-130"
                ratio="57:78"
                sizes="(min-width: 1024px) 99px, 95px"
              />
            </div>

            <div class="free-gift-with-purchase-list__item-titles">
              <p
                class="
                line-item__title
                text-p-bold-desktop
                text-mobile-p-bold
              "
                v-text="giftItem.name"
              />

              <p
                class="
                line-item__variant
                text-tags
              "
                v-text="$formatMoney(giftItem.price)"
              />
            </div>
          </div>

          <div>
            <div class="free-gift-with-purchase-list__selection-square" />
            <icon-check class="free-gift-with-purchase-list__selection-check" />
          </div>
        </button>
      </div>

      <!--
        <btn
        v-if="false"
        class="free-gift-with-purchase-list__add-button text-button"
        modifiers="secondary center block no-icon"
        :label="$string('cart.free_gift_with_purchase.add_gift')"
        type="button"
        @click="addToCart"
        />
      -->
    </div>

    <div
      v-if="!shouldCollapseProducts"
      class="free-gift-with-purchase-list__buttons-wrapper"
    >
      <btn
        class="free-gift-with-purchase-list__hide-button text-button"
        modifiers="secondary center block no-icon"
        :label="!productsHidden ?
          $string('cart.free_gift_with_purchase.no_thanks') :
          $string('cart.free_gift_with_purchase.reclaim_gift')"
        type="button"
        @click="toggleButton"
      />
    </div>
  </div>
</template>

<script>

/**
 * Vue: Free gift with purchase list (free-gift-with-purchase-list)
 * -----------------------------------------------------------------------------
 * List of items for FGWP.
 *
 */
import ResponsiveImage from '~global/images/responsive-image'
import IconPrize from '~icons/general/prize.svg'
import Btn from '~global/btn/btn'
import IconCheck from '~icons/general/check.svg'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FreeGiftWithPurchaseList',

  components: {
    ResponsiveImage,
    IconPrize,
    Btn,
    IconCheck,
  },

  props: {
    freeGifts: {
      type: [Boolean, Object],
      default: false,
    },
    threshold: {
      type: [Boolean, Object],
      default: false,
    },
    attachedVariantId: {
      type: [Boolean, Number],
      default: false,
    },
  },

  data() {
    return {
      productAddLimit: 1,
      productsHidden: false,
      selectedItems: [],
      firstPrizeReached: false,
      secondPrizeReached: false,
      giftItemCountInCart: 0,
      shouldCollapseProducts: false,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      cart: (state) => state.cart.response,
      cartStateLabel: (state) => state.cart.status.label,
    }),

    /**
     * Compute percentage of threshold spent.
     */
    percentage() {
      const percentage =
        (this.cart.total_price / 100) / this.threshold[this.threshold.length - 1] * 100

      if (percentage > 100) {
        return 100
      }

      if (percentage < 0) {
        return 0
      }

      return percentage
    },

    /**
     * Position of the first prize indicator on threshold bar in percentage
     */
    firstPrizePosition() {
      const percentage = (this.threshold[0] / this.threshold[1]) * 100

      if (percentage > 100) {
        return 100
      }

      if (percentage < 0) {
        return 0
      }

      return percentage
    },

    /**
   * Check if the total price in the cart has reached or exceeded
   * the highest threshold value.
  */
    isThresholdReached() {
      return this.cart.total_price / 100 >= this.threshold[this.threshold.length - 1]
    },
  },

  watch: {

    /**
     * Watch cart items updated checking state label.
     */
    cartStateLabel() {
      if (this.cartStateLabel === 'updated' && this.threshold) {
        this.giftItemCountInCart = this.getThresholdItemCountInCart()
        this.checkPrizesReached()
        this.setProductAddLimit()
        this.shouldCollapseThreshold()
      }
    },
  },

  mounted() {
    if (this.threshold) {
      this.giftItemCountInCart = this.getThresholdItemCountInCart()
      this.checkPrizesReached()
      this.setProductAddLimit()
      this.shouldCollapseThreshold()
    }
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      closeOverlay: 'overlays/close',
    }),

    /**
     * Close/open gift list
     */
    toggleButton() {
      this.productsHidden = !this.productsHidden
    },

    /**
     * Set limit of products to be added based on threshold
     */
    setProductAddLimit() {
      if (this.secondPrizeReached && this.threshold.length > 1) {
        this.productAddLimit = 2

        return
      }

      if (this.firstPrizeReached) {
        this.productAddLimit = 1

        return
      }

      this.productAddLimit = 0
    },

    /**
     * Check if cart total price reached the prize threshold values
     */
    checkPrizesReached() {
      this.firstPrizeReached =
        this.threshold[0] <= this.cart.total_price / 100
      this.secondPrizeReached =
        this.threshold[this.threshold.length - 1] <= this.cart.total_price / 100
    },

    /**
     * Handle click on list item
     */
    selectItem(itemId) {
      if (this.selectedItems.includes(itemId)) {
        this.selectedItems.splice(this.selectedItems.indexOf(itemId), 1)

        return
      }

      if (this.selectedItems.length + this.giftItemCountInCart >= this.productAddLimit) {
        return
      }

      this.selectedItems.push(itemId)
      this.addToCart()
    },

    getThresholdItemCountInCart() {
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
     * Format text for added items indicator labels
     */
    formattedTitleText(price, index) {
      const amount = this.$formatMoney(price * 100)

      if (index === 0) {
        return this.$string(
          'cart.free_gift_with_purchase.first_threshold',
          { replace: { amount } },
        )
      }

      if (index === 1) {
        return this.$string(
          'cart.free_gift_with_purchase.second_threshold',
          { replace: { amount } },
        )
      }

      return ''
    },

    shouldCollapseThreshold() {
      if (!this.secondPrizeReached && this.getThresholdItemCountInCart() === 1) {
        this.shouldCollapseProducts = true

        return
      }

      this.shouldCollapseProducts = false
    },

    /**
     * Handle add to cart click
     */
    async addToCart() {
      if (this.selectedItems.length === 0) {
        return
      }

      this.state = 'adding'
      const item = this.selectedItems.map((id) => {
        const properties = {
          _is_fgwp: true,
        }

        if (this.threshold) {
          // eslint-disable-next-line dot-notation
          properties['_is_threshold_item'] = true
        }

        if (this.attachedVariantId) {
          // eslint-disable-next-line dot-notation
          properties['_parent_variant'] = this.attachedVariantId
        }

        return {
          id,
          quantity: 1,
          properties,
        }
      })

      try {
        await this.addItem(item)

        this.state = 'ready'
        this.selectedItems = []
      } catch (err) {
        this.state = 'error'
      }
    },
  },
}
</script>

<style lang="scss">
@import './free-gift-with-purchase-list';
</style>
