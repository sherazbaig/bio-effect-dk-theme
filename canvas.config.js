/**
 * Config: Canvas
 * -----------------------------------------------------------------------------
 * Custom config for Canvas, allows limited access to compiler config.
 *
 */
module.exports = {

  /**
   * Theme scripts async config.
   * - Provide name of script as found in dist/snippets/theme-scripts.liquid.
   * - Included scripts will be loaded with `async` attribute.
   * - Other scripts default to `defer` attribute.
   * - Ignored when in hot mode.
   */
  asyncScripts: [
    'bundle.global-components.js',
    'bundle.vendors.js',
    'layout.password.js',
    'layout.theme.js',
  ],

  /**
   * Sets branch naming convention.
   * - `camel` supports feature/CANVAS-101-branchName.
   * - `kebab` supports feature/CANVAS-101-branch-name.
   * - `both` supports both of the above.
   */
  branchNaming: 'camel',

  /**
   * Set default browser to open `watch` command with.
   * - Do not use Chrome when store has a storefront password.
   * - Accepts `firefox`, `chrome`, `edge`, or `safari`.
   */
  browser: 'firefox',

  /**
   * CSS optimiser config.
   * - `classes` - Set classes to optimise (remove if not used), classes created
   *   in utility stylesheets are automatically set to be optimised.
   * - `enable` - Run CSS optimiser.
   * - `enableDevMode` - Run CSS optimiser in development mode (watch).
   * - `keep` - Do not remove these classes even if not used.
   * - `stylesheets` - Set stylesheets to optimise (remove unused classes from).
   */
  cssOptimiser: {
    classes: [
      'grid',
      'text-',
    ],
    enable: true,
    enableDevMode: false,
    keep: [
      'l2-9',
      'l2-5',
      'l2-8',
      'l6-13',
    ],
    stylesheets: [
      'critical-checkout.css',
      'critical-gift_card.css',
      'critical-password.css',
      'critical-theme.css',
      'layout.theme.css',
    ],
  },

  /**
   * Array of custom elements not to be compiled by Vue.
   */
  customElements: [],

  /**
   * Set to true if using the custom content tool.
   */
  customContentTool: false,

  /**
   * Set production conditions for replacing import files with empty versions.
   * - Each key refers to the file name of a script JS file that has a
   *   *.empty.js copy.
   * - If property is a boolean then it doesn't react to variables.
   * - If the property is an object then the value of the variable is checked,
   *   and if it returns true then the file is replaced with the empty version.
   * - E.g. process.env[variable] === value
   */
  emptyImports: {
    'app-handler': false,
    bugsnag: {
      variable: 'BUGSNAG_API_KEY',
      value: false,
    },
    commands: {
      variable: 'NODE_ENV',
      value: 'production',
    },
  },

  /**
   * Set breakpoints that are considered mobile.
   */
  mobileBreakpoints: ['xs', 's', 'm'],
}
