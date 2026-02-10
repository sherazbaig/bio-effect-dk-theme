<template>
  <div
    class="checkbox-input"
    :class="[
      { [$class('loading')]: loading },
    ]"
  >
    <input
      :id="id"
      class="checkbox-input__input visually-hidden"
      :class="{ [$class('disabled')]: disabled }"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      type="checkbox"
      @input="updateVModel(value)"
    >

    <label
      class="checkbox-input__label text-p-small"
      :for="id"
    >
      <span
        class="text-p-small"
        v-html="label"
      />
    </label>
  </div>
</template>

<script>

/**
 * Vue: Checkbox input (checkbox-input)
 * -----------------------------------------------------------------------------
 * Checkbox input utility component.
 *
 * @param {Boolean} [checked] - Is checked?
 * @param {Boolean} [disabled] - Input is disabled.
 * @param {String} id - ID for input.
 * @param {String} label - Input label.
 * @param {Boolean} [loading] - Loading state.
 * @param {Number|String} [modelValue] - Current value provided by v-model.
 *
 * @emits update:model-value - Emit v-model update event.
 *
 */

export default {
  name: 'CheckboxInput',

  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
      required: true,
    },
    name: {
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
    modelValue: {
      type: [Number, String],
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
@import './checkbox-input';
</style>
