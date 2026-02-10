/**
 * Storybook: Main
 * -----------------------------------------------------------------------------
 * Storybook webpack configuration.
 *
 */
const cssnano = require('cssnano')
const postcssPresetEnv = require('postcss-preset-env')

const Paths = require('@we-make-websites/basis/basis/helpers/paths')

/**
 * Custom plugins or plugin configs.
 */
const StorybookIconShortcodePlugin = require('@we-make-websites/canvas-storybook-tools/canvas-storybook-tools/plugins/storybook-icon-shortcode-plugin')
const StorybookShopifyPlugin = require('@we-make-websites/canvas-storybook-tools/canvas-storybook-tools/plugins/storybook-shopify-plugin')

/**
 * SASS loader converts SCSS to CSS.
 */
const sassLoader = {
  loader: 'sass-loader',
  options: {
    additionalData: `@import '@/config/configuration';`,
    sassOptions: {
      quietDeps: true,
    },
    sourceMap: false,
  },
}

/**
 * Post CSS preset config.
 * - Used to prefix and polyfill CSS features.
 * - Stage 0 is experimental, stage 4 is released.
 */
const postcssPresetEnvConfig = {
  stage: 3,
}

/**
 * CSS nano config.
 * - Used to minify CSS.
 */
const cssNanoConfig = {
  preset: [
    'default',
    {
      autoprefixer: true,
      calc: false,
      normalizeString: {
        preferredQuote: 'single',
      },
      reduceInitial: false,
    },
  ],
}

/**
 * Post CSS loader runs transformations (prefix, minify).
 * @param {Boolean} critical - Critical styles loader?
 */
const postcssLoader = (isProduction = false) => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        postcssPresetEnv(postcssPresetEnvConfig),
        ...(isProduction ? [cssnano(cssNanoConfig)] : []),
      ],
      sourceMap: false,
    },
  },
})

/**
 * CSS loader interprets @import inside SCSS files.
 * - importLoaders applies last 2 loaders to @import CSS.
 * - So in the use array below it applies postcssLoader and sassLoader.
 * - This means that CSS that is imported has same loaders as everything else.
 */
const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: false,
  },
}

/**
 * Export webpack configuration.
 * - Order of addons is important.
 */
module.exports = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    '@storybook/addon-a11y',
    'storybook-addon-rtl-direction',
  ],
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../.storybook/**/*.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  managerWebpack: async (config, { configType }) => {

    /**
     * Change manager configuration on build.
     */
    if (configType === 'PRODUCTION') {
      config.plugins.push(new StorybookShopifyPlugin())
    }

    return config
  },
  webpackFinal: async (config, { configType }) => {

    /**
     * Set import aliases.
     */
    config.resolve.alias['@'] = Paths.styles.root
    config.resolve.alias['~'] = Paths.scripts.root
    config.resolve.alias['~async'] = Paths.components.async
    config.resolve.alias['~global'] = Paths.components.global
    config.resolve.alias['~graphql'] = Paths.graphql
    config.resolve.alias['~icons'] = Paths.icons
    config.resolve.alias['~stores'] = Paths.stores.root

    /**
     * Load SASS.
     */
    config.module.rules.push({
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        cssLoader,
        postcssLoader(configType === 'PRODUCTION'),
        sassLoader,
      ],
    })

    /**
     * Load GraphQL.
     */
    config.module.rules.push({
      loader: 'graphql-tag/loader',
      test: /\.(graphql|gql)$/,
    })

    /**
     * Load SVG as Vue component.
     * - Modify default loader to exclude our icons.
     */
    const fileLoaderRule = config.module.rules.find((rule) => {
      return rule.test.test('.svg')
    })

    fileLoaderRule.exclude = Paths.icons;

    config.module.rules.push({
      include: Paths.icons,
      test: /\.svg$/,
      use: [
        'vue-loader',
        {
          loader: 'vue-svg-loader',
          options: {
            svgo: false,
          },
        },
      ],
    })

    config.plugins.push(new StorybookIconShortcodePlugin())

    /**
     * Change configuration on build.
     */
    if (configType === 'PRODUCTION') {
      config.plugins.push(new StorybookShopifyPlugin())
    }

    return config
  },
}
