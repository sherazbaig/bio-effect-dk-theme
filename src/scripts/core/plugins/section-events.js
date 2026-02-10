/**
 * Core / Plugin: Section events
 * -----------------------------------------------------------------------------
 * Vue plugin to extend Vue instance with section editor triggered events.
 *
 */
import { convertToHandle } from '~/helpers/convert'

/**
 * Expose install method.
 */
export default {
  install: (app) => {
    app.mixin({
      mounted() {
        const excludedComponents = [
          'async-component-wrapper',
          'base-transition',
        ]

        const handle = convertToHandle(this.$options.name)

        /**
         * Do not add event listeners for global, icon, static, or default Vue
         * components.
         */
        if (
          !Shopify.designMode ||
          this.cnvsGlobal ||
          this.cnvsStatic ||
          excludedComponents.includes(handle)
        ) {
          return
        }

        this.addEditorEventBusListener(handle)
      },

      methods: {

        /**
         * Add section editor event listeners.
         * - Section should have liquid.sectionId data attribute.
         * - For values of `detail` see Shopify documentation:
         * - https://shopify.dev/themes/architecture/sections/integrate-sections-with-the-theme-editor
         * @param {String} handle - Component handle.
         */
        addEditorEventBusListener(handle) {
          const globalEvents = [
            'shopify:inspector:activate',
            'shopify:inspector:deactivate',
          ]

          cnvs.EventBus.listen('cnvs:section-editor-event', ({
            event,
            detail,
            vueFunction,
          }) => {
            setTimeout(() => {

              /**
               * Match event to section's component handle if detail is passed.
               */
              const matchingSection =
                detail?.sectionId === handle ||
                detail?.sectionId === this.liquid?.sectionId

              /**
               * If function doesn't exist in component or there is no matching
               * section and the event is not global then early return.
               */
              if (
                typeof this[vueFunction] !== 'function' ||
                (!matchingSection && !globalEvents.includes(event))
              ) {
                return
              }

              this[vueFunction](detail)
            }, 0)
          })
        },
      },
    })
  },
}
