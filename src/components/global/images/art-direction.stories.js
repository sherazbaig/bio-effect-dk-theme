/**
 * Storybook: Art direction (images)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import ArtDirection from './art-direction'

/**
 * Write component description for docs tab.
 */
const component = `
  Handles situations where the image displayed changes between mobile and desktop breakpoints.

  See [documentation](https://we-make-websites.gitbook.io/canvas/components/default-components/images) for more details.

  ## Notes
  * Use the viewport control in _Canvas_ view to change between mobile and desktop breakpoints
  * At mobile a colourful square image is shown
  * At desktop a desaturated 16:9 image is shown
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Images/Art Direction',
  component: ArtDirection,
  args: {
    breakpointSizes: '',
    desktopBreakpoint: '',
    image: {
      alt: 'Mobile image alt text',
      height: 1080,
      src: 'https://cdn.shopify.com/s/files/1/0565/5235/7975/files/art-direction-mobile.jpg?v=1664203258',
      width: 1920,
    },
    imageDesktop: {
      alt: 'Desktop image alt text',
      height: 1080,
      src: 'https://cdn.shopify.com/s/files/1/0565/5235/7975/files/art-direction-desktop.jpg?v=1664203254',
      width: 1920,
    },
    lazyload: true,
    padding: true,
    ratio: '1:1',
    ratioDesktop: '16:9',
  },
  argTypes: {
    ratio: {
      control: 'object',
    },
    ratioDesktop: {
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
  components: { ArtDirection },
  setup() {
    return { args }
  },
  template: '<art-direction v-bind="args" />',
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
