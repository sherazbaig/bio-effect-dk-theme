/**
 * Storybook: Newsletter form (newsletter-form)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import NewsletterForm from './newsletter-form'

/**
 * Write component description for docs tab.
 */
const component = `
  A form subscription to a Klaviyo newsletter list.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Newsletter Form',
  component: NewsletterForm,
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
  components: { NewsletterForm },
  setup() {
    return { args }
  },
  template: '<newsletter-form v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
