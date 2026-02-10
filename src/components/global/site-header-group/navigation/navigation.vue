<template>
  <div class="navigation">
    <span
      id="navigation-title"
      class="visually-hidden"
      v-text="$string('general.site_header.navigation')"
    />

    <nav class="navigation__nav container">
      <ul class="navigation__list">
        <li
          v-for="(tier1) of desktop.items"
          :key="tier1.handle"
          class="navigation__item"
        >
          <a
            class="navigation__link text-other-label-s"
            :href="tier1.url"
            v-text="tier1.title"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

/**
 * Vue: Navigation (site-header-group)
 * -----------------------------------------------------------------------------
 * Desktop navigation links.
 * - No style import as it's included in critical stylesheet.
 *
 * @param {Object} desktop - Desktop linklist handle and items.
 *
 */
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Navigation',

  props: {
    desktop: {
      type: Object,
      default: () => ({
        handle: 'main-menu',
        items: [],
      }),
    },
  },
}
</script>
