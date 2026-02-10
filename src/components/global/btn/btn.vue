<template>
  <component
    :is="element"
    class="button"
    :class="[
      modifierClasses,
      {
        'no-icon': !showIcon,
        'has-hover-icon': $slots.hoverIcon,
        'show-state-icon': showStateIcon,
        [$class('loading')]: showLoading,
      },
    ]"
    :href="url || null"
    :type="type || null"
  >
    <span
      v-if="multipleLabels"
      class="button__label--wrapper"
    >
      <span
        class="button__label"
        :class="labelClasses"
        v-text="label"
      />

      <span
        class="button__label"
        :class="labelClasses"
        v-text="secondaryLabel"
      />
    </span>

    <span
      v-else
      class="button__label"
      :class="labelClasses"
      v-text="label"
    />

    <span
      v-if="showIcon || $slots.hoverIcon"
      class="button__icon"
    >
      <span
        v-if="showIcon"
        class="button__default-icon"
      >
        <slot name="icon">
          <icon-arrow-right />
        </slot>
      </span>

      <span
        v-if="$slots.hoverIcon"
        class="button__hover-icon"
      >
        <slot name="hoverIcon" />
      </span>
    </span>

    <span
      v-if="showStateIcon && $slots.stateIcon"
      class="button__state-icon"
    >
      <slot name="stateIcon" />
    </span>
  </component>
</template>

<script>

/**
 * Vue: Button (btn)
 * -----------------------------------------------------------------------------
 * Global interactive button element.
 * - Styles are imported in critical styles.
 * - Must be imported as <btn> as <button> is a default element.
 *
 * @param {String} [classLabel] - Label class.
 * @param {String} [customElement] - Optional override to set button element.
 * @param {String} label - Button label.
 * @param {String} [modifiers] - Button modifiers in space separated list
 * (primary, secondary, fill, text, dark, block, center, or reversed).
 * @param {Boolean} [showIcon] - Whether to show the default icon, hover icons
 * will still be displayed if passed into their slot.
 * @param {Boolean} [showStateIcon] - Show secondary button state, replaces text
 * and default icon with `stateIcon` slot.
 * @param {String} [type] - Type of button (button or submit).
 * @param {String} [url] - URL if link.
 *
 */
import IconArrowRight from '~icons/directional-navigation/arrow/right.svg'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Btn',

  components: {
    IconArrowRight,
  },

  props: {
    classLabel: {
      type: String,
      default: '',
    },
    customElement: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
      required: true,
    },
    modifiers: {
      type: [String, Array],
      default: 'primary block center',
    },
    multipleLabels: {
      type: Boolean,
      default: false,
    },
    secondaryLabel: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    showStateIcon: {
      type: Boolean,
      default: false,
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'button', 'submit'].includes(value)
      },
    },
    url: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      cnvsGlobal: true,
    }
  },

  computed: {

    /**
     * Compute element type.
     * @returns {String}
     */
    element() {
      if (this.customElement) {
        return this.customElement
      }

      return this.url ? 'a' : 'button'
    },

    /**
     * Compute label classes.
     * @returns {String}
     */
    labelClasses() {
      if (this.classLabel) {
        return this.classLabel
      }

      if (this.modifiers.includes('text')) {
        return 'text-body-m-underline text-body-l-underline-desktop'
      }

      return 'text-other-button-s text-other-button-l-desktop'
    },

    /**
     * Compute modifier classes.
     * @returns {String}
     */
    modifierClasses() {
      if (!this.modifiers) {
        return ''
      }

      let modifiers = []

      if (Array.isArray(this.modifiers)) {
        modifiers = this.modifiers
      } else {
        modifiers = this.modifiers.split(/[\s,]/g)
      }

      return modifiers.map((modifier) => {
        return `button--${modifier}`
      }).join(' ')
    },
  },
}
</script>
