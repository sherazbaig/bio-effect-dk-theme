<template>
  <component
    :is="cardData.url ? 'a' : 'div'"
    :href="cardData.url"
    class="promo-card"
    :class="[
      {
        [$class('loading')]: !cardData,
      }
    ]"
  >
    <responsive-image
      class="promo-card__image"
      :image="cardData.image"
      :lazy-load="false"
      min-max="100-400"
      ratio="1:1"
    />

    <p
      class="promo-card__title text-h5-desktop text-h6"
      v-text="cardData.title"
    />

    <p
      class="promo-card__description text-p-desktop text-mobile-p"
      v-text="cardData.description"
    />
  </component>
</template>

<script>
import ResponsiveImage from '~global/images/responsive-image.vue'

/**
 * Vue: Promo card (promo-card)
 * -----------------------------------------------------------------------------
 * Promo Card - Used as in grid content in plp.
 *
 * @param {Boolean|Object} cardData - data, false shows loading state.
 *
 */
export default {
  name: 'PromoCard',

  components: {
    ResponsiveImage,
  },

  props: {
    cardData: {
      type: [Boolean, Object],
      default: false,
    },
  },
}
</script>

<style lang="scss">
@import './promo-card';
</style>
