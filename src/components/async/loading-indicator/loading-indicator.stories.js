/**
 * Storybook: Loading Indicator (loading-indicator)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import LoadingIndicator from './loading-indicator'

/**
 * Write component description for docs tab.
 */
const component = `
  Self-contained loading indicator displaying loading state.

  ## Notes
  * Displayed loading state
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Loading Indicator',
  component: LoadingIndicator,
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
  components: { LoadingIndicator },
  setup() {
    return { args }
  },
  template: '<loading-indicator />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
