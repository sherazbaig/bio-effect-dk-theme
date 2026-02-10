/**
 * Storybook: Checkbox input (checkbox-input)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import GeneralInput from './general-input'

/**
 * Write component description for docs tab.
 */
const component = `
  General input utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/General Input',
  component: GeneralInput,
  args: {
    label: 'Label',
    name: 'general-input',
    value: '',
    placeholder: 'Enter text here...',
    type: 'text',
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
const Template = (args, { updateArgs }) => ({
  components: { GeneralInput },
  setup() {
    return { args }
  },
  methods: {
    onChange: (value) => {
      args.value = value
      updateArgs({ ...args })
    },
  },
  template: `
    <div style="max-width: 300px;" class="mt-2xl ml-2xl">
      <general-input
        v-bind="args"
        id="testing-1"
        @update:model-value="onChange"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
export const WithError = Template.bind({})
export const Disabled = Template.bind({})

WithError.args = {
  errorMessage: 'Hint or error message',
}
Disabled.args = {
  disabled: true,
}
