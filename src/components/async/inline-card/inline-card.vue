<template>
  <a
    :href="cardData.url"
    class="inline-card"
    :class="[
      {
        [$class('loading')]: !cardData,
      }
    ]"
  >
    <ul
      v-if="cardData.badges?.length"
      class="inline-card__badges mb-m"
    >
      <li
        v-for="(badge, index) of cardData.badges"
        :key="`card-badge-${index}`"
        class="inline-card__badge text-tags"
        v-text="badge"
      />
    </ul>
    <h3
      class="inline-card__title text-h5-desktop text-h6 mt-m"
      v-text="cardData.title"
    />
    <p
      class="inline-card__excerpt"
      v-text="cardData.excerpt"
    />
  </a>
</template>

<script>

/**
 * Vue: Inline card (inline-card)
 * -----------------------------------------------------------------------------
 * Inline card component (Used to show products, articles and pages cards).
 *
 * @param {Boolean|Object} cardData - data object, false shows loading state.
 */
export default {
  name: 'InlineCard',

  props: {
    cardData: {
      type: [Boolean, Object],
      default: () => ({
        badges: [''],
        title: '',
        excerpt: '',
      }),
    },
  },
}
</script>

<style lang="scss">
@import './inline-card';
</style>
