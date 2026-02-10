/**
 * Storybook: Progress bar (progress-bar)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ProgressBar from './progress-bar'

/**
 * Write component description for docs tab.
 */
const component = `
  Progress bar utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Progress Bar',
  component: ProgressBar,
  args: {
    progressValue: 34,
    progressText: 'Something is happening...',
  },
  decorators: [
    () => ({
      template: '<story />',
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
  components: { ProgressBar },
  setup() {
    return { args }
  },
  template: `
    <div class="mt-2xl ml-2xl">
      <progress-bar
        v-bind="args"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
