<template>
  <div
    v-click-outside="closeMenu"
    class="dropdown-menu"
  >
    <div
      class="dropdown-menu__input-area"
      :class="label ? 'dropdown-menu__input-area--with-label' : ''"
      @click="toggleMenu"
    >
      <span
        v-if="label"
        class="dropdown-menu__label"
        v-text="label"
      />

      <div
        class="dropdown-menu__input"
        :class="hasSelected ? 'dropdown-menu__input--selected' : ''"
        v-text="hasSelected ? selectedClone.text : placeholder"
      />

      <chevron-down :class="menuStatusClone ? 'dropdown-menu__active' : ''" />
    </div>

    <div
      v-if="options.length > 0 && menuStatusClone"
      class="dropdown-menu__option-area"
    >
      <div
        v-for="option of options"
        :key="option.value"
        class="dropdown-menu__option"
        :class="{
          'dropdown-menu__option--selected': option.value === selectedClone.value,
        }"
        @click="selectOption(option)"
      >
        <p
          class="dropdown-menu__option-text"
          v-text="option.text"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDown from '~icons/directional-navigation/chevron/down.svg'

export default {
  name: 'DropdownMenu',

  components: {
    ChevronDown,
  },

  props: {
    options: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Object,
      default: () => ({}),
    },
    menuStatus: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },

  emits: {
    'close-menu': () => true,
    'select-option': () => true,
    'toggle-menu': () => true,
  },

  data() {
    return {
      menuStatusClone: this.menuStatus,
      selectedClone: this.selected,
    }
  },

  computed: {
    hasSelected() {
      return Object.keys(this.selectedClone).length > 0
    },
  },

  watch: {
    menuStatus() {
      this.menuStatusClone = this.menuStatus
    },

    selected() {
      this.selectedClone = this.selected
    },
  },

  methods: {
    closeMenu() {
      this.menuStatusClone = false
      this.$emit('close-menu', this.menuStatusClone)
    },

    toggleMenu() {
      this.menuStatusClone = !this.menuStatusClone
      this.$emit('toggle-menu', this.menuStatusClone)
    },

    selectOption(option) {
      this.selectedClone = option
      this.$emit('select-option', option)
    },
  },
}
</script>

<style lang="scss">
 @import "./dropdown-menu";
</style>
