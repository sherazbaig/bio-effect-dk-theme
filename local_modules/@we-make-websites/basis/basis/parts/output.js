/**
 * Parts: Outputs
 * -----------------------------------------------------------------------------
 * Configures where to output compiled code.
 *
 */
const path = require('path')

/**
 * Export output.
 */
module.exports = {
  output: {
    clean: false,
    filename: '[name].js',
    path: path.resolve('dist', 'assets'),
  },
}
