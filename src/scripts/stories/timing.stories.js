/**
 * Storybook: $timing() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import timings from '~/config/timings'

/**
 * Write component description for docs tab.
 */
const component = `
  \`$timing()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$timing()',
  args: {
    index: -1,
    printUnit: false,
    story: 'primary',
    timing: 'normal',
    unit: 'ms',
  },
  argTypes: {
    printUnit: {
      control: {
        type: 'boolean',
      },
    },
    story: {
      table: { disable: true },
    },
    timing: {
      control: {
        type: 'select',
      },
      options: Object.keys(timings),
    },
    unit: {
      control: {
        type: 'select',
      },
      options: [
        'ms',
        's',
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
      const options = {}
      let code = `this.$timing('${args.timing}')`

      if (args.index > -1) {
        options.index = args.index
      }

      if (
        (args.index < 0 && args.printUnit === true) ||
        (args.index > -1 && args.printUnit === false)
      ) {
        options.printUnit = args.printUnit
      }

      if (args.unit !== 'ms') {
        options.unit = args.unit
      }

      if (
        options.index > -1 ||
        typeof options.printUnit !== 'undefined' ||
        options.unit
      ) {
        const optionsString = JSON.stringify(options, null, 2)
          .replace(/"(?!:)(?!\w+?":)/g, `'`)
          .replace(/"/g, '')

        code = `this.$timing('${args.timing}', ${optionsString})`
      }

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      if (!args.timing) {
        return '❌ Timing is required'
      }

      let timing = this.$timing(args.timing, {
        printUnit: args.printUnit,
        unit: args.unit,
      })

      if (args.index > -1) {
        timing = this.$timing(args.timing, {
          index: args.index,
          printUnit: args.printUnit,
          unit: args.unit,
        })
      }

      return timing
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

/**
 * AnimationDelay story.
 */
export const AnimationDelay = Template.bind({})

AnimationDelay.args = {
  index: 1,
  printUnit: null,
  story: 'animation-delay',
  unit: 's',
}
