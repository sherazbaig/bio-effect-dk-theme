/**
 * Storybook: Toggle switch (toggle-switch)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ToggleSwitch from './toggle-switch'

/**
 * Write component description for docs tab.
 */
const component = `
  Toggle input utility component, represents stylised checkbox.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Toggle Switch',
  component: ToggleSwitch,
  args: {
    labelFalse: 'False label',
    labelTrue: 'True label',
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
  components: { ToggleSwitch },
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
          <td><toggle-switch v-bind="args" id="testing-1" checked /></td>
          <td><toggle-switch v-bind="args" id="testing-2" /></td>
        </tr>
        <tr>
          <td>Hover</td>
          <td><toggle-switch class="is-hover" v-bind="args" id="testing-3" checked /></td>
          <td><toggle-switch class="is-hover" v-bind="args" id="testing-4" /></td>
        </tr>
        <tr>
          <td>Disabled</td>
          <td><toggle-switch v-bind="args" id="testing-5" checked disabled /></td>
          <td><toggle-switch v-bind="args" id="testing-6" disabled /></td>
        </tr>
        <tr>
          <td>Focus</td>
          <td><toggle-switch class="is-focus" v-bind="args" id="testing-7" checked /></td>
          <td><toggle-switch class="is-focus" v-bind="args" id="testing-8" /></td>
        </tr>
      </table>
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
