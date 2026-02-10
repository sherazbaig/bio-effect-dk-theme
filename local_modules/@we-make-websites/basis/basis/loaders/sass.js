/**
 * Parts / Loader: SASS
 * -----------------------------------------------------------------------------
 * Configures SASS/SCSS loader.
 * - Do not include sourceMaps as this breaks watch mode.
 *
 */
const cssnano = require('cssnano')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')

const Paths = require('../helpers/paths')

/**
 * Set variables.
 */
const isAdapter = process.env.ADAPTER === 'true'
const isHot = process.env.HOT === 'true'
const isProduction = process.env.NODE_ENV === 'production'

/**
 * SASS loader converts SCSS to CSS.
 * - Also used to import configuration styles into all Canvas stylesheets.
 */
const sassLoader = {
  loader: 'sass-loader',
  options: {
    additionalData: isAdapter
      ? ''
      : `@import '@/config/configuration';`,
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
 * - CSS is minified for critical styles and in production or hot modes.
 * - Post CSS warnings are not being emitted due to a possible incompatibility
 *   with CSS Nano, however the suggested `css-minimizer-webpack-plugin` didn't
 *   work as Webpack's default Terser plugin overrides it, possible bug?
 * @param {Boolean} [critical] - Critical styles loader?
 * @returns {Object}
 */
function postcssLoader(critical) {
  const plugins = [postcssPresetEnv(postcssPresetEnvConfig)]

  if (critical || isProduction || isHot) {
    plugins.push(cssnano(cssNanoConfig))
  }

  const config = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins,
        sourceMap: false,
      },
    },
  }

  return config
}

/**
 * CSS loader interprets @import inside SCSS files.
 * - importLoaders applies last 2 loaders to @import CSS.
 * - So in the module.exports use array below it applies the postcssLoader and
 *   sassLoader loaders.
 * - This means that imported styles have the same loaders as everything else.
 */
const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: false,
  },
}

/**
 * Style loader.
 * - Used to inject all styles into <head> when in hot mode.
 * - Injection order is based on <script> order.
 * - Replaces MiniCssExtractPlugin which creates separate files.
 */
const styleLoader = {
  loader: 'style-loader',
  options: {},
}

/**
 * Export SASS loader rules.
 * - Mini CSS extract plugin creates CSS files for each corresponding JS file.
 * - Chain is executed in reverse order (bottom first).
 * - Global components are imported into stylesheets in Paths.styles.root.
 *
 * 1. Component and styles folder stylesheets.
 * 2. Critical styles (always minified).
 */
module.exports = [
  {
    include: [
      Paths.components.root,
      Paths.styles.root,
    ],
    exclude: Paths.styles.critical,
    test: /\.s[ac]ss$/u,
    use: [
      isHot ? styleLoader : MiniCssExtractPlugin.loader,
      cssLoader,
      postcssLoader(),
      sassLoader,
    ],
  },
  {
    include: Paths.styles.critical,
    test: /\.s[ac]ss$/u,
    use: [
      MiniCssExtractPlugin.loader,
      cssLoader,
      postcssLoader(true),
      sassLoader,
    ],
  },
]
