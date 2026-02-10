/**
 * Storybook: Checkbox input (checkbox-input)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import DropdownMenu from './dropdown-menu'

/**
 * Write component description for docs tab.
 */
const component = `
  Message input utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Dropdown Menu',
  component: DropdownMenu,
  args: {
    options: [
      { text: 'Option 1', value: 'option-1' },
      { text: 'Option 2', value: 'option-2' },
      { text: 'Option 3', value: 'option-3' },
      { text: 'Option 4', value: 'option-4' },
    ],
    selected: { text: 'Option 1', value: 'option-1' },
  },
  decorators: [
    () => ({
      template: '<story />',
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
  components: { DropdownMenu },
  setup() {
    return { args }
  },
  template: `
    <div class="mt-2xl ml-2xl" style="max-width: 300px">
      <dropdown-menu
        v-bind="args"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
