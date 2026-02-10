/**
 * Storybook: multi-store-settings (multi-store-settings)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MultiStoreSettings from './multi-store-settings'

/**
 * Write component description for docs tab.
 */
const component = `
  Entries for multi store.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Multi-Store-Settings',
  component: MultiStoreSettings,
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
  components: { MultiStoreSettings },
  setup() {
    return { args }
  },
  template: '<multi-store-settings v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
