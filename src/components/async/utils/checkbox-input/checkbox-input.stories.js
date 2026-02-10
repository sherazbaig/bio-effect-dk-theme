/**
 * Storybook: Checkbox input (checkbox-input)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import CheckboxInput from './checkbox-input'

/**
 * Write component description for docs tab.
 */
const component = `
  Checkbox input utility component.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Checkbox Input',
  component: CheckboxInput,
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
  components: { CheckboxInput },
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
          <td><checkbox-input v-bind="args" id="testing-1" checked /></td>
          <td><checkbox-input v-bind="args" id="testing-2" /></td>
        </tr>
        <tr>
          <td>Hover</td>
          <td><checkbox-input class="is-hover" v-bind="args" id="testing-3" checked /></td>
          <td><checkbox-input class="is-hover" v-bind="args" id="testing-4" /></td>
        </tr>
        <tr>
          <td>Disabled</td>
          <td><checkbox-input v-bind="args" id="testing-5" checked disabled /></td>
          <td><checkbox-input v-bind="args" id="testing-6" disabled /></td>
        </tr>
        <tr>
          <td>Focus</td>
          <td><checkbox-input class="is-focus" v-bind="args" id="testing-7" checked /></td>
          <td><checkbox-input class="is-focus" v-bind="args" id="testing-8" /></td>
        </tr>
      </table>
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
