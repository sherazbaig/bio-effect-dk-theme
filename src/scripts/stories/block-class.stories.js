/**
 * Storybook: $blockClass() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */

/**
 * Write component description for docs tab.
 */
const component = `
  \`$blockClass()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$blockClass()',
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
      const config = []

      if (args.element) {
        config.push(`'${args.element}'`)
      }

      if (args.modifier) {
        if (!args.element) {
          config.push(`''`)
        }

        config.push(`'${args.modifier}'`)
      }

      const configString = config.length
        ? `, ${config.join(', ')}`
        : ''

      const code = `this.$blockClass('${args.blockClass}'${configString})`

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      if (!args.blockClass) {
        return '❌ Block class is required'
      }

      return this.$blockClass(args.blockClass, args.element, args.modifier)
    },
  },
  template: `
    <div class="story-helpers">
      <code v-html="getCode()" />

      <div
        class="example"
        :class="{ 'has-error': error }"
        v-text="getExample()"
      />
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})

Primary.args = {
  blockClass: 'main-product',
  element: '',
  modifier: '',
}

/**
 * Primary story.
 */
export const Element = Template.bind({})

Element.args = {
  blockClass: 'main-product',
  element: 'image',
  modifier: '',
}

/**
 * Primary story.
 */
export const Modifier = Template.bind({})

Modifier.args = {
  blockClass: 'main-product',
  element: '',
  modifier: 'dark-mode',
}
