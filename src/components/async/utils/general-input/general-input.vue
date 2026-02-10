<template>
  <div class="general-input">
    <div
      class="general-input__wrapper"
      :class="[
        type,
        { [$class('loading')]: loading },
      ]"
    >
      <input
        :id="id"
        class="general-input__input"
        :class="{
          [$class('disabled')]: disabled,
          'general-input__input-not-empty': hasValue
        }"
        :disabled="disabled"
        :placeholder="placeholder"
        :name="name"
        :type="type"
        :value="value"
        @input="updateVModel($event.target.value)"
      >

      <label
        v-if="hasValue"
        class="general-input__label"
        v-html="label"
      />
    </div>
    <div
      v-if="errorMessage"
      class="general-input__state-message"
      v-html="errorMessage"
    />
  </div>
</template>

<script>

/**
 * Vue: General input (general-input)
 * -----------------------------------------------------------------------------
 * General input utility component.
 *
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
  name: 'GeneralInput',

  props: {
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Number, String],
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },

  emits: {
    'update:model-value': () => true,
  },

  computed: {
    hasValue() {
      return this.value && this.value !== ''
    },
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
@import './general-input';
</style>
