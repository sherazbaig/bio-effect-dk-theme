<template>
  <div class="message-input">
    <textarea
      :id="id"
      class="message-input__textarea "
      :class="{
        [$class('disabled')]: disabled,
      }"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rowLength"
      @input="updateVModel($event.target.value)"
    />
  </div>
</template>

<script>

/**
 * Vue: General input (general-input)
 * -----------------------------------------------------------------------------
 * General input utility component.
 *
 * @param {String} [placeholder] - Text area placeholder.
 * @param {Boolean} [disabled] - Text area is disabled.
 * @param {String} [name] - Name for text area.
 * @param {String} id - ID for input.
 * @param {Number} rowLength - Row lengths for text area.
 * @param {Number|String} [value] - Text area value.
 *
 * @emits update:model-value - Emit v-model update event.
 *
 */
export default {
  name: 'MessageInput',

  props: {
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
    rowLength: {
      type: Number,
      default: 2,
    },
    id: {
      type: String,
      default: '',
      required: true,
    },
    value: {
      type: [Number, String],
      default: '',
    },
  },

  emits: {
    'update:model-value': () => true,
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
@import './message-input';
</style>
