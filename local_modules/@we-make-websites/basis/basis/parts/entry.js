/**
 * Parts: Entry
 * -----------------------------------------------------------------------------
 * Get entry points for webpack.
 *
 */
const getCriticalEntryPoints = require('../helpers/get-critical-entry-points')
const getLayoutEntryPoints = require('../helpers/get-layout-entry-points')
const getTemplateEntryPoints = require('../helpers/get-template-entry-points')
const getVendorEntryPoints = require('../helpers/get-vendor-entry-points')

/**
 * Export entry.
 */
module.exports = {
  entry: {
    ...getCriticalEntryPoints(),
    ...getLayoutEntryPoints(),
    ...getTemplateEntryPoints(),
    ...getVendorEntryPoints(),
  },
}
