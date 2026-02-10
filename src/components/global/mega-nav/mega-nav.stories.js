/**
 * Storybook: mega-nav (mega-nav)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MegaNav from './mega-nav'

/**
 * Write component description for docs tab.
 */
const component = `
  Mega nav.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Mega-Nav',
  component: MegaNav,
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
  components: { MegaNav },
  setup() {
    return { args }
  },
  template: '<mega-nav v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
