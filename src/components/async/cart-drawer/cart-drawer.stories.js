/**
 * Storybook: Cart drawer (cart-drawer)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { mapActions, mapState } from 'vuex'

import CartDrawer from './cart-drawer'

/**
 * Write component description for docs tab.
 */
const component = `
  Component displayed inside _Overlay_ drawer attached to _Site Header_.

  ## Notes
  Displayed items are based on values of supplied \`handles\` prop and does not reflect the site's cart.<br>
  Close, quantity selector, remove, and CTA buttons will not work.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Cart Drawer',
  component: CartDrawer,
  args: {
    handles: cnvs.storybook.product.array.slice(0, 2),
    isActive: true,
    items: [],
    storybookState: 'primary',
  },
  argTypes: {
    isActive: {
      table: { disable: true },
    },
    storybookState: {
      table: { disable: true },
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center">
          <div class="story-drawer">
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
  components: {
    CartDrawer,
  },
  setup() {
    return { args }
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.response,
    }),
  },
  async mounted() {

    /**
     * If no handles or loading then empty cart.
     */
    if (!args.handles.length || args.storybookState === 'loading') {
      this.setEmptyCart()
    }

    /**
     * If cart already has same items then stop.
     * - Or if no handles then stop so empty cart is shown.
     */
    const cartHandles = this.cart.items.map((item) => item.handle).join()
    const handles = [...args.handles].reverse().join()

    if (cartHandles === handles || !args.handles.length) {
      this.setUpdatingState()
      return
    }

    /**
     * Set cart loading state with placeholder IDs.
     */
    this.setAddingState()

    /**
     * If loading state then don't add products.
     */
    if (args.storybookState === 'loading') {
      return
    }

    try {
      const products = await this.sbQueryProducts(args.handles)

      const items = products.reverse().map((formattedProduct) => {
        return this.convertProductToLineItem(formattedProduct, 1)
      })

      this.setFullCart(items)
      this.setUpdatingState()

    } catch (error) {
      window.console.log('Failed to add/remove products to cart', error)
    }
  },
  methods: {
    ...mapActions({
      setCartResponse: 'cart/setStoryResponse',
      setCartStatus: 'cart/setStoryStatus',
    }),

    /**
     * Add loading placeholders to cart.
     */
    setAddingState() {
      const placeholderCount = Math.max(
        args.handles.length - this.cart.item_count,
        0,
      )

      this.setCartStatus({
        items: [...Array(placeholderCount)].map((_, index) => index),
        label: 'adding',
      })
    },

    /**
     * Set empty cart in Vuex store.
     */
    setEmptyCart() {
      this.setCartResponse({
        currency: null,
        item_count: 0,
        items_subtotal_price: 0,
        items: [],
        original_total_price: 0,
        requires_shipping: false,
        total_price: 0,
      })
    },

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

    /**
     * Set state of first item to updating.
     * - Clears cart status first.
     */
    setUpdatingState() {
      this.setCartStatus({
        items: [],
        label: 'updated',
      })

      if (args.storybookState !== 'updating') {
        return
      }

      setTimeout(() => {
        this.setCartStatus({
          items: [this.cart.items[0].key],
          label: 'updating',
        })
      }, 500)
    },
  },
  template: `
    <overlay
      key="cartDrawer"
      block-class="cart-drawer-overlay"
      direction="left"
      namespace="cartDrawer"
      type="drawer"
    >
      <template #title>
        ${cnvs.strings.cart.title}
      </template>

      <template #body="overlay">
        <cart-drawer
          v-bind="args"
          :overlay="overlay"
        />
      </template>
    </overlay>
  `,
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
  storybookState: 'loading',
}

/**
 * Updating story.
 */
export const Updating = Template.bind({})

Updating.args = {
  storybookState: 'updating',
}

/**
 * Empty story.
 */
export const Empty = Template.bind({})

Empty.args = {
  handles: [],
}
