/**
 * Storybook: $variable() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */

/**
 * Write component description for docs tab.
 */
const component = `
  \`$variable()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$variable()',
  args: {
    path: 'routes.account.login',
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
    getJson() {
      const object = {}
      const parts = args.path.split('.')
      const variable = this.$variable(args.path)
      object[parts[0]] = object[parts[0]] || {}

      switch (parts.length) {
        case 1:
          object[parts[0]] = variable
          break
        case 2:
          object[parts[0]] = object[parts[0]] || {}
          object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || variable
          break
        case 3:
          object[parts[0]] = object[parts[0]] || {}
          object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || {}
          object[parts[0]][parts[1]][parts[2]] = object[parts[0]][parts[1]][parts[2]] || variable
          break
        case 4:
          object[parts[0]] = object[parts[0]] || {}
          object[parts[0]][parts[1]] = object[parts[0]][parts[1]] || {}
          object[parts[0]][parts[1]][parts[2]] = object[parts[0]][parts[1]][parts[2]] || {}

          object[parts[0]][parts[1]][parts[2]][parts[3]] =
            object[parts[0]][parts[1]][parts[2]][parts[3]] || variable
          break
      }

      const json = JSON.stringify(object, null, 2)
        .replace(/"(?!:)(?!\w+?":)/g, `'`)
        .replace(/"/g, '')

      return `
        <label>Variables</label>
        const cnvs = ${json}
      `
    },
    getCode() {
      const code = `this.$variable('${args.path}')`

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      if (!args.path) {
        return '❌ Path is required'
      }

      return this.$variable(args.path) || 'false'
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
