/**
 * Parts: Plugins
 * -----------------------------------------------------------------------------
 * Configures webpack plugins.
 *
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const Webpack = require('webpack')

/**
 * Custom plugins or plugin configs.
 */
const BasisCorePlugin = require('../plugins/basis-core-plugin')
const BasisCriticalStylesPlugin = require('../plugins/basis-critical-styles-plugin')
const BasisCustomContentToolPlugin = require('../plugins/basis-custom-content-tool-plugin')
const BasisDebugEndPlugin = require('../plugins/basis-debug-end-plugin')
const BasisDebugStartPlugin = require('../plugins/basis-debug-start-plugin')
const BasisEmptyImportsPlugins = require('../plugins/basis-empty-imports-plugin')
const BasisFileCopyPlugin = require('../plugins/basis-file-copy-plugin')
const BasisHotPlugin = require('../plugins/basis-hot-plugin')
const BasisIconShortcodePlugin = require('../plugins/basis-icon-shortcode-plugin')
const BasisIconsPlugin = require('../plugins/basis-icons-plugin')
const BasisSchemaPlugin = require('../plugins/basis-schema-plugin')
const BasisSecurityPlugin = require('../plugins/basis-security-plugin')
const BasisThemeSnippetsPlugin = require('../plugins/basis-theme-snippets-plugin')
const BundleAnalyzerPlugin = require('../plugins/bundle-analyzer-plugin')
const CanvasBugsnagPlugins = require('../plugins/canvas-bugsnag-plugins')
const CanvasCorePlugin = require('../plugins/canvas-core-plugin')
const CanvasCssOptimiserPlugin = require('../plugins/canvas-css-optimiser-plugin')
const CanvasThemeVariablesPlugin = require('../plugins/canvas-theme-variables-plugin')

/**
 * Set variables.
 */
const isProduction = process.env.NODE_ENV === 'production'
const productionDevtools = process.env.PRODUCTION_DEVTOOLS === 'true'

/**
 * Export plugins.
 */
module.exports = {
  plugins: ((plugins) => {
    plugins.push(new BasisDebugStartPlugin())

    /**
     * Define environment for optimisations.
     */
    plugins.push(
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: productionDevtools,
      }),
    )

    /**
     * Use Mini CSS extract plugin to create separate CSS files from JS imports.
     * - Chunks are SCSS files imported into dynamic component.
     */
    plugins.push(
      new MiniCssExtractPlugin({
        chunkFilename: (pathData) => {
          if (pathData?.chunk?.filenameTemplate?.includes('component.')) {
            return pathData.chunk.filenameTemplate.replace('js', 'css')
          }

          return '[name].css'
        },
        filename: '[name].css',
        runtime: false,
      }),
    )

    /**
     * Load Vue.
     */
    plugins.push(new VueLoaderPlugin())

    /**
     * Basis & Canvas functionality.
     */
    plugins.push(
      new BasisCorePlugin(),
      new BasisCriticalStylesPlugin(),
      new BasisCustomContentToolPlugin(),
      new BasisFileCopyPlugin(),
      new BasisHotPlugin(),
      new BasisIconShortcodePlugin(),
      new BasisIconsPlugin(),
      new BasisSchemaPlugin(),
      new BasisSecurityPlugin(),
      new BasisThemeSnippetsPlugin(),
      new CanvasCorePlugin(),
      new CanvasCssOptimiserPlugin(),
      new CanvasThemeVariablesPlugin(),
    )

    /**
     * Add bundle analyser to show JS file sizes.
     */
    BundleAnalyzerPlugin(plugins)

    /**
     * Report build and upload source maps to Bugsnag.
     * - Or remove Bugsnag imports if no environment variable.
     */
    CanvasBugsnagPlugins(plugins)

    /**
     * Replace imports with empty files as required.
     */
    BasisEmptyImportsPlugins(plugins)

    plugins.push(new BasisDebugEndPlugin())

    return plugins
  })([]),
}
