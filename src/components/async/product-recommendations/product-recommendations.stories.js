/**
 * Storybook: Product recommendations (product-recommendations)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { mapActions, mapState } from 'vuex'

import ProductRecommendations from './product-recommendations'

/**
 * Write component description for docs tab.
 */
const component = `
  Product recommendations section powered by Shopify recommendations API or metafield product list.

  ## Notes
  The recommendations API is not available in Storybook so only fallback products are shown
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Product Recommendations',
  component: ProductRecommendations,
  args: {
    displayEmptyCart: false,
    enableRecommendations: true,
    handle: cnvs.storybook.product.default,
    liquid: {
      productId: 0,
      sectionId: 'storybook',
      title: 'You may also like',
    },
    productCount: 4,
    product: false,
    products: {
      count: 4,
      dynamic: Object.values(cnvs.storybook.product).slice(0, 4),
      section: [],
    },
    recommendationType: 'RELATED',
  },
  argTypes: {
    recommendationType: {
      control: {
        labels: {
          complementary: 'Complementary',
          related: 'Related',
        },
        type: 'select',
      },
      options: [
        'COMPLEMENTARY',
        'RELATED',
      ],
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-full-width component-section">
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
 * Primary story.
 */
const PrimaryTemplate = (args, { updateArgs }) => ({
  components: { ProductRecommendations },
  setup() {
    return {
      args,
    }
  },
  async beforeMount() {
    cnvs.page.type = 'product'

    /**
     * This prevents spamming the request.
     */
    if (!args.handle || args.product?.handle === args.handle) {
      return
    }

    try {
      const [product] = await this.sbQueryProducts([args.handle])

      if (!product || !product.id) {
        return
      }

      updateArgs({ ...args, product })

    } catch (error) {
      throw new Error('Failed to load product', error)
    }
  },
  template: `
    <product-recommendations
      v-bind="args"
      :recommendations="{
        enable: args.enableRecommendations,
        type: args.recommendationType,
      }"
    />
  `,
})

export const Primary = PrimaryTemplate.bind({})

/**
 * Cart story.
 */
const CartTemplate = (args) => ({
  components: { ProductRecommendations },
  setup() {
    return {
      args,
    }
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.response,
    }),
  },
  async beforeMount() {
    cnvs.page.type = 'cart'

    /**
     * If no handles or loading then empty cart.
     */
    if (!args.cartHandles.length) {
      this.setEmptyCart()
    }

    /**
     * If cart already has same items then stop.
     * - Or if no handles then stop so empty cart is shown.
     */
    const cartHandles = this.cart.items.map((item) => item.handle).join()
    const handles = [...args.cartHandles].reverse().join()

    if (cartHandles === handles || !args.cartHandles.length) {
      return
    }

    try {
      const products = await this.sbQueryProducts(args.cartHandles)

      const items = products.reverse().map((product) => {
        return this.convertProductToLineItem(product, 1)
      })

      this.setFullCart(items)

    } catch (error) {
      throw new Error('Failed to add products to cart', error)
    }
  },
  methods: {
    ...mapActions({
      setCartResponse: 'cart/setStoryResponse',
    }),

    /**
     * Build cart response and emit to Vuex store.
     * @param {Array} items - Formatted line items.
     */
    setFullCart(items) {
      const itemCount = items.reduce((previous, current) => {
        return (
          (typeof previous === 'number' ? previous : previous.quantity) +
          current.quantity
        )
      })

      const totalPrice = items.reduce((previous, current) => {
        return (
          (typeof previous === 'number' ? previous : previous.final_line_price) +
          current.final_line_price
        )
      })

      this.setCartResponse({
        currency: cnvs.store.currency,
        item_count: itemCount,
        items_subtotal_price: totalPrice,
        items,
        original_total_price: totalPrice,
        requires_shipping: true,
        total_price: totalPrice,
      })
    },
  },
  template: `
    <product-recommendations
      v-bind="args"
      :recommendations="{
        enable: args.enableRecommendations,
        type: args.recommendationType,
      }"
    />
  `,
})

export const Cart = CartTemplate.bind({})

Cart.args = {
  cartHandles: [
    cnvs.storybook.product.default,
    cnvs.storybook.product.multiImage,
  ],
}
