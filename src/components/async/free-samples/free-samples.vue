<template>
  <div
    class="free-samples"
    :class="{ [$class('loading')]: loading }"
  >
    <h6
      class="free-samples__title text-h6"
      v-text="freeSamples.title"
    />

    <div class="free-samples__list">
      <div
        v-for="(product, index) of freeSamples.list"
        :key="index"
        class="free-samples__card"
        :class="{ [$class('active')]: giftIndex == index }"
      >
        <input
          :id="`gift-${index}`"
          type="radio"
          name="gift"
          :value="product.id"
          :checked="giftIndex == index"
          @change="updateSelectedGift(index)"
        >

        <p
          class="text-p-small"
          v-text="product.title"
        />

        <span class="free-samples__indicator" />

        <responsive-image
          class="free-samples__image"
          :image="product.featuredImage"
          lazy-load
          min-max="95-130"
          ratio="12:8"
          sizes="(min-width: 1024px) 99px, 95px"
        />
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Free samples (free-samples)
 * -----------------------------------------------------------------------------
 * Free sample products with purchase.
 *
 * @param {Boolean} loading - Is cart in loading state.
 *
 */
import { mapActions, mapState } from 'vuex'
import ResponsiveImage from '~global/images/responsive-image'

export default {
  name: 'FreeSamples',

  components: {
    ResponsiveImage,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      giftIndex: -1,
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
  },

  watch: {
    'cartStatus.label'() {
      this.setSelectedGiftIndex()
    },
  },

  mounted() {
    this.setSelectedGiftIndex()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      addItem: 'cart/addItem',
      removeItem: 'cart/updateItem',
      updateItem: 'cart/updateItem',
      setFreeSamplesStatus: 'cart/setFreeSamplesStatus',
    }),

    /**
     * Set selected gift index.
     */
    setSelectedGiftIndex() {
      let index = 0
      // eslint-disable-next-line no-underscore-dangle
      const gift = this.cart?.items.find((item) => item.properties?._gift)

      index = this.freeSamples.list
        .findIndex(freeSample => {
          const availableVariant = freeSample.variants.find(variant => variant.available)
          return availableVariant.id === gift?.variant_id
        })

      if (index < 0) {
        index = 0
      }

      this.giftIndex = index
    },

    /**
     * Free sample gift click handler.
     *  - Removes existing gift(s) from cart.
     *  - Adds gift to cart.
     * @param {Number} index - Gift index.
     */
    async updateSelectedGift(index) {
      if (this.freeSamples.status === 'loading') {
        return
      }

      const selectedGift = this.freeSamples.list[index]
      const firstAvailableVariant = selectedGift.variants.find(variant => variant.available)
      const selectedGiftId = firstAvailableVariant.id

      const freeProductsIds = this.freeSamples.list.map((product) => {
        const availableVariant = product.variants.find(variant => variant.available)
        return availableVariant.id
      })

      /* eslint-disable no-underscore-dangle */
      const gifts = this.cart?.items
        .filter(item => freeProductsIds.includes(item.id) && item.properties?._gift)
      /* eslint-enable no-underscore-dangle */

      this.setFreeSamplesStatus('loading')

      if (gifts.length) {
        const removeQueries = gifts.map((gift) => {
          return this.removeItem(gift.key)
        })

        await Promise.all(removeQueries)
      }

      if (selectedGiftId) {
        await this.addItem([
          {
            id: selectedGiftId,
            properties: {
              _gift: true,
            },
            quantity: 1,
          },
        ])
      }

      this.giftIndex = index
      this.setFreeSamplesStatus('done')
    },
  },
}
</script>

<style lang="scss">
@import './free-samples';
</style>
