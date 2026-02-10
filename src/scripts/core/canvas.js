/**
 * Core: Canvas
 * -----------------------------------------------------------------------------
 * Initialises and configures Vue in Canvas.
 * - Gets global components.
 * - Gets dynamic components.
 * - Sets Vuex stores.
 * - Sets Vue methods.
 * - Sets Vue mixins.
 * - Initialises Vue.
 *
 */
import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import { createApp } from 'vue'

import * as Canvas from '~/core/canvas-functions'
import AppHandler from '~/core/app-handler'
import { getAsyncComponents, getGlobalComponents } from '~/core/canvas-imports'
import Methods from '~/core/canvas-methods'

import config from '~/../../canvas.config'

/**
 * DOM selectors.
 */
const selectors = {
  component: '[data-component-handle]',
  vueDesignModeElement: 'vue-design-mode-element',
  vueElement: 'vue-element',
}

/**
 * Create a new Canvas object.
 */
export default () => {

  /**
   * Set global variables.
   */
  const vueDesignModeElement = document.getElementById(selectors.vueDesignModeElement)
  const vueElement = document.getElementById(selectors.vueElement)
  let restarting = false

  const sectionEvents = [
    'shopify:section:load',
    'shopify:section:unload',
    'shopify:section:reorder',
  ]

  /**
   * Initialise Vue.
   * @param {Boolean} eventListeners - Set section event listeners?
   */
  function init(eventListeners = true) {
    if (
      cnvs.settings.disableCanvas ||
      cnvs.page.type === 'gift_card' ||
      cnvs.page.type === 'password'
    ) {
      return
    }

    const components = getComponents()
    const app = getApp(components)
    Canvas.setVuePlugins(app)

    /**
     * Only include Bugsnag when API key was included in environment variables
     * on build, i.e. in Buddy.
     */
    if (cnvs.environment.bugsnagApiKey !== 'CANVAS_BUGSNAG_API_KEY') {
      app.use(Bugsnag.getPlugin('vue'))
    }

    /**
     * Mount to DOM.
     */
    app.mount(`#${selectors.vueElement}`)
    restarting = false

    /**
     * Don't re-add section event listeners in design mode or when restarting.
     */
    if (!Shopify.designMode || !eventListeners) {
      return
    }

    /**
     * Remount to DOM on design mode section changes.
     */
    sectionEvents.forEach((event) => {
      document.addEventListener(event, () => restartVue(app, event))
    })
  }

  /**
   * Get async and global components.
   * - Provided to Vue instance to determine active components.
   * @returns {Object}
   */
  function getComponents() {
    const async = getAsyncComponents()
    const global = getGlobalComponents()
    const elements = [...document.querySelectorAll(selectors.component)]

    const components = {
      async: {},
      global,
    }

    /**
     * Determines which async components are currently on the page.
     * - Filter the object of manually imported components based on page
     *   elements with the `data-component-handle` attribute.
     */
    elements.forEach((element) => {
      const handle = element.dataset.componentHandle

      if (!handle) {
        cnvs.ReportError('Element exists with data-component-handle attribute with no value')
        return
      }

      if (!async[handle]) {
        reportError(`No import found for ${handle} async component, please update canvas-imports.js`)
        return
      }

      components.async[handle] = async[handle]
    })

    return components
  }

  /**
   * Create and setup Canvas Vue app object.
   * @param {Object} components - Components to add to instance.
   * @returns {Object}
   */
  function getApp(components) {
    const app = createApp({
      name: 'CanvasApp',
      components: {
        ...components.async,
        ...components.global,
      },
      data() {
        return {
          article: false,
          blog: false,
          cnvsGlobal: true,
          collection: false,
          page: false,
          product: false,
          variant: false,
        }
      },
      mounted() {
        this.emitStartEvent()
        this.setAsyncComponentStates()
        this.setAnimationIntersectionObservers()
        this.setEventListeners()
      },
      unmounted() {
        this.removeEventListeners()
      },
      methods: Methods(components.async),
    })

    /**
     * Update Canvas app Vue configuration.
     * - Comments are required for Wishlist King to inject its code.
     */
    app.config.compilerOptions.comments = true
    app.config.compilerOptions.delimiters = ['${', '}']

    /**
     * Use canvas.config.js file to configure custom elements.
     * - Custom elements directly inside Vue instance must be defined here.
     * - Custom elements nested in components must be defined in the loader.
     * - Setting custom elements in config handles both scenarios.
     */
    if (config && config.customElements.length) {
      app.config.compilerOptions.isCustomElement = (tag) => {
        return config.customElements.includes(tag)
      }
    }

    return app
  }

  /**
   * Unmount and remount the Vue instance.
   * @param {Object} app - Vue app instance.
   * @param {String} sectionEvent - Section event which triggered the restart.
   */
  function restartVue(app, sectionEvent) {
    if (restarting) {
      return
    }

    /**
     * Set restarting state to prevent multiple restart functions being run.
     * - Making a section content change triggers both unload and load events.
     */
    window.console.log('Restarting Vue', sectionEvent)
    restarting = true

    setTimeout(() => {

      /**
       * Clear all body scroll locks.
       * - Ensures that any active body scroll locks added while interacting
       *   with the theme editor are cleared when Vue is restarted.
       */
      clearAllBodyScrollLocks()

      /**
       * Remove active Vue instance and attributes.
       * - Replace HTML with up-to-date hidden content.
       */
      app.unmount(`#${selectors.vueElement}`)
      vueElement.removeAttribute('data-v-app')
      vueElement.innerHTML = vueDesignModeElement.innerHTML

      /**
       * Initialise Vue.
       */
      AppHandler().beforeVueInit()
      init(false)
      AppHandler().afterVueInit()
    }, 0)
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
