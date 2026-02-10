<template>
  <div>
    <p
      v-if="isInSuccessState"
      class="newsletter-form__success text-p-desktop text-mobile-p"
      v-text="$string('general.newsletter.success')"
    />

    <form
      v-else
      class="newsletter-form"
      :class="[
        $blockClass(blockClass, 'newsletter'),
        {
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

      <div
        class="newsletter-form__email"
        :class="$blockClass(blockClass, 'newsletter-email')"
      >
        <label
          class="visually-hidden"
          :for="getElementId('email')"
          v-text="$string('general.newsletter.email.label')"
        />

        <input
          :id="getElementId('email')"
          class="newsletter-form__email-input text-p-desktop text-mobile-p"
          :class="{
            'input-error': isInErrorState
          }"
          type="email"
          name="email"
          :placeholder="$string('general.newsletter.email.placeholder')"
          required
          @keydown="handleKeydown"
        >

        <btn
          class="newsletter-form__submit"
          :disabled="isLoadingState"
          :label="$string('general.newsletter.submit')"
          class-label="visually-hidden"
          type="submit"
          show-icon
          modifiers="text center"
        >
          <template #icon>
            <link-arrow />
          </template>
        </btn>
      </div>

      <div
        v-if="isInErrorState"
        class="newsletter-form__footer"
        :class="$blockClass(blockClass, 'newsletter-footer')"
      >
        <span
          v-if="isInErrorState"
          class="newsletter-form__error"
          v-text="errorMessage"
        />
      </div>
    </form>
  </div>
</template>

<script>

/**
 * Vue: Newsletter form (newsletter-form)
 * -----------------------------------------------------------------------------
 * A form subscription to a Klaviyo newsletter list.
 *
 * @param {String} [list] - The Klaviyo list identifier.
 * @param {String} [blockClass] - Block level class to add to elements.
 */
import classes from '~/config/classes'
import Btn from '~global/btn/btn'
import LinkArrow from '~icons/directional-navigation/link-arrow.svg'

export default {
  name: 'NewsletterForm',

  components: {
    Btn,
    LinkArrow,
  },

  props: {
    list: {
      type: String,
      default: '',
    },
    blockClass: {
      type: String,
      default: '',
    },
  },

  emits: {
    state: (payload) => ['LOADING', 'ERROR', 'WARNING'].includes(payload),
  },

  data() {
    return {
      classes,
      state: 'IDLE',
      errorMessage: '',
    }
  },

  computed: {

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

  methods: {

    /**
     * Returns a unique identifier for the given element, scoped to the list.
     * @param {String} element - The element name.
     * @returns {String}
     */
    getElementId(element) {
      return `${this.blockClass ?? 'newsletter-form'}-${this.list}-${element}`
    },

    /**
     * Handles the form submit event.
     * @param {Object} event - The event payload.
     */
    async handleSubmit(event) {
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
     * Resets the component state.
     */
    resetState() {
      this.state = 'IDLE'
    },
  },
}
</script>

<style lang="scss">
@import './newsletter-form';
</style>
