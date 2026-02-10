/**
 * Helper: Get Browsersync config
 * -----------------------------------------------------------------------------
 * Creates Browsersync instance.
 *
 */

/**
 * Export.
 * @param {String} myShopifyUrl - .myshopify URL to site.
 * @param {Object} ports - Theme, Browsersync, and Webpack dev server ports.
 * @returns {Object}
 */
module.exports = (myShopifyUrl, ports) => {
  return {

    /**
     * Match files but do nothing when they change, instead trigger
     * reload once theme kit has finished uploading.
     */
    files: {
      match: ['*/*.*'],
      fn: () => {
        return false
      },
    },
    logLevel: 'silent',
    notify: {
      styles: [
        'background-color: #000',
        'border-radius: 0',
        'bottom: 16px',
        'color: #fff',
        'display: none',
        'font-family: sans-serif',
        'font-weight: normal',
        'font-size: 10px',
        'letter-spacing: 0',
        'line-height: 100%',
        'margin: 0',
        'padding: 8px 12px',
        'position: fixed',
        'right: 16px',
        'text-align: center',
        'text-decoration: none',
        'text-indent: 0',
        'word-spacing: 0',
        'z-index: 9999',
      ],
    },
    open: false,
    port: ports.theme,
    proxy: {
      target: myShopifyUrl,

      /**
       * Run middleware between proxy and response.
       * - Shopify sites with redirection enabled for custom domains force
       *   redirection to that domain.
       * - ?_fd=0 prevents that forwarding.
       * - ?pb=0 hides the Shopify preview bar.
       */
      middleware: (req, _, next) => {
        const prefix = req.url.indexOf('?') > -1 ? '&' : '?'
        const queryStringComponents = ['_fd=0&pb=0']

        req.url += prefix + queryStringComponents.join('&')
        next()
      },

      /**
       * Modify server response after it's returned from proxy.
       * - Disable HSTS to prevent local development issues.
       */
      proxyRes: [
        function res(proxyRes) {
          delete proxyRes.headers['strict-transport-security']
        },
      ],
    },

    /**
     * Fixes BrowserSync adding to the wrong body tag due to Shopify's
     * analytics injection.
     */
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: (snippet, match) => {
          return snippet + match
        },
      },
    },
    ui: {
      port: ports.browsersync,
    },
    watch: false,
  }
}
