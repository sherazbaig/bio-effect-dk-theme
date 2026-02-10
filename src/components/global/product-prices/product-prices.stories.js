/**
 * Storybook: Product prices (product-prices)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ProductPrices from './product-prices'

/**
 * Write component description for docs tab.
 */
const component = `
  Displays product and line item prices.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Product Prices',
  component: ProductPrices,
  args: {
    available: true,
    compareAtPrice: false,
    element: 'span',
    price: 10000,
    priceFirst: true,
    varies: false,
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center">
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
const Template = (args) => ({
  components: { ProductPrices },
  setup() {
    return { args }
  },
  template: '<product-prices v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})

/**
 * Compare at price story.
 */
export const CompareAtPrice = Template.bind({})

CompareAtPrice.args = {
  compareAtPrice: 10000,
  price: 5000,
}

/**
 * Sold out story
 */
export const SoldOut = Template.bind({})

SoldOut.args = {
  available: false,
}

/**
 * Varies story
 */
export const Varies = Template.bind({})

Varies.args = {
  varies: true,
}
