<template>
  <teleport
    :disabled="!toast"
    to="body"
  >
    <transition name="fade">
      <div
        v-if="display"
        class="notification-panel"
        :class="[
          classContainer,
          {
            [`notification-panel--${type}`]: type,
            'notification-panel--show-close': showClose,
            'notification-panel--toast': toast,
          }
        ]"
      >
        <p
          v-if="title"
          class="notification-panel__title"
          :class="classTitle ? classTitle : 'text-heading-m'"
          v-html="title"
        />

        <p
          class="notification-panel__text"
          :class="classText ? classText : 'text-body-m-regular'"
          v-html="text"
        />

        <button
          v-if="showClose"
          class="notification-panel__close icon-button"
          type="button"
          @click="handleCloseClick"
        >
          <span
            class="visually-hidden"
            v-text="$string('accessibility.close')"
          />

          <icon-close />
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script>

/**
 * Vue: Notification panel (notification-panel)
 * -----------------------------------------------------------------------------
 * Temporary notification panel to indicate errors or success messages.
 *
 * @param {String} [classContainer] - Class applied to container.
 * @param {String} [classText] - Text element class, overrides text classes.
 * @param {String} [classTitle] - Title element class, overrides text classes.
 * @param {Boolean} [showClose] - Show close button.
 * @param {String} text - Text content.
 * @param {Number} [timeout] - Fades out after timeout.
 * @param {String} [title] - Title content.
 * @param {Boolean} [toast] - Act as toast/pop-up.
 * @param {String} [type] - Type of notification, `error`, `success`, or `info`,
 * if no type is provided then it defaults to general.
 *
 * @emits close - Emit notification close event.
 *
 */
import IconClose from '~icons/directional-navigation/close.svg'

export default {
  name: 'NotificationPanel',

  components: {
    IconClose,
  },

  props: {
    classContainer: {
      type: String,
      default: '',
    },
    classText: {
      type: String,
      default: '',
    },
    classTitle: {
      type: String,
      default: '',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '',
      required: true,
    },
    timeout: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    toast: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },

  emits: {
    close: () => true,
  },

  data() {
    return {
      display: true,
    }
  },

  async mounted() {
    if (!this.timeout) {
      return
    }

    await cnvs.Sleep(this.timeout)
    this.display = false
  },

  methods: {

    /**
     * Handle close click.
     */
    handleCloseClick() {
      this.$emit('close')
      this.display = false
    },
  },
}
</script>

<style lang="scss">
@import './notification-panel';
</style>
