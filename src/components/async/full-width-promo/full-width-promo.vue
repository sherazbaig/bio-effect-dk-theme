<template>
  <div
    class="full-width-promo"
    :class="[
      {
        [$class('loading')]: !cardData,
      }
    ]"
  >
    <art-direction
      :image="cardData.imageMobile"
      :image-desktop="cardData.imageDesktop"
      ratio="343:283"
      ratio-desktop="1170:541"
    />

    <div
      class="full-width-promo__copy"
      :class="[cardData.theme, cardData.alignment]"
    >
      <h2
        v-if="!cardData || cardData.title"
        class="full-width-promo__title text-h2-desktop text-mobile-titles"
        v-text="cardData.title"
      />

      <p
        v-if="!cardData || cardData.description"
        class="full-width-promo__description text-p-desktop text-mobile-p"
        v-text="cardData.description"
      />

      <btn
        v-if="!(cardData && (!cardData.ctaText || !cardData.ctaURL))"
        class="full-width-promo__cta text-button"
        :label="cardData.ctaText"
        :url="cardData.ctaURL"
      />
    </div>
  </div>
</template>

<script>

/**
 * Vue: Full width promo (full-width-promo)
 * -----------------------------------------------------------------------------
 * Full Width Promo - Used as in grid content in plp.
 *
 * @param {Boolean|Object} cardData - data, false shows loading state.
 */
import ArtDirection from '~global/images/art-direction'
import Btn from '~global/btn/btn'

export default {
  name: 'FullWidthPromo',

  components: {
    ArtDirection,
    Btn,
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
@import './full-width-promo';
</style>
