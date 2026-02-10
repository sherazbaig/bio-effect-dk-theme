/**
 * Storybook: main-collection-filter-sidebar (main-collection-filter-sidebar)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MainCollectionFilterSidebar from './main-collection-filter-sidebar'

/**
 * Write component description for docs tab.
 */
const component = `
  Main Collection Filter Sidebar.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Main-Collection-Filter-Sidebar',
  component: MainCollectionFilterSidebar,
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
  components: { MainCollectionFilterSidebar },
  setup() {
    return { args }
  },
  template: '<main-collection-filter-sidebar v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
