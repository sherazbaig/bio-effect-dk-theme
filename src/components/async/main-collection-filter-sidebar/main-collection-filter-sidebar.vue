<template>
  <div
    class="main-collection__sidebar col xs6"
    :class="[
      collectionColumns !== '4' && headerState ? $class(headerState) : '',
      {
        'has-banner': banner,
        'l1-2': collectionColumns === '3',
        'l1-14 main-collection__sidebar--horizontal': collectionColumns === '4',
      },
    ]"
  >
    <div
      v-if="featuredCollections?.length && collectionColumns !== '4'"
      class="main-collection__filters"
      :class="{
        'main-collection__filters--horizontal': collectionColumns === '4',
      }"
    >
      <ul class="main-collection__filters--list">
        <li
          v-for="(featuredCollection, index) of featuredCollections"
          :key="index"
        >
          <a
            class="main-collection__filters--item"
            :class="{
              'text-mobile-p': featuredCollection.handle !== collection.handle,
              'text-mobile-p-bold':
                featuredCollection.handle === collection.handle,
              [$class('active')]:
                featuredCollection.handle === collection.handle,
            }"
            :href="featuredCollection.url"
            v-text="featuredCollection.title"
          />
        </li>
      </ul>
    </div>
    <div
      v-if="collectionColumns === '4'"
      class="filter-divider"
    />
    <div
      v-if="filters[0]?.values?.length"
      class="main-collection__filters"
      :class="{
        'main-collection__filters--horizontal': collectionColumns === '4',
        'main-collection__filters--four-columns': collectionColumns === '4'
      }"
    >
      <fieldset :class="{ 'fieldset-four-columns': collectionColumns === '4' }">
        <legend
          :class="{ 'legend-four-columns': collectionColumns === '4' }"
          class="main-collection__filters--legend text-p-xs-bold"
          v-text="$string('collection.filter_label')"
        />
        <ul
          class="main-collection__filters--list"
          :class="{
            'main-collection__filters--horizontal-list':
              collectionColumns === '4',
          }"
        >
          <li
            v-for="(filter, index) of filters[0].values"
            :key="filter.value"
          >
            <checkbox-input
              :id="'filter-' + index"
              :name="'filter-' + index"
              class="main-collection__filters--item"
              :label="filter.label"
              :value="filter.value"
              :checked="appliedFilters.includes(filter.value)"
              @change="() => toggleFilter(filter)"
            />
          </li>
          <li v-if="appliedFilters.length">
            <btn
              class="main-collection__filters--clear"
              :label="$string('collection.clear_filters')"
              modifiers="text"
              @click="clearFilters"
            />
          </li>
        </ul>
      </fieldset>
    </div>
  </div>
</template>

<script>

/**
 * Vue: main-collection-filter-sidebar (main-collection-filter-sidebar)
 * -----------------------------------------------------------------------------
 * Main Collection Filter Sidebar.
 *
 */

import { mapState } from 'vuex'
import CheckboxInput from '~async/utils/checkbox-input/checkbox-input'
import Btn from '~global/btn/btn'

export default {
  name: 'MainCollectionFilterSidebar',

  components: {
    CheckboxInput,
    Btn,
  },

  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    featuredCollections: {
      type: Array,
      default: () => [],
    },
    collection: {
      type: [Boolean, Object],
      default: false,
    },
    collectionColumns: {
      type: String,
      default: '4',
    },
    appliedFilters: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapState({
      headerState: (state) => state.index.scroll.header,
    }),
  },

  emits: ['toggle-filter', 'clear-filters'],

  data() {
    return {}
  },

  mounted() {
    // Not empty
  },

  methods: {
    toggleFilter(filter) {
      this.$emit('toggle-filter', filter)
    },
    clearFilters() {
      this.$emit('clear-filters')
    },
  },
}
</script>

<style lang="scss">
@import "./main-collection-filter-sidebar";
</style>
