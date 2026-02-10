/**
 * Storybook: Format helper
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */

/**
 * Write component description for docs tab.
 */
const component = `
  \`$formatImageUrl()\` helper function examples.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Helpers/$formatImageUrl()',
  args: {
    src: 'https://cdn.shopify.com/static/sample-images/shoes.jpeg?v=1234567890',
    options: '',
    'options.crop': '',
    'options.height': 0,
    'options.pad_color': '',
    'options.width': 500,
  },
  argTypes: {
    src: {
      description: 'Image URL, can include existing parameters',
      type: {
        required: true,
      },
    },
    options: {
      description: 'Pass a string to override options object to use old #x# format',
    },
    'options.crop': {
      if: {
        arg: 'options',
        truthy: false,
      },
      control: {
        labels: {
          '': 'No crop set',
          bottom: 'Bottom',
          center: 'Center',
          left: 'Left',
          right: 'Right',
          top: 'Top',
        },
        type: 'select',
      },
      description: 'Crop image positioning when height and width are set',
      options: [
        '',
        'bottom',
        'center',
        'left',
        'right',
        'top',
      ],
    },
    'options.height': {
      if: {
        arg: 'options',
        truthy: false,
      },
      description: 'Height of image in pixels',
    },
    'options.pad_color': {
      if: {
        arg: 'options',
        truthy: false,
      },
      description: 'Background colour to pad image when image cannot be cropped',
    },
    'options.width': {
      if: {
        arg: 'options',
        truthy: false,
      },
      description: 'Width of image in pixels',
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
    controls: {
      sort: 'none',
    },
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
      const label = '<label>Code</label>'

      if (args.options) {
        return `
          ${label}
          this.$formatImageUrl('${args.src}', '${args.options}')
        `
      }

      let code = `this.$formatImageUrl('${args.src}', {\n`

      const active = ['crop', 'format', 'height', 'pad_color', 'width'].filter((property) => {
        return args[`options.${property}`]
      })

      active.forEach((property, index) => {
        const quote = ['crop', 'pad_color'].includes(property) ? `'` : ''
        const eol = index + 1 === active.length ? '' : ','

        code += `${property}: ${quote}${args[`options.${property}`]}${quote}${eol}\n`
      })

      code += '})'

      return `
        ${label}
        ${code}
      `
    },
    getSrc() {
      if (args.options) {
        return this.$formatImageUrl(args.src, args.options)
      }

      return this.$formatImageUrl(args.src, {
        crop: args['options.crop'],
        format: args['options.format'],
        height: args['options.height'],
        pad_color: args['options.pad_color'],
        width: args['options.width'],
      })
    },
  },
  template: `
    <div class="story-helpers">
      <code v-html="getCode()" />

      <div class="example">
        <p
          style="margin-block-end: 1rem;"
          v-text="getSrc()"
        />

        <img
          alt=""
          :src="getSrc()"
        >
      </div>
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
