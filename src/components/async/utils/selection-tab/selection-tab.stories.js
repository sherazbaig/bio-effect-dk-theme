/**
 * Storybook: Selection tab (selection-tab)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import SelectionTab from './selection-tab'

/**
 * Write component description for docs tab.
 */
const component = `
  Simple tab buttons with active, disabled, and initial states.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Utils/Selection tab',
  component: SelectionTab,
  args: {
    currentValue: '1',
    tabs: [
      {
        id: 'tab-1',
        disabled: false,
        label: 'Tab 1',
        value: '1',
      },
      {
        id: 'tab-2',
        disabled: false,
        label: 'Tab 2',
        value: '2',
      },
      {
        id: 'tab-3',
        disabled: false,
        label: 'Tab 3',
        value: '3',
      },
      {
        id: 'tab-4',
        disabled: false,
        label: 'Tab 4',
        loading: true,
        value: '4',
      },
      {
        id: 'tab-5',
        disabled: true,
        label: 'Tab 5',
        value: '5',
      },
    ],
    name: 'storybook',
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center">
          <story />
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
const object = (args, { updateArgs }) => ({
  components: { SelectionTab },
  setup() {
    return { args }
  },
  watch: {
    modelValue(newValue) {
      updateArgs({ ...args, currentValue: newValue })
    },
  },
  template: `
    <div style="display: flex; gap: 1rem">
      <selection-tab
        v-for="(tab) of args.tabs"
        v-model="args.currentValue"
        :key="tab.id"
        :id="tab.id"
        :disabled="tab.disabled"
        :label="tab.label"
        :loading="tab.loading"
        :name="args.name"
        :title="tab.title"
        :value="tab.value"
        :url="tab.url"
      />
    </div>
  `,
})

const Template = (args, { updateArgs }) => object(args, { updateArgs })

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Button story.
 */
export const Button = Template.bind({})

Button.args = {
  tabs: [
    {
      id: 'tab-1',
      label: 'Tab 1',
      title: 'Title for tab 1',
      url: 'https://google.com/',
    },
    {
      id: 'tab-2',
      label: 'Tab 2',
      title: 'Title for tab 2',
      url: 'https://google.com/',
    },
    {
      id: 'tab-3',
      label: 'Tab 3',
      title: 'Title for tab 3',
      url: 'https://google.com/',
    },
    {
      id: 'tab-4',
      label: 'Tab 4',
      title: 'Title for tab 4',
      url: 'https://google.com/',
    },
    {
      id: 'tab-5',
      label: 'Tab 5',
      title: 'Title for tab 5',
      url: 'https://google.com/',
    },
  ],
}
