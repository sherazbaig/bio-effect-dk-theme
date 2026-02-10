/**
 * Storybook: Notification panel (notification-panel)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import NotificationPanel from './notification-panel'

/**
 * Write component description for docs tab.
 */
const component = `
  Temporary notification panel to indicate errors or success messages.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Notification Panel',
  component: NotificationPanel,
  args: {
    classText: '',
    classTitle: '',
    showClose: true,
    text: 'Body',
    timeout: 0,
    title: 'Heading',
    toast: false,
  },
  argTypes: {
    type: {
      table: { disable: true },
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
const Template = (args) => ({
  components: { NotificationPanel },
  setup() {
    return { args }
  },
  template: `
    <div style="margin-block-end: 1rem;">
      <notification-panel v-bind="args" type="error" />
    </div>

    <div style="margin-block-end: 1rem;">
      <notification-panel v-bind="args" type="success" />
    </div>

    <div style="margin-block-end: 1rem;">
      <notification-panel v-bind="args" />
    </div>

    <div style="margin-block-end: 1rem;">
      <notification-panel v-bind="args" type="info" />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
