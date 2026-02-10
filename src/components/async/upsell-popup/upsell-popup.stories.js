/**
 * Storybook: Upsell popup (upsell-popup)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import UpsellPopup from './upsell-popup'

/**
 * Write component description for docs tab.
 */
const component = `
  Upsell/Cross-sell popup to be used across the theme.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Upsell Popup',
  component: UpsellPopup,
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
  components: { UpsellPopup },
  setup() {
    return { args }
  },
  template: '<upsell-popup v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
