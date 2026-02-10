/**
 * Storybook: Article item (article-item)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ArticleItem from './article-item'

/**
 * Write component description for docs tab.
 */
const component = `
  Blog article snippet.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Article Item',
  component: ArticleItem,
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
  components: { ArticleItem },
  setup() {
    return { args }
  },
  template: '<article-item v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
