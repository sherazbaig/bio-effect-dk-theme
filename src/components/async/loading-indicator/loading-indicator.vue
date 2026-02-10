<template>
  <span class="loading-indicator">
    <span class="loading-indicator__line" />
    <span v-text="$string('cart.line_item.loading')" />
  </span>
</template>

<script>

/**
 * Vue: Loading indicator (loading-indicator)
 * -----------------------------------------------------------------------------
 * Displays loading indicator.
 *
 */

export default {
  name: 'LoadingIndicator',
}
</script>

<style lang="scss">
@import './loading-indicator';
</style>
