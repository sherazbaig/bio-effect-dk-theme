/**
 * Storybook: Review Stars (review-stars
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ReviewStars from './review-stars'

/**
 * Write component description for docs tab.
 */
const component = `
  Review stars utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Review Stars',
  component: ReviewStars,
  args: {
    totalRating: 5,
    currentRating: 4,
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
  components: { ReviewStars },
  setup() {
    return { args }
  },
  template: `
    <div class="mt-2xl ml-2xl">
      <review-stars
        v-bind="args"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
