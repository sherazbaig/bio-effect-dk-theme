/**
 * Storybook: Breadcrumbs (breadcrumbs)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import Breadcrumbs from './breadcrumbs'

/**
 * Write component description for docs tab.
 */
const component = `
  Breadcrumbs navigation links.

  ## Notes
  The loading placeholder isn't the correct length because it's not possible to provide it a Liquid loading placeholder in Storybook.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    ancestorTitle: 'Collection',
    ancestorUrl: '#',
    state: 'loading',
    title: 'Placeholder product title',
  },
  argTypes: {
    ancestorUrl: {
      table: { disable: true },
    },
    loadingStory: {
      table: { disable: true },
    },
  },
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
const Template = (args, { updateArgs }) => ({
  components: { Breadcrumbs },
  setup() {
    return { args }
  },
  async mounted() {

    /**
     * This prevents spamming the request.
     */
    if (args.loadingStory || args.state === 'ready') {
      return
    }

    try {
      const collection = await this.sbQueryCollection(cnvs.storybook.collection.default, 1)
      const [product] = await this.sbQueryProducts([cnvs.storybook.product.default])

      /**
       * Update storybook args.
       */
      updateArgs({
        ...args,
        ancestorTitle: args.noAncestorStory ? '' : collection.title,
        state: 'ready',
        title: product.title,
      })

    } catch (error) {
      window.console.log('Failed to load collection or product', error)
    }
  },
  template: '<breadcrumbs v-bind="args" />',
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
  loadingStory: true,
}

/**
 * No ancestor breadcrumb story.
 */
export const NoAncestor = Template.bind({})

NoAncestor.args = {
  ancestorTitle: '',
  noAncestorStory: true,
}
