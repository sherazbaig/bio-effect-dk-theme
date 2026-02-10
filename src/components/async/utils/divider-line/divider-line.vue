<template>
  <div
    class="divider-line"
    :class="{
      'divider-line--no-label': !label,
      [$class('dark')]: dark,
      [$class('large')]: large,
    }"
  >
    <template v-if="label">
      <span class="divider-line__element" />

      <span
        class="
          divider-line__label
          text-body-xs-regular
          text-body-s-regular-desktop
          text-center
        "
        v-html="label"
      />

      <span class="divider-line__element" />
    </template>
  </div>
</template>

<script>

/**
 * Vue: Divider line (divider-line)
 * -----------------------------------------------------------------------------
 * Divider line with support for text and dark mode.
 *
 * @param {Boolean} [dark] - Dark mode styles.
 * @param {String} [label] - Divider line label.
 * @param {Boolean} [large] - Large styles.
 *
 */
export default {
  name: 'DividerLine',

  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@import './divider-line';
</style>
