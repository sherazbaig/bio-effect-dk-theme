/**
 * Storybook: Product card (product-card)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ProductCard from './product-card'

/**
 * Write component description for docs tab.
 */
const component = `
  Self-contained card displaying product data.

  ## Notes
  * Displayed product is based on value of supplied \`handle\` prop
  * To avoid sending excess queries it's recommended you update handle using copy and paste
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Product Card',
  component: ProductCard,
  args: {
    handle: cnvs.page.handle,
    product: false,
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center" style="max-width: 370px;">
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
  components: { ProductCard },
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
    handleClick(event) {
      event.preventDefault()
    },
  },
  template: '<product-card v-bind="args" @click="handleClick" />',
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
 * Badge story.
 */
export const WithBadgeAndAwards = Template.bind({})

WithBadgeAndAwards.args = {
  handle: 'wmw-egf-serum-case',
}
