/**
 * Parts / Loader: Babel
 * -----------------------------------------------------------------------------
 * Configures JS loader using Babel.
 *
 */
const Paths = require('../helpers/paths')

/**
 * Babel loader transpiles JS using Babel.
 * - Preset env is used to determine polyfills needed.
 * - @babel/core provides the polyfills.
 */
const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
    sourceMaps: true,
  },
}

/**
 * Export Babel loader rule.
 */
module.exports = {
  include: [
    Paths.components.async,
    Paths.components.global,
    Paths.scripts.root,
  ],
  test: /\.js$/u,
  use: [babelLoader],
}
