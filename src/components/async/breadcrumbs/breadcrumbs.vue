<template>
  <nav
    class="breadcrumbs"
    :class="{ [$class('loading')]: state === 'loading' }"
    :aria-label="$string('general.breadcrumbs.label')"
  >
    <ol class="breadcrumbs__list-element">
      <li
        v-for="(item, index) of items"
        :key="index"
        class="breadcrumbs__list-item"
      >
        <a
          class="breadcrumbs__link text-button-nav"
          :href="item.url"
          v-text="item.title"
        />

        <arrow-head />
      </li>

      <li class="breadcrumbs__list-item">
        <a
          class="breadcrumbs__link text-button-nav"
          aria-current="page"
          href=""
          @click.prevent
          v-text="title"
        />
      </li>
    </ol>
  </nav>
</template>

<script>

/**
 * Vue: Breadcrumbs (breadcrumbs)
 * -----------------------------------------------------------------------------
 * Breadcrumbs navigation links.
 *
 * product is in a collection.
 * @param {String} state - Loading state of parent component.
 * @param {String} title - Title displayed for current page.
 * @param {Array} items - Items to be rendered as categories.
 *
 */

import ArrowHead from '~icons/directional-navigation/arrow-head.svg'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Breadcrumbs',

  components: {
    ArrowHead,
  },

  props: {
    state: {
      type: String,
      default: 'loading',
    },
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
@import './breadcrumbs';
</style>
