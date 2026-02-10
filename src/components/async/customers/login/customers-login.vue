<template>
  <div class="customers-login" />
</template>

<script>

/**
 * Vue: Customers login (customers-login)
 * -----------------------------------------------------------------------------
 * Login page section.
 * - Can't use Vue because we can't easily pass all the {% form %} data to Vue.
 * - Instead we use the Vue component to load vanilla JS code.
 *
 */
import { focusable } from '~/helpers/accessibility'

export default {
  name: 'CustomersLogin',

  data() {
    return {
      forgotPasswordSuccess: false,
      nodeSelectors: false,
      showForgotPassword: false,
    }
  },

  watch: {

    /**
     * Watch forgot password success to show success message.
     */
    forgotPasswordSuccess() {
      if (!this.forgotPasswordSuccess || !this.nodeSelectors) {
        this.nodeSelectors.forgotPassword.success.classList.add(this.$class('hidden'))
        return
      }

      this.nodeSelectors.forgotPassword.success.classList.remove(this.$class('hidden'))
    },

    /**
     * Watch show forgot password to update visible form.
     */
    showForgotPassword() {
      if (!this.nodeSelectors) {
        return
      }

      this.nodeSelectors.login.forgotPasswordForm.classList.toggle(this.$class('hidden'))
      this.nodeSelectors.login.loginForm.classList.toggle(this.$class('hidden'))

      this.setFocus()
    },
  },

  mounted() {
    this.setNodeSelectors()

    if (!this.nodeSelectors.login.container) {
      return
    }

    this.setEventListeners()
    this.checkLocationHash()
    this.checkForgotPasswordSuccess()
  },

  methods: {

    /**
     * Set node selectors.
     */
    setNodeSelectors() {
      this.nodeSelectors = {
        forgotPassword: {
          success: document.querySelector('[js-forgot-password="success"]'),
          successCheck: document.querySelector('[js-forgot-password="successCheck"]'),
          toggle: [...document.querySelectorAll('[js-forgot-password="toggle"]')],
        },
        login: {
          container: document.querySelector('[js-login="container"]'),
          forgotPasswordForm: document.querySelector('[js-login="forgotPasswordForm"]'),
          loginForm: document.querySelector('[js-login="loginForm"]'),
        },
      }
    },

    /**
     * Set event listeners.
     */
    setEventListeners() {
      this.nodeSelectors.forgotPassword.toggle.forEach((element) => {
        element.addEventListener('click', () => {
          this.showForgotPassword = !this.showForgotPassword
        })
      })
    },

    /**
     * Check location hash on page load to see if #recover exists.
     */
    checkLocationHash() {
      if (location.hash !== '#recover') {
        return
      }

      this.showForgotPassword = true
    },

    /**
     * Check to see if forgot password success check exists.
     * - Means forgot password form has been submitted successfully if it does.
     */
    checkForgotPasswordSuccess() {
      this.forgotPasswordSuccess = Boolean(this.nodeSelectors.forgotPassword.successCheck)
    },

    /**
     * Set focus on first focusable element when switching forms.
     */
    setFocus() {
      const focusableElements = focusable(this.nodeSelectors.login.container)

      if (!focusableElements.length) {
        return
      }

      cnvs.Focus(focusableElements[0])
    },
  },
}
</script>

<style lang="scss">
@import '~async/utils/notification-panel/notification-panel';
@import './customers-login';
</style>
