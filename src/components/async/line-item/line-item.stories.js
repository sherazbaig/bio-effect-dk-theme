/**
 * Storybook: Line item (line-item)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { mapActions } from 'vuex'

import LineItem from './line-item'

/**
 * Write component description for docs tab.
 */
const component = `
  Self-contained line item displaying product data with quantity and remove controls.

  ## Notes
  * Displayed item is based on value of supplied \`handle\` prop and does not reflect the site's cart
  * Quantity selector and remove buttons do not work in Storybook
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Line Item',
  component: LineItem,
  args: {
    handle: cnvs.page.handle,
    lineItem: false,
    product: {},
    quantity: 1,
    storybookState: 'primary',
  },
  argTypes: {
    product: {
      table: { disable: true },
    },
    quantity: {
      control: {
        max: 6,
        min: 1,
        step: 1,
        type: 'range',
      },
    },
    storybookState: {
      table: { disable: true },
    },
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
const Template = (args, { updateArgs }) => ({
  components: { LineItem },
  setup() {
    return { args }
  },
  async mounted() {
    if (!args.handle) {
      return
    }

    /**
     * If handle already loaded then just update quantity.
     * - This prevents spamming the request.
     */
    if (args.lineItem?.handle === args.handle) {
      if (args.lineItem?.quantity !== args.quantity) {
        const lineItem = this.convertProductToLineItem(args.product, args.quantity)
        updateArgs({ ...args, lineItem })
      }

      this.setUpdatingState()
      return
    }

    try {
      const [product] = await this.sbQueryProducts([args.handle])
      const lineItem = this.convertProductToLineItem(product, args.quantity)
      updateArgs({ ...args, lineItem, product })

      this.setUpdatingState()

    } catch (error) {
      throw new Error('Failed to load line item', error)
    }
  },
  methods: {
    ...mapActions({
      setStatus: 'cart/setStoryStatus',
    }),

    /**
     * Ignore clicks on line item.
     */
    handleClick(event) {
      event.preventDefault()
    },

    /**
     * Set state of first item to updating.
     */
    setUpdatingState() {
      if (args.storybookState !== 'updating') {
        return
      }

      setTimeout(() => {
        this.setStatus({
          items: [args.item.key],
          label: 'updating',
        })
      }, 500)
    },
  },
  template: '<line-item v-bind="args" @click="handleClick" />',
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
 * Updating story.
 */
export const Updating = Template.bind({})

Updating.args = {
  storybookState: 'updating',
}
