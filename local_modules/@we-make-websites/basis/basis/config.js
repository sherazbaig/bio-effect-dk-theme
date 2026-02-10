/**
 * Basis: Config
 * -----------------------------------------------------------------------------
 * Webpack config.
 *
 */
const path = require('path')
const { merge } = require('webpack-merge')

const Paths = require('./helpers/paths')

/**
 * Import modular configs.
 */
const context = path.resolve(path.dirname('src'), 'src')
const entry = require('./parts/entry')
const loaders = require('./parts/loaders')
const output = require('./parts/output')
const plugins = require('./parts/plugins')

/**
 * Set variables.
 */
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Setup development mode.
 */
let devtool = 'eval-source-map'
let mode = 'development'

let optimization = {
  minimize: false,
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      default: false,
      global: {
        chunks: 'all',
        name: 'global-components',
        priority: 0,
        test: /[\\/]components[\\/]global/,
      },
      defaultVendors: {
        chunks: 'all',
        name: (module, _, cacheGroupKey) => {
          const moduleFileName = module
            .identifier()
            .split(/[\\/]/g)
            .reduceRight((item) => item)

          const groupKey = cacheGroupKey.replace('defaultVendors', 'vendors')

          return `${groupKey}.${moduleFileName.replace('.js', '')}`
        },
        priority: -10,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]/,
      },
      vue: {
        chunks: 'all',
        name: 'vue',
        priority: 0,
        test: /[\\/]node_modules[\\/]@vue[\\/]/,
      },
    },
    hidePathInfo: true,
    filename: 'bundle.[name].dev.js',
  },
}

const stats = {
  errors: true,
  preset: 'none',
  warnings: false,
}

const resolve = {
  alias: {
    '@': Paths.styles.root,
    '~': Paths.scripts.root,
    '~async': Paths.components.async,
    '~global': Paths.components.global,
    '~graphql': Paths.graphql,
    '~icons': Paths.icons,
    '~stores': Paths.stores.root,
    vue: 'vue/dist/vue.esm-bundler.js',
    vuex: 'vuex/dist/vuex.esm-bundler.js',
  },
  extensions: [
    '.js',
    '.css',
    '.json',
    '.vue',
  ],
}

const performance = {
  hints: false,
}

/**
 * Setup production mode.
 */
if (isProduction) {
  devtool = 'source-map'
  mode = 'production'
  stats.warnings = true

  /**
   * Optimise compilation, update vendors if you notice common packages being
   * imported multiple times in the bundle analyser output.
   */
  optimization = {
    splitChunks: {
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        global: {
          chunks: 'all',
          name: 'global-components',
          test: /[\\/]components[\\/]global/,
        },
        vendors: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/](?:@bugsnag|css-loader|lazysizes|style-loader|@vue|vue|vue-loader|vuex)[\\/]/,
        },
      },
      filename: 'bundle.[name].js',
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
    },
  }
}

/**
 * Merge webpack config with modular configs.
 */
module.exports = merge([
  entry,
  loaders,
  output,
  plugins,
  {
    context,
    devtool,
    mode,
    optimization,
    resolve,
    performance,
    stats,
  },
])
