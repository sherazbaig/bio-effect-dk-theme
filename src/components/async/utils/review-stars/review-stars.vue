<template>
  <div class="review-stars">
    <div
      v-for="(star, index) of totalRating"
      :key="index"
    >
      <icon-star-filled
        v-if="index < currentRating"
        class="review-stars__icon review-stars__icon--filled"
      />

      <icon-star
        v-else
        class="review-stars__icon"
      />
    </div>
  </div>
</template>

<script>
import IconStar from '~icons/general/star.svg'
import IconStarFilled from '~icons/general/star-filled.svg'

export default {
  name: 'ReviewStars',

  components: {
    IconStar,
    IconStarFilled,
  },

  props: {
    totalRating: {
      type: Number,
      required: true,
    },
    currentRating: {
      type: Number,
      required: true,
    },
  },

}
</script>

<style lang="scss">
@import './review-stars';
</style>
