/**
 * Helper: Get webpack merge rules
 * -----------------------------------------------------------------------------
 * Gets rules configuration used when merging webpack configs.
 * - Merge is configured to match loaders and replace existing values.
 *
 * @returns {Object}
 *
 */
module.exports = () => {
  return {
    module: {
      rules: {
        include: 'match',
        exclude: 'replace',
        test: 'match',
        use: 'replace',
      },
    },
  }
}
