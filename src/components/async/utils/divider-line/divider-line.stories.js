/**
 * Storybook: Divider line (divider-line)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import DividerLine from './divider-line'

/**
 * Write component description for docs tab.
 */
const component = `
  Divider line with support for text and dark mode.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Divider Line',
  component: DividerLine,
  args: {
    label: 'Label',
    large: false,
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
  components: { DividerLine },
  setup() {
    return { args }
  },
  template: `
    <div style="background-color: #fff; padding: 1rem;">
      <divider-line v-bind="args" />
    </div>

    <div style="background-color: #f3f3f3; padding: 1rem;">
      <divider-line v-bind="args" />
    </div>

    <div style="background-color: #333; padding: 1rem;">
      <divider-line v-bind="args" dark />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
