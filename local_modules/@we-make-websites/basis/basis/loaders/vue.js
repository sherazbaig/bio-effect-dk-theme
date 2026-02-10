/**
 * Parts / Loader: Vue
 * -----------------------------------------------------------------------------
 * Configures Vue loader using Canvas config.
 *
 */
const getCanvasConfig = require('../helpers/get-canvas-config')
const Paths = require('../helpers/paths')

/**
 * Set Vue loader options based on Canvas config.
 */
const vueLoader = {
  loader: 'vue-loader',
  options: {},
}

const canvasConfig = getCanvasConfig()

if (
  process.env.CANVAS === 'true' &&
  canvasConfig &&
  canvasConfig.customElements?.length
) {
  vueLoader.options.compilerOptions = {
    isCustomElement: (tag) => {
      return canvasConfig.customElements.includes(tag)
    },
  }
}

/**
 * Export Vue loader rule.
 */
module.exports = {
  include: [
    Paths.components.root,
    Paths.scripts.root,
  ],
  use: vueLoader,
  test: /\.vue$/,
}
