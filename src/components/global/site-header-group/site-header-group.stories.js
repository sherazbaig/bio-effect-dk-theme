/**
 * Storybook: Site header group (site-header-group)
 * -----------------------------------------------------------------------------
 * Configure storybook controls and stories.
 *
 */
import Navigation from '~global/site-header-group/navigation/navigation'
import PromoBanner from '~global/promo-banner/promo-banner'
import SiteHeader from '~global/site-header-group/site-header/site-header'
import SiteHeaderGroup from './site-header-group'

/**
 * Write component description for docs tab.
 */
const component = `
  Global site header displayed on all pages.

  ## Notes
  * \`desktop.items\` prop has been provided static data and will not update based on current site
  * The _Menu Drawer_ is also available as a separate component for preview
`

/**
 * Export storybook configuration.
 */
export default {
  title: 'Global/Site Header Group',
  component: {
    Navigation,
    PromoBanner,
    SiteHeader,
    SiteHeaderGroup,
  },
  args: {
    blocks: [
      { title: '<strong>Promo banner</strong> with richtext' },
      { title: 'Second promo banner item' },
    ],
    desktop: {
      handle: 'main-menu',
      // eslint-disable-next-line
      items: [{'handle':'desktop-home-1-0','title':'Home','url':'/','links':[]},{'handle':'desktop-catalog-1-1','title':'Catalog','url':'/collections/all','links':[]},{'handle':'desktop-product-1-2','title':'Product','url':'/products/daris-tee-blue','links':[]},{'handle':'desktop-blog-1-3','title':'Blog','url':'/blogs/news','links':[]},{'handle':'desktop-list-collections-1-4','title':'List Collections','url':'/collections','links':[]}],
    },
    mobile: {
      handle: 'mobile-menu',
      itemCount: 5,
    },
    navigationEnable: true,
    titleElement: 'h1',
  },
  decorators: [
    () => ({
      template: `
        <div style="position: relative; z-index: 12;">
          <story />
        </div>

        <div style="min-height: 2000px;"></div>
      `,
    }),
  ],
  parameters: {
    docs: {
      description: {
        component,
      },
      inlineStories: false,
    },
  },
}

/**
 * Setup shared template.
 */
const Template = (args) => ({
  components: {
    Navigation,
    PromoBanner,
    SiteHeader,
    SiteHeaderGroup,
  },
  setup() {
    return { args }
  },
  template: `
    <site-header-group>
      <div class="shopify-section-group-site-header-group">
        <section
          aria-labelledby="promo-banner-title"
          data-site-header-states="open"
        >
          <promo-banner :blocks="args.blocks" />
        </section>
      </div>

      <div class="shopify-section-group-site-header-group">
        <section
          aria-labelledby="site-header-title"
          data-site-header-states="open, minimised"
        >
          <site-header :title-element="args.titleElement" />
        </section>
      </div>

      <div class="shopify-section-group-site-header-group">
        <section
          aria-labelledby="navigation-title"
          data-site-header-states="open, minimised"
        >
          <navigation
            :enable="args.navigationEnable"
            :desktop="args.desktop"
            :mobile="args.mobile"
          />
        </section>
      </div>
    </site-header-group>
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
  mobile: {
    handle: '',
  },
}
