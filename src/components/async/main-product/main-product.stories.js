/**
 * Storybook: Main product (main-product)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import MainProduct from './main-product'

/**
 * Write component description for docs tab.
 */
const component = `
  Main product page component which includes the _Product Form_ component.

  ## Notes
  * Displayed product is based on value of supplied \`handle\` prop
  * To avoid sending excess queries it's recommended you update handle using copy and paste
  * Add to cart button does not add to cart, but does show adding and added states
  * Changing variant resets quantity selector, this only happens in Storybook
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Main Product',
  component: MainProduct,
  args: {
    handle: cnvs.storybook.product.default,
    liquid: {
      description: '',
      handle: '',
      hasOnlyDefaultVariant: false,
      price: 10000,
      sectionId: 'storybook',
      title: '',
    },
  },
  argTypes: {
    handle: {
      control: 'text',
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-full-width">
          <div class="component-section container">
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
const Template = (args, { updateArgs }) => ({
  components: { MainProduct },
  setup() {
    return { args }
  },
  async mounted() {
    if (!args.handle || args.liquid.handle === args.handle) {
      return
    }

    try {
      const [liquid] = await this.sbQueryProducts([args.handle])
      updateArgs({ ...args, liquid })

    } catch (error) {
      throw new Error('Failed to load product', error)
    }
  },
  methods: {
    updateRequestObject({ response = false, type }) {
      if (args.liquid.handle === response.handle) {
        return
      }

      updateArgs({ ...args, [type]: response })
    },
  },
  template: '<main-product v-bind="args" @update-request-object="updateRequestObject" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Loading story.
 */
export const Loading = Template.bind({})

Loading.args = {
  handle: false,
  product: false,
}

/**
 * Out of stock story.
 */
export const OutOfStock = Template.bind({})

OutOfStock.args = {
  handle: cnvs.storybook.product.outOfStock,
}

/**
 * Single variant story.
 */
export const SingleVariant = Template.bind({})

SingleVariant.args = {
  handle: cnvs.storybook.product.singleVariant,
  liquid: {
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur ex velit, in varius justo auctor a. Sed orci lorem, gravida et pretium nec, aliquet nec nisl. Aliquam aliquam lorem vitae justo mattis eleifend. Donec tincidunt eros et leo consectetur imperdiet. Aliquam tellus nisl, volutpat eu augue vitae, posuere mollis erat.',
    hasOnlyDefaultVariant: true,
    price: 10000,
    sectionId: 'storybook',
    title: 'Lorem ipsum',
  },
}
