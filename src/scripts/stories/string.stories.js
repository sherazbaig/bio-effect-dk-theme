/**
 * Storybook: $string() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */

/**
 * Write component description for docs tab.
 */
const component = `
  \`$string()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$string()',
  args: {
    locale: {
      storybook: {
        example: 'Example text',
      },
    },
    path: 'storybook.example',
    pluralise: -1,
    replace: {},
    story: 'primary',
  },
  argTypes: {
    story: {
      table: { disable: true },
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
    cnvs.strings = {
      ...cnvs.strings,
      ...args.locale,
    }

    return { args }
  },
  methods: {
    getJson() {
      const object = {}
      const parts = args.path.split('.')

      for (const [index, part] of parts.entries()) {
        if (!cnvs.strings[part]) {
          break
        }

        object[parts[index]] = cnvs.strings[part]
      }

      const json = JSON.stringify(object, null, 2)

      return `
        <label>Locale</label>
        ${json}
      `
    },
    getCode() {
      const options = {}
      let code = `this.$string('${args.path}')`

      if (args.pluralise > -1) {
        options.pluralise = args.pluralise
      }

      if (Object.keys(args.replace).length) {
        options.replace = args.replace
      }

      if (args.pluralise > -1 || options.replace) {
        const optionsString = JSON.stringify(options, null, 2)
          .replace(/"(?!:)(?!\w+?":)/g, `'`)
          .replace(/"/g, '')

        code = `this.$string('${args.path}', ${optionsString})`
      }

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      const string = this.$string(args.path, { pluralise: args.pluralise, replace: args.replace })

      if (!args.path) {
        return '❌ Path is required'
      }

      if (!args.locale) {
        return '❌ Locale is required'
      }

      if (args.story === 'pluralise') {
        return `${args.pluralise} ${string}`
      }

      return string
    },
  },
  template: `
    <div class="story-helpers">
      <code v-html="getJson()" />
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
 * Pluralise story.
 */
export const Pluralise = Template.bind({})

Pluralise.args = {
  locale: {
    storybook: {
      example: {
        zero: 'zero',
        one: 'one',
        two: 'two',
        few: 'few',
        other: 'other',
      },
    },
  },
  path: 'storybook.example',
  pluralise: 2,
  replace: {},
  story: 'pluralise',
}

/**
 * Replace story.
 */
export const Replace = Template.bind({})

Replace.args = {
  locale: {
    storybook: {
      example: 'Example {{ text }}',
    },
  },
  path: 'storybook.example',
  pluralise: -1,
  replace: {
    text: 'replacement',
  },
  story: 'replace',
}
