/**
 * Storybook: $class() helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import classes from '~/config/classes'

/**
 * Write component description for docs tab.
 */
const component = `
  \`$class()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$class()',
  args: {
    class: 'active',
  },
  argTypes: {
    class: {
      control: {
        type: 'select',
      },
      options: Object.keys(classes),
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
      const code = `this.$class('${args.class}')`

      return `
        <label>Code</label>
        ${code}
      `
    },
    getExample() {
      if (!args.class) {
        return '❌ Class is required'
      }

      return this.$class(args.class)
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
