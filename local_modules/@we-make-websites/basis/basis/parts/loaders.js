/**
 * Parts: Loaders
 * -----------------------------------------------------------------------------
 * Configures loaders for different file types.
 *
 */
const Paths = require('../helpers/paths')

const babel = require('../loaders/babel')
const sass = require('../loaders/sass')
const vue = require('../loaders/vue')

/**
 * Export loader rules.
 */
module.exports = {
  module: {
    rules: [
      babel,
      ...sass,
      vue,
      {
        include: [
          Paths.components.root,
          Paths.graphql,
          Paths.scripts.root,
        ],
        loader: 'graphql-tag/loader',
        test: /\.(?:graphql|gql)$/,
      },
      {
        include: Paths.icons,
        test: /\.svg$/u,
        use: [
          'vue-loader',
          {
            loader: 'vue-svg-loader',
            options: {
              svgo: false,
            },
          },
        ],
      },
    ],
  },
}
