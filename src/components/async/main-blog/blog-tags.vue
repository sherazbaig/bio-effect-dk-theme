<template>
  <div />
</template>

<script>

/**
 * Vue: Blog tags (main-blog)
 * -----------------------------------------------------------------------------
 * Scrolls active blog tag into view.
 *
 */
export default {
  name: 'BlogTags',

  data() {
    return {
      elements: {
        active: false,
        container: false,
      },
      selectors: {
        active: '[js-blog-tags="active"]',
        container: '[js-blog-tags="container"]',
      },
    }
  },

  mounted() {
    this.elements = {
      active: document.querySelector(this.selectors.active),
      container: document.querySelector(this.selectors.container),
    }

    if (!this.elements.container || !this.elements.active) {
      return
    }

    this.scrollActiveIntoView()
  },

  methods: {

    /**
     * Scroll active item into center of view if not visible.
     */
    scrollActiveIntoView() {
      const elementRectangle = this.elements.active.getBoundingClientRect()
      const elementFromViewportLeft = elementRectangle.left

      /**
       * Get offset so active element is scrolled into the centre of view.
       */
      const containerWidth = this.elements.container.offsetWidth
      const elementWidth = this.elements.active.offsetWidth
      const leftOffset = (containerWidth - elementWidth) / 2

      let left = elementFromViewportLeft - leftOffset

      /**
       * If last item then scroll all the way to the right.
       */
      if (this.elements.active.dataset.last) {
        left = this.elements.container.scrollWidth
      }

      if (left < 0) {
        return
      }

      this.elements.container.scroll(left, 0)
    },
  },
}
</script>

<style lang="scss">
@import '~async/utils/selection-tab/selection-tab';
@import './blog-tags';
</style>
