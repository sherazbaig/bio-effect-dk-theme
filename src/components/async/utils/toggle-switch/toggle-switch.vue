<template>
  <label
    class="toggle-switch"
    :class="{
      [$class('disabled')]: disabled,
      [$class('loading')]: loading,
    }"
    :for="id"
  >
    <input
      :id="id"
      class="toggle-switch__input visually-hidden"
      :checked="checked"
      :disabled="disabled"
      type="checkbox"
      @input="updateVModel(value)"
    >

    <span
      v-if="labelFalse"
      class="toggle-switch__label text-body-m"
      v-html="labelFalse"
    />

    <span
      class="toggle-switch__toggle"
      aria-hidden="true"
    />

    <span
      class="toggle-switch__label text-body-m"
      v-html="labelTrue"
    />
  </label>
</template>

<script>

/**
 * Vue: Toggle switch (toggle-switch)
 * -----------------------------------------------------------------------------
 * Toggle input utility component, represents stylised checkbox.
 *
 * @param {Boolean} [checked] - Is checked?
 * @param {Boolean} [disabled] - Input is disabled.
 * @param {String} id - ID for input.
 * @param {String} [labelFalse] - False/inactive/left side label.
 * @param {String} labelTrue - True/active/right side label.
 * @param {Boolean} [loading] - Loading state.
 * @param {Number|String} [modelValue] - Current value provided by v-model.
 *
 * @emits update:model-value - Emit v-model update event.
 *
 */
export default {
  name: 'ToggleSwitch',

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
    labelFalse: {
      type: String,
      default: '',
    },
    labelTrue: {
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
@import './toggle-switch';
</style>
