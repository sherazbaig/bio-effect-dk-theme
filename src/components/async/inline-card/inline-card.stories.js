/**
 * Storybook: Inline card (inline-card)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import InlineCard from './inline-card'

/**
 * Write component description for docs tab.
 */
const component = `
  Inline card component (Used to show products, articles and pages cards).
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Inline Card',
  component: InlineCard,
  args: {
    // Add args
    cardData: {
      badges: ['Blog', 'Routines'],
      title: 'Kickstart that spring feeling',
      excerpt: 'The days are getting longer lorem ipsum dolor sit amet. Our experts will show you how to start fresh this spring.',
    },
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
  components: { InlineCard },
  setup() {
    return { args }
  },
  template: '<inline-card v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Loading story.
 */
export const Loading = Template.bind({})

Loading.args = {
  cardData: false,
}
