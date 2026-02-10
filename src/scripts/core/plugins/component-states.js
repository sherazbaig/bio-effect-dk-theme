/**
 * Core / Plugin: Component states
 * -----------------------------------------------------------------------------
 * Vue plugin to extend Vue instance with component methods.
 *
 */
import { mapActions, mapGetters } from 'vuex'

import { convertToHandle } from '~/helpers/convert'

/**
 * Expose install method.
 */
export default {
  install: (app) => {
    app.mixin({
      computed: {

        /**
         * Map Vuex getters.
         */
        ...mapGetters({
          getActiveComponents: 'components/getActive',
          getVisibleComponents: 'components/getVisible',
        }),
      },

      mounted() {
        const excludedComponents = [
          'async-component-wrapper',
          'base-transition',
        ]

        const handle = convertToHandle(this.$options.name)

        /**
         * Do not push state of global, icon, static, or default Vue components.
         */
        if (
          !handle ||
          this.cnvsGlobal ||
          this.cnvsStatic ||
          excludedComponents.includes(handle)
        ) {
          return
        }

        /**
         * If component is specified in the disableComponentByHandle setting
         * then prevent changing to 'active' state and remove element.
         */
        if (cnvs.settings.disableComponentByHandle === handle) {
          this.$el.remove()
          return
        }

        this.setComponentState({ handle, state: cnvs.states.active })
      },

      methods: {

        /**
         * Map Vuex actions.
         */
        ...mapActions({
          loadComponent: 'components/load',
          setComponentState: 'components/setState',
          setComponentStates: 'components/setStates',
        }),

        /**
         * Get component active state.
         * - Returns true if component has state `active`.
         * - Used to display the Liquid loading state when false.
         * @param {String} handle - Component handle.
         * @returns {Boolean}
         */
        getComponentActive(handle) {
          return this.getActiveComponents.includes(handle)
        },

        /**
         * Get component visible state.
         * - Returns true if component has state and it's not `waiting`.
         * - Used to trigger v-if to prompt Vue to actually load the component.
         * @param {String} handle - Component handle.
         * @returns {Boolean}
         */
        getComponentVisible(handle) {
          return this.getVisibleComponents.includes(handle)
        },
      },
    })
  },
}
