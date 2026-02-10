/**
 * Storybook: Checkbox input (checkbox-input)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MessageInput from './message-input'

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
  title: 'Async/Utils/Message Input',
  component: MessageInput,
  args: {
    name: 'message-input',
    id: 'message-input',
    value: '',
    placeholder: 'Enter text here...',
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
  components: { MessageInput },
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
    <div class="mt-2xl ml-2xl">
      <message-input
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
export const Disabled = Template.bind({})

Disabled.args = {
  disabled: true,
}
