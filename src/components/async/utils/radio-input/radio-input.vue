<template>
  <div
    class="radio-input"
    :class="{ [$class('loading')]: loading }"
  >
    <input
      :id="id"
      class="radio-input__input visually-hidden"
      :class="{ [$class('disabled')]: disabled }"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      type="radio"
      :value="value"
      @input="updateVModel(value)"
    >

    <label
      class="radio-input__label text-body-m-regular"
      :for="id"
      v-html="label"
    />
  </div>
</template>

<script>

/**
 * Vue: Radio input (radio-input)
 * -----------------------------------------------------------------------------
 * Radio input utility component.
 *
 * @param {Boolean} [checked] - Is checked? Recommend using v-model.
 * @param {Boolean} [disabled] - Input is disabled.
 * @param {String} id - ID for input.
 * @param {String} label - Input label.
 * @param {Boolean} [loading] - Loading state.
 * @param {Number|String} [modelValue] - Current value provided by v-model.
 * @param {String} name - Input group name.
 * @param {Number|String} value - Input value.
 *
 * @emits update:model-value - Emit v-model update event.
 *
 */
export default {
  name: 'RadioInput',

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
    name: {
      type: String,
      default: '',
      required: true,
    },
    value: {
      type: [Number, String],
      default: '',
      required: true,
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
@import './radio-input';
</style>
