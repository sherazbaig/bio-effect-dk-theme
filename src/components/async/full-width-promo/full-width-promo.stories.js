/**
 * Storybook: Full width promo (full-width-promo)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import FullWidthPromo from './full-width-promo'

/**
 * Write component description for docs tab.
 */
const component = `
  Full Width Promo - Used as in grid content in plp.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Full Width Promo',
  component: FullWidthPromo,
  args: {
    cardData: {
      title: 'OSA Water Mist',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.',
      ctaURL: '/products/wmw-bioeffect-30-day-treatment-1',
      ctaText: 'Shop Now',
      theme: 'light',
      alignment: 'right',
      imageMobile: {
        alt: null,
        aspectRatio: 1.2,
        height: 1500,
        id: 35077020975414,
        src: '//bioeffect-eu.myshopify.com/cdn/shop/files/6bd3033ee31a975118a443d544793fcf.jpg?v=1691678427',
        width: 1800,
      },
      imageDesktop: {
        alt: null,
        aspectRatio: 2.909090909090909,
        height: 1100,
        id: 35077018681654,
        src: '//bioeffect-eu.myshopify.com/cdn/shop/files/3469418c90e87417967bd872b7e3465e_0c8a25ad-7390-4d90-ace8-8549e25026f4.jpg?v=1691678418',
        width: 3200,
      },
    },
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
  components: { FullWidthPromo },
  setup() {
    return { args }
  },
  template: '<full-width-promo v-bind="args" />',
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
