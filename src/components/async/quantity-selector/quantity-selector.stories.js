/**
 * Storybook: Quantity selector (quantity-selector)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { ref } from 'vue'

import QuantitySelector from './quantity-selector'

/**
 * Write component description for docs tab.
 */
const component = `
  Number input with increment and decrement buttons. Emits events which must be handled by parent component.

  See [documentation](https://we-make-websites.gitbook.io/canvas/components/default-components/quantity-selector) for more details.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Quantity Selector',
  component: QuantitySelector,
  args: {
    lineItem: {
      available: true,
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      inventory_quantity: 5,
    },
    large: false,
    min: 1,
    state: 'ready',
  },
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: [
        'error',
        'loading',
        'ready',
        'updating',
      ],
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
const Template = (args) => ({
  components: { QuantitySelector },
  setup() {
    const quantity = ref(1)

    return {
      args,
      quantity,
    }
  },
  template: '<quantity-selector v-bind="args" :quantity="quantity" @update-quantity="handleQuantityUpdate" />',
  methods: {
    handleQuantityUpdate(quantity) {
      this.quantity = quantity
    },
  },
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
