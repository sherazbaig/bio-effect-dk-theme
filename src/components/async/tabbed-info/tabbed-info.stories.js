/**
 * Storybook: Tabbed info (tabbed-info)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import TabbedInfo from './tabbed-info'

/**
 * Write component description for docs tab.
 */
const component = `
  Tabbed info section.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Tabbed Info',
  component: TabbedInfo,
  args: {
    // Add args
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center container">
          <div class="story-full-width component-section">
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
  components: { TabbedInfo },
  setup() {
    return { args }
  },
  template: '<tabbed-info v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
