/**
 * Core: Canvas imports
 * -----------------------------------------------------------------------------
 * Import async components, global components, and Vuex stores for use in
 * CanvasApp Vue instance.
 *
 */
/* eslint-disable max-len, no-inline-comments, quote-props */
import { defineAsyncComponent } from 'vue'

/**
 * Get async components and imports.
 * - Must be manually updated with new async components (components/async/).
 * - Previously used a dynamic import statement which caused infinite build
 *   issue and generated unused files.
 * - Only parent components should be imported.
 * - Do not import components that are only ever used as a child component.
 * - Do not import async sub-components.
 * @returns {Object}
 */
export function getAsyncComponents() {
  return {
    // canvas-async-object-start
    'article-item': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.article-item' */'~async/article-item/article-item') }),
    'articles-slider': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.articles-slider' */'~async/articles-slider/articles-slider') }),
    'breadcrumbs': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.breadcrumbs' */'~async/breadcrumbs/breadcrumbs') }),
    'cart-drawer': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.cart-drawer' */'~async/cart-drawer/cart-drawer') }),
    'contact-us': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.contact-us' */'~async/contact-us/contact-us') }),
    'country-select-landing': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.country-select-landing' */'~async/country-select-modal/country-select-landing') }),
    'country-select-modal': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.country-select-modal' */'~async/country-select-modal/country-select-modal') }),
    'customers-account': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-account' */'~async/customers/account/customers-account') }),
    'customers-activate-account': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-activate-account' */'~async/customers/activate-account/customers-activate-account') }),
    'customers-addresses': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-addresses' */'~async/customers/addresses/customers-addresses') }),
    'customers-login': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-login' */'~async/customers/login/customers-login') }),
    'customers-order': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-order' */'~async/customers/order/customers-order') }),
    'customers-orders': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-orders' */'~async/customers/orders/customers-orders') }),
    'customers-register': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-register' */'~async/customers/register/customers-register') }),
    'customers-reset-password': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.customers-reset-password' */'~async/customers/reset-password/customers-reset-password') }),
    'editorial-split': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.editorial-split' */'~async/editorial-split/editorial-split') }),
    'faq-section': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.faq-section' */'~async/faq-section/faq-section') }),
    'free-gift-with-purchase-list': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.free-gift-with-purchase-list' */'~async/free-gift-with-purchase-list/free-gift-with-purchase-list') }),
    'free-samples': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.free-samples' */'~async/free-samples/free-samples') }),
    'full-width-promo': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.full-width-promo' */'~async/full-width-promo/full-width-promo') }),
    'hero-banner': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.hero-banner' */'~async/hero-banner/hero-banner') }),
    'image-link-carousel': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.image-link-carousel' */'~async/image-link-carousel/image-link-carousel') }),
    'impact-image': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.impact-image' */'~async/impact-image/impact-image') }),
    'info-stamps': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.info-stamps' */'~async/info-stamps/info-stamps') }),
    'inline-card': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.inline-card' */'~async/inline-card/inline-card') }),
    'main-404': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-404' */'~async/main-404/main-404') }),
    'main-article': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-article' */'~async/main-article/main-article') }),
    'main-blog': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-blog' */'~async/main-blog/main-blog') }),
    'main-collection': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-collection' */'~async/main-collection/main-collection') }),
    'main-collection-filter-sidebar': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-collection-filter-sidebar' */'~async/main-collection-filter-sidebar/main-collection-filter-sidebar') }),
    'main-list-collections': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-list-collections' */'~async/main-list-collections/main-list-collections') }),
    'main-page': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-page' */'~async/main-page/main-page') }),
    'main-product': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-product' */'~async/main-product/main-product') }),
    'main-search': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.main-search' */'~async/main-search/main-search') }),
    'product-recommendations': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.product-recommendations' */'~async/product-recommendations/product-recommendations') }),
    'product-upsell-carousel': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.product-upsell-carousel' */'~async/product-upsell-carousel/product-upsell-carousel') }),
    'promo-card': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.promo-card' */'~async/promo-card/promo-card') }),
    'quote-and-image': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.quote-and-image' */'~async/quote-and-image/quote-and-image') }),
    'reviews-widget': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.reviews-widget' */'~async/reviews-widget/reviews-widget') }),
    'site-footer': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.site-footer' */'~async/site-footer-group/site-footer/site-footer') }),
    'special-stores': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.special-stores' */'~async/special-stores/special-stores') }),
    'store-locator': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.store-locator' */'~async/store-locator/store-locator') }),
    'tabbed-info': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.tabbed-info' */'~async/tabbed-info/tabbed-info') }),
    'text-subtext': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.text-subtext' */'~async/text-subtext/text-subtext') }),
    'upsell-popup': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.upsell-popup' */'~async/upsell-popup/upsell-popup') }),
    // 'cnvs-featured-products': defineAsyncComponent({ loader: () => import(/* webpackChunkName: 'component.cnvs-featured-products' */'~async/cnvs-featured-products/cnvs-featured-products') }),
    // canvas-async-object-end
  }
}

/**
 * Import global components here.
 */
// canvas-global-import-start
import Accessibility from '~global/core/accessibility'
import AccountForms from '~global/account-forms/account-forms'
import ArtDirection from '~global/images/art-direction'
import Btn from '~global/btn/btn'
import CountrySelect from '~global/country-select/country-select'
import Index from '~global/core/index'
import MegaNav from '~global/mega-nav/mega-nav'
import MultiStoreSettings from '~global/multi-store-settings/multi-store-settings'
import Navigation from '~global/site-header-group/navigation/navigation'
import NewsletterModal from '~global/newsletter-modal/newsletter-modal'
import Overlay from '~global/overlay/overlay'
import ProductCard from '~global/product-card/product-card'
import ProductPrices from '~global/product-prices/product-prices'
import ResponsiveImage from '~global/images/responsive-image'
import SiteHeader from '~global/site-header-group/site-header/site-header'
import PromoBanner from '~global/promo-banner/promo-banner'
import SiteHeaderGroup from '~global/site-header-group/site-header-group'
// canvas-global-import-end

/**
 * Get global components and imports.
 * - Must be manually updated with new global components (components/global).
 * - Previously used require.context but this caused infinite build issue.
 * - All property keys are wrapped in quotations for consistency.
 * @returns {Object}
 */
export function getGlobalComponents() {
  return {
    // canvas-global-object-start
    'account-forms': AccountForms,
    'accessibility': Accessibility,
    'art-direction': ArtDirection,
    'btn': Btn,
    'country-select': CountrySelect,
    'index': Index,
    'mega-nav': MegaNav,
    'multi-store-settings': MultiStoreSettings,
    'navigation': Navigation,
    'newsletter-modal': NewsletterModal,
    'overlay': Overlay,
    'product-card': ProductCard,
    'product-prices': ProductPrices,
    'responsive-image': ResponsiveImage,
    'site-header': SiteHeader,
    'site-header-group': SiteHeaderGroup,
    'promo-banner': PromoBanner,
    // canvas-global-object-end
  }
}

/**
 * Import Vuex stores here.
 * - Import with Store suffix to avoid conflicts with global component imports.
 */
// canvas-stores-import-start
import AccessibilityStore from '~stores/accessibility'
import CartStore from '~stores/cart'
import SearchStore from '~stores/search'
import ComponentsStore from '~stores/components'
import IndexStore from '~stores/index'
import MultiStore from '~stores/multi-store'
import OverlaysStore from '~stores/overlays'
import UpsellStore from '~stores/upsell'
// canvas-stores-import-end

/**
 * Get Vuex stores and imports.
 * - Must be manually updated with new Vuex stores (stores/).
 * - Previously used require.context but this caused infinite build issue.
 * - All property keys are wrapped in quotations for consistency.
 */
export function getVuexStores() {
  return {
    // canvas-stores-object-start
    'accessibility': AccessibilityStore,
    'cart': CartStore,
    'search': SearchStore,
    'components': ComponentsStore,
    'index': IndexStore,
    'overlays': OverlaysStore,
    'upsell': UpsellStore,
    'multi-store': MultiStore,
    // canvas-stores-object-end
  }
}
