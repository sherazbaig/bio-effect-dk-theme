<script>

/**
 * Vue: Yotpo reviews widget (reviews-widget)
 * -----------------------------------------------------------------------------
 * Shows product reviews widget (Powered by Yotpo).
 * - Static section.
 *
 */
export default {
  name: 'ReviewsWidget',

  mounted() {

    /**
     * Make sure review widget is initialized.
     */
    if (window?.yotpoWidgetsContainer?.initWidgets) {
      window.yotpoWidgetsContainer.initWidgets()
    }
  },
}
</script>

<style lang="scss">
@import './reviews-widget';
</style>
