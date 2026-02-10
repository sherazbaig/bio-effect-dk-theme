/**
 * Helper: Paths
 * -----------------------------------------------------------------------------
 * Single source of truth for path locations for use in Basis.
 *
 */
const path = require('path')

const rootFolder = path.resolve(path.dirname('src'))

/**
 * Export.
 * @returns {Object}
 */
module.exports = {
  adapter: {
    config: path.resolve(rootFolder, 'adapter.config.js'),
  },
  basis: {
    config: {
      custom: path.resolve(rootFolder, 'basis.config.js'),
      default: '../config',
    },
    folders: [
      'components',
      'icons',
      'schemas',
      'scripts',
      'styles',
    ],
    ignoredCopyPaths: [
      'bundle.',
      'component.',
      'layout.',
      'vendor.',
      'runtime.js',
      'template.',
      'critical-',
      'icon-',
      'theme-compiled-strings.liquid',
      'theme-scripts.liquid',
      'theme-styles.liquid',
    ],
    ignoredWatchPaths: [
      '**/node_modules',
      '**/*.stories.mdx',
      '**/*.stories.js',
      '**/package.json',
    ],
    packageJson: '../../package.json',
    reports: '../../reports',
    temp: path.resolve(rootFolder, 'temp'),
    templates: path.resolve(__dirname, '../templates'),
    validTemplates: [
      '404',
      'account',
      'activate_account',
      'addresses',
      'article',
      'blog',
      'cart',
      'collection',
      'customers',
      'gift_card',
      'index',
      'list-collections',
      'login',
      'order',
      'page',
      'password',
      'product',
      'register',
      'reset_password',
      'search',
    ],
  },
  canvas: {
    commands: path.resolve(rootFolder, 'canvas', 'commands.js'),
    config: path.resolve(rootFolder, 'canvas.config.js'),
    configYml: path.resolve(rootFolder, 'config.yml'),
    design: path.resolve(rootFolder, 'design.config.js'),
    packageJson: path.resolve(rootFolder, 'package.json'),
    templates: {
      component: path.resolve(rootFolder, 'canvas', 'templates', 'component'),
      design: path.resolve(rootFolder, 'canvas', 'templates', 'design'),
      docs: path.resolve(rootFolder, 'canvas', 'templates', 'docs'),
      root: path.resolve(rootFolder, 'canvas', 'templates'),
    },
    tokens: path.resolve(rootFolder, 'tokens.json'),
  },
  components: {
    async: path.resolve(rootFolder, 'src', 'components', 'async'),
    global: path.resolve(rootFolder, 'src', 'components', 'global'),
    root: path.resolve(rootFolder, 'src', 'components'),
  },
  dist: {
    config: {
      root: path.resolve(rootFolder, 'dist', 'config'),
      schema: path.resolve(rootFolder, 'dist', 'config', 'settings_schema.json'),
    },
    robots: path.resolve(rootFolder, 'dist', 'templates', 'robots.txt.liquid'),
    root: path.resolve(rootFolder, 'dist'),
    sections: path.resolve(rootFolder, 'dist', 'sections'),
    snippets: path.resolve(rootFolder, 'dist', 'snippets'),
    themeCompiledStrings: path.resolve(rootFolder, 'dist', 'snippets', 'theme-compiled-strings.liquid'),
  },
  documentation: path.resolve(rootFolder, 'documentation'),
  graphql: path.resolve(rootFolder, 'src', 'graphql'),
  icons: path.resolve(rootFolder, 'src', 'icons'),
  schemas: {
    fragments: path.resolve(rootFolder, 'src', 'schemas', 'fragments'),
    root: path.resolve(rootFolder, 'src', 'schemas'),
    settingsSchema: path.resolve(rootFolder, 'src', 'schemas', 'settings_schema.js'),
  },
  scripts: {
    config: path.resolve(rootFolder, 'src', 'scripts', 'config'),
    configClasses: path.resolve(rootFolder, 'src', 'scripts', 'config', 'classes.js'),
    core: {
      imports: path.resolve(rootFolder, 'src', 'scripts', 'core', 'canvas-imports.js'),
      root: path.resolve(rootFolder, 'src', 'scripts', 'core'),
    },
    customers: path.resolve(rootFolder, 'src', 'scripts', 'templates', 'customers'),
    layout: path.resolve(rootFolder, 'src', 'scripts', 'layout'),
    root: path.resolve(rootFolder, 'src', 'scripts'),
    templates: path.resolve(rootFolder, 'src', 'scripts', 'templates'),
    vendors: path.resolve(rootFolder, 'src', 'scripts', 'vendors'),
  },
  shopify: {
    assets: path.resolve(rootFolder, 'src', 'shopify', 'assets'),
    icons: path.resolve(rootFolder, 'src', 'shopify', 'snippets', 'icons'),
    locales: path.resolve(rootFolder, 'src', 'shopify', 'locales'),
    robots: path.resolve(rootFolder, 'src', 'shopify', 'templates', 'robots.txt.liquid'),
    root: path.resolve(rootFolder, 'src', 'shopify'),
    sections: path.resolve(rootFolder, 'src', 'shopify', 'sections'),
    snippets: path.resolve(rootFolder, 'src', 'shopify', 'snippets'),
    templates: path.resolve(rootFolder, 'src', 'shopify', 'templates'),
    themeVariables: {
      checkout: path.resolve(rootFolder, 'src', 'shopify', 'snippets', 'theme', 'theme-variables-checkout.liquid'),
      layout: path.resolve(rootFolder, 'src', 'shopify', 'snippets', 'theme', 'theme-variables.liquid'),
    },
  },
  src: path.resolve(rootFolder, 'src'),
  stores: {
    root: path.resolve(rootFolder, 'src', 'stores'),
  },
  storybook: {
    assets: path.resolve(rootFolder, '.storybook', 'assets'),
    root: path.resolve(rootFolder, '.storybook'),
    stories: path.resolve(rootFolder, '.storybook', 'stories'),
  },
  styles: {
    base: path.resolve(rootFolder, 'src', 'styles', 'base'),
    config: path.resolve(rootFolder, 'src', 'styles', 'config'),
    critical: path.resolve(rootFolder, 'src', 'styles', 'critical'),
    layout: {
      root: path.resolve(rootFolder, 'src', 'styles', 'layout'),
      theme: path.resolve(rootFolder, 'src', 'styles', 'layout', 'theme.scss'),
    },
    root: path.resolve(rootFolder, 'src', 'styles'),
  },
  themekit: {
    copy: path.resolve(rootFolder, '.themekit', 'copy'),
    deploy: path.resolve(rootFolder, '.themekit', 'deploy'),
    download: path.resolve(rootFolder, '.themekit', 'download'),
    hot: path.resolve(rootFolder, '.themekit', 'hot'),
    locales: path.resolve(rootFolder, '.themekit', 'locales'),
    root: path.resolve(rootFolder, '.themekit'),
    temp: path.resolve(rootFolder, '.themekit', 'temp'),
    templates: path.resolve(rootFolder, '.themekit', 'templates'),
  },
  types: [
    'assets',
    'config',
    'layout',
    'locales',
    'sections',
    'snippets',
    'templates',
  ],
}
