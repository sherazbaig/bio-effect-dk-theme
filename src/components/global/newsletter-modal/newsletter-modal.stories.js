/**
 * Storybook: Newsletter modal (newsletter-modal)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import NewsletterModal from './newsletter-modal'

/**
 * Write component description for docs tab.
 */
const component = `
  An automatic, delayed modal for prompting newsletter subscriptions.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Newsletter Modal',
  component: NewsletterModal,
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
  components: { NewsletterModal },
  setup() {
    return { args }
  },
  template: '<newsletter-modal v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
