/**
 * Storybook: Free shipping notification (free-shipping-notification)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import { mapActions } from 'vuex'

import FreeShippingNotification from './free-shipping-notification'

/**
 * Write component description for docs tab.
 */
const component = `
  Free Shipping Notification snippet that takes in a threshold and displays a progress bar for how far away the user is from recieving free shipping.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Free Shipping Notification',
  component: FreeShippingNotification,
  args: {
    // No args
    cartTotal: 5000,
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
  components: { FreeShippingNotification },
  setup() {
    return { args }
  },
  mounted() {
    this.setCartResponse({
      total_price: args.cartTotal,
    })
  },
  methods: {
    ...mapActions({
      setCartResponse: 'cart/setStoryResponse',
    }),
  },
  template: '<free-shipping-notification v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
