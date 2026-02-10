/**
 * Storybook: Variables.
 * -----------------------------------------------------------------------------
 * Can't use Liquid to return cnvs variables so have to hard-code.
 *
 */
import strings from '../../src/shopify/locales/en.default'

/**
 * Imitate theme-variables.liquid values.
 * - Update variables below when setting up on a new store.
 */
const store = 'bioeffect-eu'

const cnvs = {
  credentials: {
    storefront: {
      store,
      token: '421f1339007cf0cf4de27add35001700',
      version: '2023-04',
    },
  },
  customer: {
    enabled: true,
    firstName: 'First',
    lastName: 'Lastname',
    loggedIn: true,
    phone: '01234567890',
  },
  environment: {
    mode: 'watch',
  },
  page: {
    handle: null,
    title: 'Canvas',
    type: 'index',
  },
  request: {
    designMode: false,
    host: `${store}.myshopify.com`,
    locale: {
      shop_locale: {
        locale: 'en',
        enabled: true,
        primary: true,
        published: true,
      },
    },
    origin: `https://${store}.myshopify.com`,
    pageType: 'index',
    path: `https://${store}.myshopify.com/`,
  },
  routes: {
    account: {
      login: `https://${store}.myshopify.com/account/login`,
      register: `https://${store}.myshopify.com/account/register`,
      url: `https://${store}.myshopify.com/account`,
    },
    cart: {
      add: `https://${store}.myshopify.com/cart/add.js`,
      change: `https://${store}.myshopify.com/cart/change.js`,
      clear: `https://${store}.myshopify.com/cart/clear.js`,
      js: `https://${store}.myshopify.com/cart.js`,
      update: `https://${store}.myshopify.com/cart/update.js`,
      url: `https://${store}.myshopify.com/cart`,
    },
    normalisedRoot: `/`,
    predictiveSearch: `https://${store}.myshopify.com/search/suggest`,
    root: `https://${store}.myshopify.com`,
    search: `https://${store}.myshopify.com/search`,
  },
  settings: {
    disableAsyncComponents: false,
    disableCanvas: false,
    disableComponentReadyState: false,
    disableOverlayDismissed: true,
    disableVuexPersist: true,
    pagination: {
      articles: 12,
      collections: 12,
      products: 24,
    },
  },
  states: {
    active: 'active',
    loading: 'loading',
    waiting: 'waiting',
  },
  store: {
    baseCurrency: 'GBP',
    country: 'GB',
    countryName: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en',
    localisedPermanentDomain: `//${store}.myshopify.com/`,
    localisedShopDomain: `//${store}.myshopify.com/`,
    localisedShopUrl: `//${store}.myshopify.com/`,
    moneyFormat: '£{{amount}}',
    permanentDomain: `//${store}.myshopify.com/`,
    shopDomain: `//${store}.myshopify.com/`,
    shopName: 'Canvas',
    shopPhone: '01234 567890',
    shopUrl: `//${store}.myshopify.com/`,
  },
  storybook: {
    collection: {
      default: 'beach',
    },
    /**
     * Default should be multi-variant.
     * - Ideally each handle is unique.
     */
    product: {
      default: 'wmw-bioeffect-tote-bag',
      multiImage: 'wmw-bioeffect-tote-bag',
      multiVariant: 'wmw-bioeffect-tote-bag',
      onSale: 'wmw-bioeffect-tote-bag',
      outOfStock: 'wmw-bioeffect-30-day-treatment',
      singleVariant: 'wmw-bioeffect-30-day-treatment',
    },
  },
  strings,
  theme: {},
  urls: {},
}

/**
 * Set default page handle.
 */
cnvs.page.handle = cnvs.storybook.product.default

/**
 * Create array of unique product handles.
 * - Excludes out of stock variant.
 */
cnvs.storybook.product.array = []

Object.entries(cnvs.storybook.product).forEach(([key, value]) => {
  if (
    key === 'array' ||
    cnvs.storybook.product.array.includes(value)
  ) {
    return
  }

  cnvs.storybook.product.array.push(value)
})

export default cnvs
