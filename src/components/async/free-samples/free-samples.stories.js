/**
 * Storybook: Free samples (free-samples)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import FreeSamples from './free-samples'

/**
 * Write component description for docs tab.
 */
const component = `
  Free sample products with purchase.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Free Samples',
  component: FreeSamples,
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
  components: { FreeSamples },
  setup() {
    return { args }
  },
  template: '<free-samples v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
