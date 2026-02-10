/**
 * Storybook: Promo card (promo-card)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import PromoCard from './promo-card'

/**
 * Write component description for docs tab.
 */
const component = `
  Promo Card - Used as in grid content in plp.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Promo Card',
  component: PromoCard,
  args: {
    cardData: {
      title: '20% Off OSA Water Mist',
      description: 'Refreshing, rebalancing & rehydrating facial mist.',
      url: null,
      image: {
        alt: null,
        aspectRatio: 1.194560669456067,
        height: 478,
        id: 34623144591670,
        src: '//bioeffect-eu.myshopify.com/cdn/shop/files/Rectangle_10_779b2d08-6be0-492e-976f-8c1bc80f7bf3.jpg?v=1690199819',
        width: 571,
      },
    },
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
const Template = (args) => ({
  components: { PromoCard },
  setup() {
    return { args }
  },
  template: '<promo-card v-bind="args" />',
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
  cardData: false,
}
