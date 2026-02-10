<template>
  <div
    class="selection-tab"
    :class="{
      'selection-tab--button': url,
      [$class('disabled')]: disabled,
      [$class('loading')]: loading,
    }"
  >
    <input
      v-if="!url"
      :id="id"
      v-model="localModelValue"
      class="selection-tab__input visually-hidden"
      :class="{ [$class('disabled')]: disabled }"
      :disabled="disabled"
      :name="name"
      type="radio"
      :value="value"
      @input="updateVModel(value)"
    >

    <component
      :is="url ? 'a' : 'label'"
      class="
        selection-tab__label
        text-tags
      "
      :for="id"
      :href="url ? url : null"
      :title="title"
      v-html="label"
    />
  </div>
</template>

<script>

/**
 * Vue: Selection tab (selection-tab)
 * -----------------------------------------------------------------------------
 * Simple tab button with active, disabled, and initial states.
 *
 * @param {Boolean} [disabled] - Tab is disabled.
 * @param {String} [id] - ID for input, required for input.
 * @param {String} label - Tab label.
 * @param {Boolean} [loading] - Loading state.
 * @param {Number|String} modelValue - Current value provided by v-model.
 * @param {String} [name] - Radio input group name, required for input.
 * @param {String} [title] - Title attribute.
 * @param {String} [url] - URL to navigate to when clicked, replaces input.
 * @param {Number|String} [value] - Radio input value, required for input.
 *
 * @emits update:model-value - Emit v-model update event.
 *
 */
export default {
  name: 'SelectionTab',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // Required for v-model
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: {
      type: [Number, String],
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },

  emits: {
    'update:model-value': () => true,
  },

  data() {
    return {
      localModelValue: '',
    }
  },

  watch: {

    /**
     * Watch v-model value to update local value.
     */
    modelValue() {
      this.localModelValue = this.modelValue
    },
  },

  mounted() {
    this.localModelValue = this.modelValue
  },

  methods: {

    /**
     * Emit update v-model event.
     * @param {Number|String} value - Update value.
     */
    updateVModel(value) {
      this.$emit('update:model-value', value)
    },
  },
}
</script>

<style lang="scss">
@import './selection-tab';
</style>
