/**
 * Storybook: country-select (country-select)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import CountrySelect from './country-select'

/**
 * Write component description for docs tab.
 */
const component = `
  Country Selector.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Country-Select',
  component: CountrySelect,
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
  components: { CountrySelect },
  setup() {
    return { args }
  },
  template: '<country-select v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
