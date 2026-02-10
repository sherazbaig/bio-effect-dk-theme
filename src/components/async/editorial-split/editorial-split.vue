<template>
  <div />
</template>

<script>

/**
 * Vue: Editorial split (editorial-split)
 * -----------------------------------------------------------------------------
 * Editorial split (50/50) block with text and image.
 * - Static section.
 * @param {String} sectionId - Section ID.
 *
 */
import video from '~/components/video'

export default {
  name: 'EditorialSplit',

  props: {
    sectionId: {
      type: String,
      required: true,
    },
  },

  mounted() {
    video().init(this.sectionId)
  },
}
</script>

<style lang="scss">
@import './editorial-split';
</style>
