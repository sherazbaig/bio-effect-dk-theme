/**
 * Storybook: Overlay (overlay)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { mapActions, mapState } from 'vuex'

import Overlay from './overlay'

/**
 * Write component description for docs tab.
 */
const component = `
  Drawer and modal component designed to handle accessibility requirements automatically.

  See [documentation](https://we-make-websites.gitbook.io/canvas/components/default-components/overlay) for more details.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Overlay',
  component: Overlay,
  args: {
    autoQueue: false,
    autoShow: 0,
    direction: 'up',
    disableScroll: true,
    namespace: 'storybook-modal',
    noContent: false,
    showOverlay: true,
    teleport: true,
    template: true,
    type: 'modal',
  },
  argTypes: {
    direction: {
      control: {
        labels: {
          up: 'Up (modal/shelf)',
          down: 'Down (modal/shelf)',
          left: 'Left (drawer)',
          right: 'Right (drawer)',
        },
        type: 'inline-radio',
      },
      options: [
        'up',
        'down',
        'left',
        'right',
      ],
    },
    type: {
      control: {
        labels: {
          drawer: 'Drawer',
          modal: 'Modal',
          shelf: 'Shelf',
        },
        type: 'inline-radio',
      },
      options: [
        'drawer',
        'modal',
        'shelf',
      ],
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    docs: {
      description: {
        component,
      },
    },
  },
}

/**
 * Setup shared template.
 */
const object = (args) => ({
  components: { Overlay },
  setup() {
    return { args }
  },
  computed: {
    ...mapState({
      stuckNamespace: (state) => state.overlays.stuck,
    }),
    stuckLabel() {
      return this.stuckNamespace === args.namespace
        ? `Unstick ${args.type}`
        : `Stick ${args.type}`
    },
  },
  methods: {
    ...mapActions({
      queueOverlay: 'overlays/queue',
      setStuck: 'overlays/setStuck',
      toggleOverlay: 'overlays/toggle',
    }),
    getOverlayTitle(button, plural) {
      let string = `${args.type[0].toUpperCase()}${args.type.slice(1)}`

      if (plural && args.type === 'shelf') {
        string = 'Shelves'
      } else if (plural) {
        string += 's'
      }

      return button ? `Open ${string.toLowerCase()}` : string
    },
    openOverlays() {
      this.toggleOverlay({
        ignoreDismissed: true,
        namespace: args.namespace,
      })

      this.queueOverlay({
        ignoreDismissed: true,
        namespace: `${args.namespace}-queued`,
      })
    },
  },
  template: `
    <btn
      :label="getOverlayTitle(true)"
      @click="toggleOverlay({
        ignoreDismissed: true,
        namespace: '${args.namespace}',
      })"
      style="margin-inline-end: 1rem;"
    />

    <btn
      :label="getOverlayTitle(true, true)"
      modifiers="outlined"
      @click="openOverlays()"
    />

    <overlay v-bind="args">
      <template #title>
        {{ getOverlayTitle() }} 1 title
      </template>

      <template #body>
        <div
          class="critical-component-hide"
          style="display: block;"
        >
          {{ getOverlayTitle() }} 1 body content
        </div>
      </template>
    </overlay>

    <overlay v-bind="args" :auto-show="0" namespace="${args.namespace}-queued">
      <template #title>
        {{ getOverlayTitle() }} 2 title
      </template>

      <template #body>
        <div
          class="critical-component-hide"
          style="display: block;"
        >
          {{ getOverlayTitle() }} 2 body content
        </div>
      </template>
    </overlay>
  `,
})

const Template = (args) => object(args)

/**
 * Modal story.
 */
export const Modal = Template.bind({})

/**
 * Drawer story.
 */
export const Drawer = Template.bind({})

Drawer.args = {
  direction: 'left',
  namespace: 'storybook-drawer',
  type: 'drawer',
}

/**
 * Shelf story.
 */
export const Shelf = Template.bind({})

Shelf.args = {
  direction: 'up',
  namespace: 'storybook-shelf',
  type: 'shelf',
}

/**
 * Autoshow story.
 */
export const ShowAutomatically = Template.bind({})

ShowAutomatically.args = {
  autoShow: 1000,
  namespace: 'storybook-autoshow',
}

/**
 * Stuck story.
 */
export const Stuck = (args) => ({
  ...object(args),
  template: `
    <btn
      label="Open ${args.type}"
      @click="toggleOverlay({
        ignoreDismissed: true,
        namespace: '${args.namespace}',
        stuck: true,
      })"
    />

    <overlay v-bind="args">
      <template #title>
        {{ getOverlayTitle() }} title
      </template>

      <template #body>
        <div
          class="critical-component-hide"
          style="display: block;"
        >
          <span style="display: block;">
            {{ getOverlayTitle() }} body content
          </span>

          <btn
            :label="stuckLabel"
            @click="setStuck({
              namespace: ${args.namespace},
              stuck: (stuckNamespace !== ${args.namespace}),
            })"
            style="margin-block-start: 1rem;"
          />
        </div>
      </template>
    </overlay>
  `,
})

Stuck.args = {
  namespace: 'storybook-stuck',
}
