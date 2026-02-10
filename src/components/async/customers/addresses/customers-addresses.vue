<template>
  <div class="customers-addresses" />
</template>

<script>

/**
 * Vue: Customers addresses (customers-addresses)
 * -----------------------------------------------------------------------------
 * Address page section.
 * - Can't use Vue because we can't easily pass all the {% form %} data to Vue.
 * - Instead we use the Vue component to load vanilla JS code.
 */
import { mapActions, mapState } from 'vuex'

import { focusable } from '~/helpers/accessibility'

export default {
  name: 'CustomersAddresses',

  data() {
    return {
      formId: '',
      nodeSelectors: false,
    }
  },

  computed: {

    /**
     * Map Vuex state.
     */
    ...mapState({
      previousElement: (state) => state.accessibility.previousElement,
    }),
  },

  watch: {

    /**
     * Watch form ID to update visible elements.
     */
    formId() {
      if (!this.nodeSelectors) {
        return
      }

      /**
       * Toggle element visibility.
       */
      this.nodeSelectors.container.addresses.classList.toggle(this.$class('hidden'))
      this.nodeSelectors.container.addresses.classList.toggle(this.$class('hidden'))
      this.nodeSelectors.container.form.classList.toggle(this.$class('hidden'))

      this.nodeSelectors.forms.forEach((element) => {
        element.classList.add(this.$class('hidden'))
      })

      const form = this.getForm(this.formId)

      if (form) {
        this.addSubmitEventListener(form)
      }

      if (!form) {
        cnvs.Focus(this.previousElement)
        this.setPreviousElement()
        this.showAddressPanel()
        return
      }

      form.classList.remove(this.$class('hidden'))
      this.setFocus(form)
      this.hideAddressPanel()
    },
  },

  async mounted() {
    this.setNodeSelectors()

    if (!this.nodeSelectors.container.addresses) {
      return
    }

    this.setEventListeners()
    this.updateSelectValue('country')

    /**
     * Ensure all country values have been set before updating province.
     */
    await this.$nextTick()
    this.updateSelectValue('province')

    /**
     * Check error element or URL parameters.
     */
    this.checkErrors()
    this.checkUrlParameters()
  },

  methods: {

    /**
     * Map Vuex actions.
     */
    ...mapActions({
      closeOverlay: 'overlays/close',
      openOverlay: 'overlays/open',
      setPreviousElement: 'accessibility/setPreviousElement',
    }),

    /**
     * Set node selectors.
     */
    setNodeSelectors() {
      this.nodeSelectors = {
        actions: {
          add: document.querySelector('[js-addresses="add"]'),
          cancel: [...document.querySelectorAll('[js-addresses="cancel"]')],
          default: [...document.querySelectorAll('[js-addresses="default"]')],
          defaultCancel: document.querySelector('[js-addresses="defaultCancel"]'),
          defaultConfirm: document.querySelector('[js-addresses="defaultConfirm"]'),
          delete: [...document.querySelectorAll('[js-addresses="delete"]')],
          deleteCancel: document.querySelector('[js-addresses="deleteCancel"]'),
          deleteConfirm: document.querySelector('[js-addresses="deleteConfirm"]'),
          edit: [...document.querySelectorAll('[js-addresses="edit"]')],
        },
        container: {
          addresses: document.querySelector('[js-addresses="addressesContainer"]'),
          form: document.querySelector('[js-addresses="formContainer"]'),
          panel: document.querySelector('[js-addresses="panel"]'),
        },
        error: document.querySelector('[js-addresses="error"]'),
        forms: [...document.querySelectorAll('[js-addresses="forms"]')],
        input: {
          country: [...document.querySelectorAll('[js-addresses="country"]')],
          province: [...document.querySelectorAll('[js-addresses="province"]')],
        },
        modal: {
          defaultAddress: document.querySelector('[js-addresses="defaultAddress"]'),
          deleteAddress: document.querySelector('[js-addresses="deleteAddress"]'),
        },
        addresses: {
          defaultAddress: document.querySelector('.customers-account__default-address-body'),
          otherAddresses: document.querySelector('.customers-addresses__additional'),
          addressText: document.querySelector('[js-addresses="address-text"]'),
        },
      }
    },

    /**
     * Set event listeners.
     */
    setEventListeners() {

      /**
       * Form ID updates.
       */
      this.nodeSelectors.actions.add.addEventListener('click', () => {
        this.formId = 'new'
      })

      this.nodeSelectors.actions.edit.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault()
          this.formId = element.dataset.formId
        })
      })

      this.nodeSelectors.actions.cancel.forEach((element) => {
        element.addEventListener('click', () => {
          this.formId = ''
          sessionStorage.removeItem('addressSubmit')
        })
      })

      /**
       * Form events.
       */
      this.nodeSelectors.input.country.forEach((element) => {
        element.addEventListener('change', () => {
          this.handleCountryChange(element)
        })
      })

      /**
       * Save sessionStorage on submit, if submit errors then this is used to
       * show the errors only on first page load.
       */
      this.nodeSelectors.forms.forEach((element) => {
        const form = element.querySelector('[js-addresses="form"]')

        form.addEventListener('submit', () => {
          sessionStorage.setItem('addressSubmit', true)
        })
      })

      /**
       * Default.
       */
      this.nodeSelectors.actions.default.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault()

          const formId = element.dataset.formId

          this.handleDefaultConfirm(formId)
        })
      })

      this.nodeSelectors.actions.defaultCancel?.addEventListener('click', () => {
        this.handleDefaultDeleteCancel('default')
      })

      this.nodeSelectors.actions.defaultConfirm?.addEventListener('click', () => {
        this.handleDefaultConfirm()
      })

      /**
       * Delete.
       */
      this.nodeSelectors.actions.delete.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault()
          this.handleDefaultDeleteClick(element.dataset.formId)
        })
      })

      this.nodeSelectors.actions.deleteCancel?.addEventListener('click', () => {
        this.handleDefaultDeleteCancel('delete')
      })

      this.nodeSelectors.actions.deleteConfirm?.addEventListener('click', (event) => {
        event.preventDefault()
        this.handleDeleteConfirm()
      })

      /**
       * Listen for esc to close current address form.
       */
      cnvs.EventBus.listen('cnvs:esc', () => {
        if (!this.formId) {
          return
        }

        this.formId = ''
      })
    },

    /**
     * Set focus on first focusable element when switching display.
     * @param {HTMLElement} container - Container element.
     */
    setFocus(container) {
      const form = container.querySelector('[js-addresses="form"]')
      const focusableElements = focusable(form, { includeHidden: true })

      if (!focusableElements.length) {
        return
      }

      this.setPreviousElement(document.activeElement)
      cnvs.Focus(focusableElements[0])
    },

    onSuccess() {
      location.reload()
    },

    onError(data) {
      console.error(data)
    },

    /**
     * Collect form data from the form.
     * @param {HTMLSelectElement} currentForm
     */
    collectData(currentForm) {
      const data = new FormData(currentForm)
      return data
    },

    /**
     * Set form options.
     * @param currentForm
     * @return {{ method: string, body: FormData }}
     */
    setOptions(currentForm) {
      return {
        method: 'post',
        body: this.collectData(currentForm),
      }
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
     * Handle form submit.
     * @param {object} event
     */
    onSubmit(event) {
      event.preventDefault()
      const { currentTarget } = event
      this.sendForm(currentTarget)
        .then((response) => this.onSuccess(response))
        .catch(this.onError)
    },

    /**
     * Add submit event listener to form.
     * @param formWrapper
     */
    addSubmitEventListener(formWrapper) {
      const form = formWrapper.querySelector('form')

      form.addEventListener('submit', (event) => this.onSubmit(event))
    },

    /**
     * Update country/province selects with default value.
     * - If no default value (e.g. new address) then select first option to
     *   trigger province update.
     * @param {String} type - Either `country` or `province`.
     */
    updateSelectValue(type) {
      this.nodeSelectors.input[type].forEach((element) => {
        if (!element.dataset.default) {
          let optionIndex = 0

          /**
           * Select 'England' instead of first option in province select of new
           * address form to avoid selecting 'British Forces'.
           */
          if (
            type === 'province' &&
            element.closest('[data-form-id="new"]') &&
            element.options[0]?.value === 'British Forces'
          ) {
            optionIndex = 1
          }

          if (!element.options[optionIndex]) {
            return
          }

          element.options[optionIndex].selected = true
          element.dispatchEvent(new Event('change'))
          return
        }

        const optionIndex = [...element.options].findIndex((option) => {
          return (
            option.innerText.trim() === element.dataset.default ||
            option.value === element.dataset.default
          )
        })

        if (optionIndex < 0) {
          return
        }

        element.options[optionIndex].selected = true
        element.dispatchEvent(new Event('change'))
      })
    },

    /**
     * Get associated form container element.
     * @param {String} formId - Form ID to find.
     * @returns {HTMLElement}
     */
    getForm(formId) {
      return this.nodeSelectors.forms.find((form) => {
        return form.dataset.formId === formId
      })
    },

    /**
     * Check if errors exist, if they do switch to that form.
     */
    checkErrors() {
      if (!this.nodeSelectors.error) {
        sessionStorage.removeItem('addressSubmit')
        return
      }

      /**
       * Only switch to form errors if last action was to submit a form.
       */
      if (!sessionStorage.getItem('addressSubmit')) {
        return
      }

      this.formId = this.nodeSelectors.error.dataset.formId
    },

    /**
     * Check if URL has edit or delete parameters.
     * - Actions delete parameter first.
     * - Replaces history state so URL updates.
     */
    checkUrlParameters() {
      const urlParameters = new URLSearchParams(location.search)
      let replaceHistoryState = false

      if (urlParameters.has('delete')) {
        this.handleDefaultDeleteClick(urlParameters.get('delete'), 'delete')
        urlParameters.delete('delete')
        replaceHistoryState = true
      }

      if (urlParameters.has('default')) {
        this.handleDefaultDeleteClick(urlParameters.get('default'), 'default')
        urlParameters.delete('default')
        replaceHistoryState = true
      }

      if (urlParameters.has('edit')) {
        this.formId = urlParameters.get('edit')
        urlParameters.delete('edit')
        replaceHistoryState = true
      }

      if (!replaceHistoryState) {
        return
      }

      const url = urlParameters.toString() === ''
        ? `${location.origin}${location.pathname}`
        : `${location.origin}${location.pathname}?${urlParameters.toString()}`

      history.replaceState({
        html: '',
      }, '', url)
    },

    /**
     * Handle country select change.
     * - Update province select with country's options.
     * @param {HTMLElement} select - Change event select.
     */
    handleCountryChange(select) {
      const form = this.getForm(select.dataset.formId)

      if (!form) {
        return
      }

      const option = select[select.selectedIndex]
      const provinces = JSON.parse(option.dataset.provinces)
      const provincesContainer = form.querySelector('[js-addresses="provinceContainer"]')
      const provincesSelect = form.querySelector('[js-addresses="province"]')

      provincesSelect.value = ''
      provincesSelect.innerHTML = ''

      if (!provinces.length) {
        provincesContainer.classList.add(this.$class('hidden'))
        return
      }

      const options = provinces.map((province) => {
        return `
          <option
            ${province[0] === 'England' ? 'selected' : ''}
            value="${province[0]}"
          >
            ${province[1]}
          </option>
        `
      }).join('')

      provincesSelect.innerHTML = options
      provincesContainer.classList.remove(this.$class('hidden'))
    },

    /**
     * Handle default/default action click.
     * @param {String} formId - Form ID to make default/delete.
     */
    handleDefaultDeleteClick(formId) {
      fetch(`/account/addresses/${formId}`, { method: 'delete' })
        .then(this.onSuccess)
        .catch(this.onError)
    },

    /**
     * Handle default/delete cancel.
     * @param {String} type - `default` or `delete`.
     */
    handleDefaultDeleteCancel(type) {
      const addressType = type === 'delete' ? 'deleteAddress' : 'defaultAddress'
      this.closeOverlay(addressType)
    },

    /**
     * Handle default confirm.
     */
    handleDefaultConfirm(formId) {
      const container = this.getForm(formId)
      const form = container.querySelector('[js-addresses="form"]')
      const checkbox = form.querySelector('input[name="address[default]"]')
      checkbox.checked = true

      form.addEventListener('submit', (event) => this.onSubmit(event))
      form.dispatchEvent(new Event('submit'))
    },

    /**
     * Handle delete confirm.
     */
    handleDeleteConfirm() {
      const formId = this.nodeSelectors.actions.deleteConfirm.dataset.formId

      Shopify.postLink(`/account/addresses/${formId}`, {
        parameters: { _method: 'delete' },
      })
    },

    /**
     * Show address panel.
     */
    showAddressPanel() {
      this.nodeSelectors.addresses.defaultAddress.classList.remove('is-hidden')
      this.nodeSelectors.addresses.otherAddresses.classList.remove('is-hidden')
      this.nodeSelectors.addresses.addressText.innerHTML =
        this.$string('customers.account.addresses.your_saved_addresses')
    },

    /**
     * Hide address panel.
     */
    hideAddressPanel() {
      this.nodeSelectors.addresses.defaultAddress.classList.add('is-hidden')
      this.nodeSelectors.addresses.otherAddresses?.classList?.add('is-hidden')
      this.nodeSelectors.addresses.addressText.innerHTML =
        this.$string('customers.account.addresses.add_address_to_saved')
    },
  },
}
</script>

<style lang="scss">
@import '~async/customers/addresses/address-block';
@import '~async/utils/checkbox-input/checkbox-input';
@import '~async/utils/divider-line/divider-line';
@import './customers-addresses';
</style>
