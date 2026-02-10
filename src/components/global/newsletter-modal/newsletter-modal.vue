<template>
  <div class="newsletter-modal critical-component-hide">
    <div class="grid">
      <div class="newsletter-modal__stripes-container">
        <icon-stripes />
      </div>

      <div class="col xs5 l5 newsletter-modal__media-col">
        <responsive-image
          class="newsletter-modal__image"
          :image="liquid.image"
          ratio="320:410"
          min-max="320-410"
        />
      </div>

      <div class="col xs-span l2-8 newsletter-modal__content-col">
        <h4
          v-if="title"
          class="
            newsletter-modal__title
            text-h2
            mb-m
            mb-l-desktop
          "
          v-text="title"
        />

        <div
          v-if="disclaimer"
          class="
            newsletter-modal__disclaimer
            text-mobile-p
            text-p-desktop
            mb-xl
            mb-l-desktop
          "
          v-html="disclaimer"
        />

        <form
          class="newsletter-modal__form"
          :class="[
            {
              [classes.success]: isInSuccessState,
              [classes.error]: isInErrorState,
            }
          ]"
          action="https://manage.kmail-lists.com/ajax/subscriptions/subscribe"
          method="POST"
          @submit.prevent="handleSubmit"
        >
          <input
            type="hidden"
            name="g"
            :value="list"
          >

          <input
            type="hidden"
            name="$fields"
            value="Terms"
          >

          <input
            type="hidden"
            name="contact[tags]"
            value="newsletter"
          >

          <div
            class="newsletter-modal__email-block mb-m"
            :class="{[classes.success]: isInSuccessState}"
          >
            <label
              class="visually-hidden"
              :for="getElementId('email')"
              v-text="$string('general.newsletter.email.label')"
            />

            <input
              :id="getElementId('email')"
              class="newsletter-modal__email-input text-p-small"
              :class="{
                'input-error': isInErrorState
              }"
              type="email"
              name="email"
              :placeholder="$string('general.newsletter.sign_up.email_placeholder')"
              required
              @keydown="handleKeydown"
            >
          </div>

          <div class="newsletter-modal__footer mb-m">
            <span
              v-if="isInErrorState"
              class="newsletter-modal__error"
              v-text="errorMessage"
            />

            <span
              v-if="isInSuccessState"
              class="newsletter-modal__success"
              v-text="$string('general.newsletter.success')"
            />
          </div>

          <checkbox-input
            :id="getElementId('terms')"
            :label="privacyPolicy"
            :checked="termsChecked"
            :class="{[classes.success]: isInSuccessState}"
            name="Terms"
            class="newsletter-modal__terms mb-m"
            @change="toggleInput"
          />

          <btn
            class="newsletter-modal__submit"
            :disabled="isLoadingState || !termsChecked"
            :label="button"
            type="submit"
            modifiers="primary center"
          />
        </form>
      </div>

      <div class="col xs-span l2-14 newsletter-modal__disclaimer-col">
        <p
          class="newsletter-modal__disclaimer-label text-p-small"
          v-text="$string('general.newsletter.sign_up.disclaimer_label')"
        />
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Newsletter modal (newsletter-modal)
 * -----------------------------------------------------------------------------
 * An automatic, delayed modal for prompting newsletter subscriptions.
 *
 * @param {String} liquid.sectionId - Section's Liquid ID.
 * @param {String} liquid.image - Modal image.
 * @param {String} disclaimer - Modal disclaimer text.
 * @param {String} title - Modal title.
 * @param {String} button - Modal CTA text.
 * @param {Object} overlay - The overlay namespace, if used.
 * @param {String} list - Newsletter list ID.
 * @param {String} privacyPolicy - Privacy policy text.
 * @param {Number} timeToShowModal - Time to show modal.
 * @param {Boolean} designMode - If the request is being made from within theme
 * editor.
 *
 */
import { mapActions, mapState } from 'vuex'
import ResponsiveImage from '~global/images/responsive-image.vue'
import Btn from '~global/btn/btn.vue'
import classes from '~/config/classes'
import CheckboxInput from '~async/utils/checkbox-input/checkbox-input.vue'
import IconStripes from '~icons/general/stripes.svg'

export default {
  name: 'NewsletterModal',

  components: {
    CheckboxInput,
    Btn,
    ResponsiveImage,
    IconStripes,
  },

  props: {
    disclaimer: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: '',
    },
    overlay: {
      type: Object,
      default: () => ({}),
    },
    list: {
      type: String,
      default: '',
    },
    privacyPolicy: {
      type: String,
      default: '',
    },
    timeToShowModal: {
      type: Number,
      default: 0,
    },
    designMode: {
      type: Boolean,
      default: false,
    },
    liquid: {
      type: Object,
      default: () => ({
        image: '',
        sectionId: '',
      }),
    },
  },

  emits: {
    state: (payload) => ['LOADING', 'ERROR', 'WARNING'].includes(payload),
  },

  data() {
    return {
      cnvsGlobal: true,
      classes,
      state: 'IDLE',
      blockClass: 'newsletter-modal',
      scrollDistance: null,
      showModal: false,
      errorMessage: '',
      termsChecked: false,
      scroll: {
        start: null,
        timeout: null,
        end: null,
      },
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      isMobile: (state) => state.index.screen.mobile,
    }),

    /**
     * Returns if loading state.
     * @return {boolean}
     */
    isInErrorState() {
      return this.state === 'ERROR'
    },

    /**
     * Returns if success state.
     * @return {boolean}
     */
    isInSuccessState() {
      return this.state === 'SUCCESS'
    },

    /**
     * Returns if loading state.
     * @returns {Boolean}
     */
    isLoadingState() {
      return this.state === 'LOADING'
    },
  },

  watch: {

    /**
     * Watches for changes to the state, and emits.
     */
    state() {
      this.$emit('state', this.state)
    },
  },

  mounted() {
    if (this.designMode) {
      return
    }

    this.showNewsletterModal()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
      queueOverlay: 'overlays/queue',
    }),

    /**
     * Show modal after delay.
     */
    showNewsletterModal() {
      const cookieModal = this.getCookie(this.overlay.namespace)

      if (!cnvs.settings.enable_newsletter_modal) {
        return
      }

      if (!cookieModal) {
        setTimeout(() => {
          this.queueOverlay({
            component: 'newsletter-modal',
            ignoreDismissed: true,
            namespace: this.overlay.namespace,
          })
        }, this.timeToShowModal)
        this.setCookie(this.overlay.namespace, true, 30)
      }
    },

    /**
     * Get cookie by name.
     * @param {String} name - Cookie name.
     * @return {Boolean|string}
     */
    getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)

      if (parts.length === 2) {
        return parts.pop().split(';').shift()
      }

      return false
    },

    /**
     * Set cookie.
     * @param {String} name - Cookie name.
     * @param {Boolean} value - Cookie value.
     * @param {Number} days - The number of days.
     */
    setCookie(name, value, days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      const expires = `expires=${date.toUTCString()}`
      document.cookie = `${name}=${value};${expires};path=/`
    },

    /**
     * Returns a unique identifier for the given element, scoped to the list.
     * @param {String} element - The element name.
     * @returns {String}
     */
    getElementId(element) {
      return `${this.blockClass ?? 'newsletter-form'}-${this.list}-${element}`
    },

    /**
     * Handles the email input key down event.
     */
    handleKeydown() {
      if (this.state === 'IDLE') {
        return
      }

      this.resetState()
    },

    /**
     * Handles the form submit event.
     * @param {Object} event - The event payload.
     */
    async handleSubmit(event) {
      if (!this.termsChecked) {
        return
      }

      this.loading = true

      await fetch(event.target.action, {
        method: event.target.method,
        body: new FormData(event.target),
      }).then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.state = 'SUCCESS'
            return
          }

          if (!data.errors?.length) {
            this.errorMessage = this.$string('general.newsletter.error')
            this.state = 'ERROR'

            return
          }

          this.errorMessage = data.errors[0]
          this.state = 'ERROR'
        })
        .catch(() => {
          this.errorMessage = this.$string('general.newsletter.error')
          this.state = 'ERROR'
        })
        .finally(() => {
          this.loading = false
        })
    },

    toggleInput() {
      this.termsChecked = !this.termsChecked
    },

    /**
     * Resets the component state.
     */
    resetState() {
      this.state = 'IDLE'
    },
  },
}
</script>
