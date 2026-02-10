<template>
  <div />
</template>

<script>

import timings from '~/config/timings'

/**
 * Vue: account forms (account-forms)
 * -----------------------------------------------------------------------------
 * Account form for the header.
 *
 */
export default {
  name: 'AccountForms',

  data() {
    return {
      errorText: '',
      nodeSelectors: {},
      isSubmittedRecently: false,
    }
  },

  mounted() {
    this.setNodeSelectors()
    this.setLoginEventListeners()
    this.setForgotPasswordEventListeners()
    this.setRegisterEventListeners()
  },

  methods: {

    /**
     * Set the node selectors.
     */
    setNodeSelectors() {
      this.nodeSelectors = {
        containers: document.querySelectorAll('[js-account]'),
        login: {
          button: document.querySelector('[js-login="toggle"]'),
          container: document.querySelector('[js-account="login"]'),
          forgotPassword: document.querySelector('[js-forgot-password="toggle"]'),
          form: document.querySelector('[js-account="login"] form'),
          registerButton: document.querySelector('[js-register="toggle"]'),
          formError: document.querySelector('[js-account="login-error"]'),
        },
        forgotPassword: {
          cancel: document.querySelector('[js-forgot-password="cancel"]'),
          container: document.querySelector('[js-account="forgot-password"]'),
          form: document.querySelector('[js-account="forgot-password"] form'),
          submit: document.querySelector('[js-forgot-password="submit"]'),
          formError: document.querySelector('[js-account="forgot-password-error"]'),
        },
        register: {
          container: document.querySelector('[js-account="register"]'),
          form: document.querySelector('[js-account="register"] form'),
          submit: document.querySelector('[js-register="submit"]'),
          backToLogin: document.querySelector('[js-register="login-toggle"]'),
        },
      }
    },

    /**
     * Set the event listeners for login container.
     */
    setLoginEventListeners() {
      this.nodeSelectors.login.form.addEventListener('submit', (event) => {
        event.preventDefault()

        if (
          !event.submitter.getAttribute('js-login') ||
          this.isSubmittedRecently
        ) {
          return
        }

        this.onSubmit(event)
      })

      this.nodeSelectors.login.forgotPassword.addEventListener('click', () => {
        this.nodeSelectors.login.container.classList.add('is-hidden')
        this.nodeSelectors.forgotPassword.container.classList.remove('is-hidden')
      })

      this.nodeSelectors.login.registerButton.addEventListener('click', () => {
        this.nodeSelectors.login.container.classList.add('is-hidden')
        this.nodeSelectors.register.container.classList.remove('is-hidden')
      })
    },

    setForgotPasswordEventListeners() {
      this.nodeSelectors.forgotPassword.cancel.addEventListener('click', (event) => {
        event.preventDefault()

        this.nodeSelectors.forgotPassword.container.classList.add('is-hidden')
        this.nodeSelectors.login.container.classList.remove('is-hidden')
      })

      this.nodeSelectors.forgotPassword.submit.addEventListener('click', (event) => {
        this.nodeSelectors.forgotPassword.form.requestSubmit(event.currentTarget)
      })

      this.nodeSelectors.forgotPassword.form.addEventListener('submit', (event) => {
        event.preventDefault()

        if (
          event.submitter.getAttribute('js-forgot-password') !== 'submit' ||
          this.isSubmittedRecently
        ) {
          return
        }

        this.onSubmit(event)
      })
    },

    setRegisterEventListeners() {
      this.nodeSelectors.register.form.addEventListener('submit', (event) => {
        event.preventDefault()

        if (
          event.submitter.getAttribute('js-register') !== 'submit' ||
          this.isSubmittedRecently
        ) {
          return
        }

        this.onSubmit(event)
      })

      this.nodeSelectors.register.backToLogin.addEventListener('click', () => {
        this.nodeSelectors.register.container.classList.add('is-hidden')
        this.nodeSelectors.login.container.classList.remove('is-hidden')
      })
    },

    /**
     * Handle form submit.
     * @param {object} event
     */
    async onSubmit(event) {
      event.preventDefault()

      const { currentTarget } = event
      currentTarget.setAttribute('onsubmit', '')

      this.isSubmittedRecently = true
      let response = await this.sendForm(currentTarget)
      response = await response.text()

      setTimeout(() => {
        this.isSubmittedRecently = false
      }, timings.slow)

      if (response.includes('status-error status-code-500')) {
        this.errorText = this.$string('customers.login.too_many_attempts')
        this.placeErrorText(currentTarget)

        return
      }

      if (response.includes('id="login-errors"')) {
        const match = response.match(/<p class="customers__error">(?:.*)<\/p>/g)

        if (!match) {
          return
        }

        const errorText = match.map(matchItem => matchItem.replace(/<p class="customers__error">|<\/p>/g, ''))

        if (errorText[0].includes('already associated with an account')) {
          this.errorText = this.$string('customers.activate_account.email_already_taken')
        } else {
          this.errorText = errorText[0]
        }

        this.placeErrorText(currentTarget)

        return
      }

      if (response.includes('forgot-password-errors')) {
        const match = response.match(/<p class="customers__error">(?:.*)<\/p>/g)

        if (!match) {
          return
        }

        const errorText = match.map(matchItem => matchItem.replace(/<p class="customers__error">|<\/p>/g, ''))

        if (!errorText) {
          return
        }

        this.errorText = errorText[0]
        this.placeErrorText(currentTarget)

        return
      }

      this.handleSuccess(currentTarget)
    },

    /**
     * Handle form success upon successful response.
     * @param {HTMLFormElement} form
     */
    handleSuccess(form) {
      const formId = form.getAttribute('id')

      if (formId === 'customer_login' || formId === 'create_customer') {
        location.href = cnvs.routes.account.url

        return
      }

      this.errorText = this.$string('customers.login.forgot_password.success')
      this.placeErrorText(form)
    },

    /**
     * Place error text in the current targeted form.
     * @param {HTMLElement} currentTarget
     */
    placeErrorText(currentTarget) {
      currentTarget.previousSibling.classList.remove('is-hidden')
      currentTarget.previousSibling.querySelector('span').innerHTML = this.errorText
    },

    /**
     * Send form data to server.
     * @param {HTMLFormElement} currentForm
     * @return {Promise<Response>}
     */
    sendForm(currentForm) {
      const action = currentForm.action

      return fetch(action, this.setOptions(currentForm))
    },

    /**
     * Set form options.
     * @param currentForm
     * @return {{ method: string, body: FormData }}
     */
    setOptions(currentForm) {
      return {
        method: 'post',
        body: new FormData(currentForm),
      }
    },

    onError(data) {
      console.error(data)
    },
  },
}
</script>
