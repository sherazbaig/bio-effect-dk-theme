/**
 * Storybook: Responsive image (images)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ResponsiveImage from './responsive-image'

/**
 * Write component description for docs tab.
 */
const component = `
  Displays images responsively using lazy loading and \`srcset\`.

  See [documentation](https://we-make-websites.gitbook.io/canvas/components/default-components/images) for more details.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Images/Responsive Image',
  component: ResponsiveImage,
  args: {
    image: {
      alt: 'Mobile',
      height: 1080,
      src: 'https://cdn.shopify.com/s/files/1/0565/5235/7975/files/art-direction-mobile.jpg?v=1664203258',
      width: 1920,
    },
    lazyload: true,
    minMax: '320-1360',
    padding: true,
    ratio: '16:9',
    sizes: '100vw',
  },
  argTypes: {
    ratio: {
      control: 'object',
    },
  },
  decorators: [
    () => ({
      template: `
        <div class="story-center" style="max-width: 768px;">
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
  components: { ResponsiveImage },
  setup() {
    return { args }
  },
  template: '<responsive-image v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
