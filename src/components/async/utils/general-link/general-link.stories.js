/**
 * Storybook: General link (general-link)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import GeneralLink from './general-link'

/**
 * Write component description for docs tab.
 */
const component = `
  Link component to used in project.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/General Link',
  component: GeneralLink,
  args: {
    text: 'Link',
    url: 'https://www.google.com',
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center container">
          <div class="component-section" style="width: 250px">
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
  components: { GeneralLink },
  setup() {
    return { args }
  },
  template: '<general-link v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
