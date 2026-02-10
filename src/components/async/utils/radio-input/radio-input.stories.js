/**
 * Storybook: Radio input (radio-input)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import RadioInput from './radio-input'

/**
 * Write component description for docs tab.
 */
const component = `
  Radio input utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Radio Input',
  component: RadioInput,
  args: {
    label: 'Label',
    name: 'testing',
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
  components: { RadioInput },
  setup() {
    return { args }
  },
  template: `
    <div class="is-tabbable" style="padding: 1rem;">
      <table cellpadding="10" cellspacing="0">
        <tr>
          <th></th>
          <th>Active</th>
          <th>Inactive</th>
        </tr>
        <tr>
          <td>Initial</td>
          <td><radio-input v-bind="args" id="testing-1" checked name="initial" value="testing-1" /></td>
          <td><radio-input v-bind="args" id="testing-2" name="initial" value="testing-2" /></td>
        </tr>
        <tr>
          <td>Hover</td>
          <td><radio-input class="is-hover" v-bind="args" id="testing-3" checked name="hover" value="testing-3" /></td>
          <td><radio-input class="is-hover" v-bind="args" id="testing-4" name="hover" value="testing-4" /></td>
        </tr>
        <tr>
          <td>Disabled</td>
          <td><radio-input v-bind="args" id="testing-5" checked disabled name="disabled" value="testing-5" /></td>
          <td><radio-input v-bind="args" id="testing-6" disabled name="disabled" value="testing-6" /></td>
        </tr>
        <tr>
          <td>Focus</td>
          <td><radio-input class="is-focus" v-bind="args" id="testing-7" checked name="focus" value="testing-7" /></td>
          <td><radio-input class="is-focus" v-bind="args" id="testing-8" name="focus" value="testing-8" /></td>
        </tr>
      </table>
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
