/**
 * Config: Basis
 * -----------------------------------------------------------------------------
 * Custom config for Basis, overwrites default configuration.
 *
 */
/* eslint-disable no-unused-vars */

/**
 * Optimise compilation, update vendors if you notice common packages being
 * imported multiple times in the bundle analyser output.
 * - Only used when production mode is active.
 */
const productionOptimization = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/](?:@bugsnag|css-loader|style-loader|@vue|vue|vue-loader|vuex)[\\/]/,
        },
      },
    },
  },
}

/**
 * Optimise compilation, extends development vendor bundling.
 * - Only used when development mode is active.
 * - Shouldn't be needed by default, only use if having issues with certain
 *   dependencies reporting ChunkLoadError.
 * - https://we-make-websites.gitbook.io/canvas/guides/further-guides/fixing-chunkloaderror-issues
 */
const developmentOptimization = {
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       splide: {
  //         chunks: 'all',
  //         name: 'splide',
  //         test: /[\\/]node_modules[\\/](?:@splidejs)[\\/]/,
  //       },
  //     },
  //   },
  // },
}

module.exports = {
  ...process.env.NODE_ENV === 'production'
    ? productionOptimization
    : developmentOptimization,
}
