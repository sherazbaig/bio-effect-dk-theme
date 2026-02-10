/**
 * Storybook: faq-section (faq-section)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import FaqSection from './faq-section'

/**
 * Write component description for docs tab.
 */
const component = `
  FAQ section with title and questions/answers.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Faq-Section',
  component: FaqSection,
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
  components: { FaqSection },
  setup() {
    return { args }
  },
  template: '<faq-section v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
