/**
 * Storybook: $formatMoney() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */

/**
 * Write component description for docs tab.
 */
const component = `
  \`$formatMoney()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$formatMoney()',
  args: {
    currency: cnvs.store.moneyFormat.split('{{')[0],
    format: cnvs.store.moneyFormat.split('{{')[1].replace('}}', ''),
    value: 100000,
  },
  argTypes: {
    format: {
      control: {
        type: 'select',
      },
      options: [
        'amount',
        'amount_no_decimals',
        'amount_with_comma_separator',
        'amount_no_decimals_with_comma_separator',
      ],
    },
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
  setup() {
    return { args }
  },
  methods: {
    getCode() {
      let code = `this.$formatMoney(${args.value})`

      if (args.currency && args.format) {
        const format = `${args.currency}{{${args.format}}}`

        if (format !== cnvs.store.moneyFormat) {
          code = `this.$formatMoney(${args.value}, '${format}')`
        }
      }

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      if (typeof args.value !== 'number' || args.value < 0) {
        return '❌ Value must be a number that\'s 0 or greater'
      }

      if (args.currency && args.format) {
        const format = `${args.currency}{{${args.format}}}`
        return this.$formatMoney(args.value, format)
      }

      return this.$formatMoney(args.value)
    },
  },
  template: `
    <div class="story-helpers">
      <code v-html="getCode()" />

      <div
        class="example"
        v-text="getExample()"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
