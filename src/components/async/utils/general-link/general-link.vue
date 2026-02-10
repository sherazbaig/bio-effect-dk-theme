<template>
  <div class="general-link">
    <a
      class="general-link__link"
      :class="hover ? 'general-link__link--hover' : ''"
      :href="url"
      :target="target"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      {{ text }}

      <link-arrow />
    </a>
  </div>
</template>

<script>

import LinkArrow from '~icons/directional-navigation/link-arrow.svg'

/**
 * Vue: General link (general-link)
 * -----------------------------------------------------------------------------
 * Link component to used in project.
 *
 */
export default {
  name: 'GeneralLink',

  components: {
    LinkArrow,
  },

  props: {
    text: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '_blank',
    },
  },

  data() {
    return {
      hover: false,
    }
  },
}
</script>

<style lang="scss">
  @import './general-link';
</style>
