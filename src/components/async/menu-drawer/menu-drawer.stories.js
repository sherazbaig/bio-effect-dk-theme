/**
 * Storybook: Menu drawer (menu-drawer)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MenuDrawer from './menu-drawer'

/**
 * Write component description for docs tab.
 */
const component = `
  Component displayed inside _Overlay_ drawer attached to _Site Header_.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Menu Drawer',
  component: MenuDrawer,
  args: {
    customersEnabled: true,
    customersLoggedIn: true,
    handle: 'mobile-menu',
    itemCount: 7,
  },
  argTypes: {
    isActive: {
      table: { disable: true },
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center">
          <div class="story-drawer">
            <story />
          </div>
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
const Template = (args) => ({
  components: { MenuDrawer },
  setup() {
    window.cnvs.customer.enabled = args.customersEnabled
    window.cnvs.customer.loggedIn = args.customersLoggedIn

    return { args }
  },
  template: `
    <overlay
      key="menuDrawer"
      block-class="menu-drawer-overlay"
      direction="right"
      namespace="menuDrawer"
      :template="false"
      type="drawer"
    >
      <template #body="overlay">
        <menu-drawer
          v-bind="args"
          :overlay="overlay"
        />
      </template>
    </overlay>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Loading story.
 */
export const Loading = Template.bind({})

Loading.args = {
  handle: '',
}
