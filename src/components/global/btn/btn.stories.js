/**
 * Storybook: Btn (btn)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import Btn from './btn'

import IconAlert from '~icons/general/alert.svg'
import IconArrowLeft from '~icons/directional-navigation/arrow/left.svg'
import IconArrowRight from '~icons/directional-navigation/arrow/right.svg'
import IconCheck from '~icons/general/check.svg'

/**
 * Write component description for docs tab.
 */
const component = `
  \`<button>\` and \`<a>\` replacement component so all buttons can be updated from a single set of files.

  See [documentation](https://we-make-websites.gitbook.io/canvas/components/default-components/btn) for more details.

  ## Notes
  * Clicking the button when no \`url\` prop is provided will show \`stateIcon\`
  * Refresh the page to reset button state
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Btn',
  component: Btn,
  args: {
    hoverIcon: 'none',
    icon: 'icon-arrow-right',
    label: 'Add to Cart',
    modifiers: 'primary center',
    showIcon: false,
    showStateIcon: false,
    stateIcon: 'icon-loading',
    type: '',
    url: '',
  },
  argTypes: {
    hoverIcon: {
      control: {
        labels: {
          none: 'None',
          'icon-check': 'Check (icon-check)',
        },
        type: 'select',
      },
      options: [
        'none',
        'icon-check',
      ],
    },
    icon: {
      control: {
        labels: {
          'icon-arrow-left': 'Arrow left (icon-arrow-left)',
          'icon-arrow-right': 'Arrow right (icon-arrow-right)',
        },
        type: 'select',
      },
      options: [
        'icon-arrow-left',
        'icon-arrow-right',
      ],
    },
    modifiers: {
      control: { type: 'inline-check' },
      options: [
        'primary',
        'secondary',
        'fill',
        'text',
        'block',
        'center',
        'reversed',
        'dark',
      ],
    },
    stateIcon: {
      control: {
        labels: {
          'icon-alert': 'Alert (icon-alert)',
          'icon-loading': 'Loading (icon-loading)',
        },
        type: 'select',
      },
      options: [
        'icon-alert',
        'icon-loading',
      ],
    },
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
const object = (args, { updateArgs }) => ({
  components: {
    Btn,
    IconAlert,
    IconArrowLeft,
    IconArrowRight,
    IconCheck,
  },
  setup() {
    return { args }
  },
  methods: {
    handleClick(event) {
      if (event.target.href && event.target.href !== '') {
        return
      }

      event.preventDefault()
      updateArgs({ ...args, showStateIcon: true })
    },
  },
  template: `
    <div style="padding: 1rem;">
      <btn
        v-bind="args"
        @click="handleClick"
      >
        <template #icon>
          <component is="${args.icon}" />
        </template>

        <template v-if="args.hoverIcon === 'icon-check'" #hoverIcon>
          <component is="${args.hoverIcon}" />
        </template>

        <template #stateIcon>
          <component is="${args.stateIcon}" />
        </template>
      </btn>
    </div>
  `,
})

const Template = (args, { updateArgs }) => object(args, { updateArgs })

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Text Link story.
 */
export const AllButtons = (args, { updateArgs }) => ({
  ...object(args, { updateArgs }),
  template: `
    <div class="is-tabbable" style="padding: 1rem;">
      <table cellpadding="10" cellspacing="0">
        <tr>
          <th></th>
          <th>Primary</th>
          <th>Secondary</th>
          <th>Fill</th>
          <th>Text</th>
        </tr>
        <tr>
          <td>Initial</td>
          <td><btn label="Button" modifiers="primary" /></td>
          <td><btn label="Button" modifiers="secondary" /></td>
          <td><btn label="Button" modifiers="fill" /></td>
          <td><btn label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Hover</td>
          <td><btn class="is-hover" label="Button" modifiers="primary" /></td>
          <td><btn class="is-hover" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-hover" label="Button" modifiers="fill" /></td>
          <td><btn class="is-hover" label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Disabled</td>
          <td><btn class="is-disabled" label="Button" modifiers="primary" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="fill" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Focus</td>
          <td><btn class="is-focus" label="Button" modifiers="primary" /></td>
          <td><btn class="is-focus" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-focus" label="Button" modifiers="fill" /></td>
          <td><btn class="is-focus" label="Button" modifiers="text" /></td>
        </tr>
      </table>
    </div>

    <div class="is-tabbable" style="background-color: #F3F3F3; padding: 1rem">
      <table cellpadding="10" cellspacing="0">
        <tr>
          <td>Initial</td>
          <td><btn label="Button" modifiers="primary" /></td>
          <td><btn label="Button" modifiers="secondary" /></td>
          <td><btn label="Button" modifiers="fill" /></td>
          <td><btn label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Hover</td>
          <td><btn class="is-hover" label="Button" modifiers="primary" /></td>
          <td><btn class="is-hover" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-hover" label="Button" modifiers="fill" /></td>
          <td><btn class="is-hover" label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Disabled</td>
          <td><btn class="is-disabled" label="Button" modifiers="primary" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="fill" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="text" /></td>
        </tr>
        <tr>
          <td>Focus</td>
          <td><btn class="is-focus" label="Button" modifiers="primary" /></td>
          <td><btn class="is-focus" label="Button" modifiers="secondary" /></td>
          <td><btn class="is-focus" label="Button" modifiers="fill" /></td>
          <td><btn class="is-focus" label="Button" modifiers="text" /></td>
        </tr>
      </table>
    </div>

    <div class="is-tabbable" style="background-color: #333333; padding: 1rem;">
      <table cellpadding="10" cellspacing="0">
        <tr>
          <th style="color: #ffffff;"></th>
          <th style="color: #ffffff;">Primary, Dark</th>
          <th style="color: #ffffff;">Secondary, Dark</th>
          <th style="color: #ffffff;">Fill, Dark</th>
          <th style="color: #ffffff;">Text, Dark</th>
        </tr>
        <tr>
          <td style="color: #ffffff;">Initial</td>
          <td><btn label="Button" modifiers="primary dark" /></td>
          <td><btn label="Button" modifiers="secondary dark" /></td>
          <td><btn label="Button" modifiers="fill dark" /></td>
          <td><btn label="Button" modifiers="text dark" /></td>
        </tr>
        <tr>
          <td style="color: #ffffff;">Hover</td>
          <td><btn class="is-hover" label="Button" modifiers="primary dark" /></td>
          <td><btn class="is-hover" label="Button" modifiers="secondary dark" /></td>
          <td><btn class="is-hover" label="Button" modifiers="fill dark" /></td>
          <td><btn class="is-hover" label="Button" modifiers="text dark" /></td>
        </tr>
        <tr>
          <td style="color: #ffffff;">Disabled</td>
          <td><btn class="is-disabled" label="Button" modifiers="primary dark" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="secondary dark" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="fill dark" /></td>
          <td><btn class="is-disabled" label="Button" modifiers="text dark" /></td>
        </tr>
        <tr>
          <td style="color: #ffffff;">Focus</td>
          <td><btn class="is-focus" label="Button" modifiers="primary dark" /></td>
          <td><btn class="is-focus" label="Button" modifiers="secondary dark" /></td>
          <td><btn class="is-focus" label="Button" modifiers="fill dark" /></td>
          <td><btn class="is-focus" label="Button" modifiers="text dark" /></td>
        </tr>
      </table>
    </div>
  `,
})
