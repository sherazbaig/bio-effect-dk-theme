/**
 * Storybook: Product form (product-form)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ProductForm from './product-form'

/**
 * Write component description for docs tab.
 */
const component = `
  Standalone product form for handling variant and quantity updates, and adding product to cart.

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
  title: 'Async/Product Form',
  component: ProductForm,
  args: {
    handle: cnvs.page.handle,
    product: {
      hasOnlyDefaultVariant: false,
    },
    variant: false,
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center" style="max-width: 576px;">
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
const Template = (args, { updateArgs }) => ({
  components: { ProductForm },
  setup() {
    return { args }
  },
  async mounted() {

    /**
     * This prevents spamming the request.
     */
    if (!args.handle || args.product?.handle === args.handle) {
      return
    }

    try {
      const [product] = await this.sbQueryProducts([args.handle])
      updateArgs({ ...args, product })

    } catch (error) {
      throw new Error('Failed to load product', error)
    }
  },
  methods: {
    updateVariant(variant) {
      updateArgs({ ...args, variant })
    },
  },
  template: '<product-form v-bind="args" @update-variant="updateVariant" />',
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
  product: {
    hasOnlyDefaultVariant: true,
  },
}
