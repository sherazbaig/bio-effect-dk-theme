/**
 * Storybook: Site footer group (site-footer-group)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import SiteFooter from '~async/site-footer-group/site-footer/site-footer'

/**
 * Write component description for docs tab.
 */
const component = `
  Global site footer, loaded asynchronously as not all users will reach the end of the page.
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Async/Site Footer Group',
  component: SiteFooter,
  args: {
    shopName: cnvs.store.shopName,
  },
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
  components: { SiteFooter },
  setup() {
    return { args }
  },
  template: `
    <div class="site-grid">
      <div class="site-footer-group-section">
        <div class="shopify-section-group-site-footer-group">
          <site-footer v-bind="args" />
        </div>
      </div>
    </div>
  `,
})

/**
 * Primary story.
 */
export const Primary = Template.bind({})
