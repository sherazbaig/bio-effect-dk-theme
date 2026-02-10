/**
 * Helper: Commands
 * -----------------------------------------------------------------------------
 * List of all commands and flags in Basis.
 *
 */

/**
 * Export config.
 * @returns {Array}
 */
module.exports = [
  {
    name: 'build',
    description: 'Compiles the theme and outputs bundle analyser report',
    flags: [

      {
        name: '--dev',
        description: 'Builds in development mode',
      },
      {
        name: '--live',
        description: '(Default) Builds in production mode',
      },
      {
        name: '--adapter',
        description: 'Disables Canvas specific features, add to scripts in package.json',
      },
      {
        name: '--build-report',
        description: 'Outputs a bundle report when in development (--dev) mode',
      },
      {
        name: '--debug',
        description: 'Replaces default messaging with debugging',
      },
      {
        name: '--debug-classes',
        description: 'Outputs found classes and the files they were found in',
      },
      {
        name: '--debug-strings',
        description: 'Outputs found strings and the files they were found in',
      },
      {
        name: '--no-clear',
        description: 'Disables clearing terminal messages',
      },
      {
        name: '--icons',
        description: 'Runs icons functionality in isolation, does not build a complete theme',
      },
      {
        name: '--icons-all',
        description: 'Runs icons functionality in isolation and re-optimises all icons',
      },
      {
        name: '--open-report',
        description: 'Opens bundle report in browser automatically if one is made',
      },
      {
        name: '--prod-devtools',
        description: 'Enables Vue DevTools when building the theme in production mode',
      },
      {
        name: '--strings',
        description: 'Runs strings functionality in isolation, does not build a complete theme',
      },
      {
        name: '--use-release-version',
        description: 'Uses $RELEASE_VERSION variable as theme version in settings_schema.json',
      },
    ],
  },
  {
    name: 'copy',
    description: 'Copies locales, settings, section and template JSON files from a source Shopify environment and uploads them to a destination Shopify environment',
    flags: [
      {
        name: '--dev=[env]',
        description: 'Sets default destination environment',
      },
      {
        name: '--prod=[env]',
        description: 'Sets default source environment',
      },
      {
        name: '--allow-live',
        description: 'Enables deployment to published themes (not recommended)',
      },
    ],
  },
  {
    name: 'debug',
    description: 'Watches the src folder for file changes or removals, must be run from Basis project folder',
    flags: [
      {
        name: '--add',
        description: 'Watches for new files being created as well',
      },
      {
        name: '--dist',
        description: 'Watches for changes in the dist folder instead',
      },
    ],
  },
  {
    name: 'deploy',
    description: 'Compiles the theme using production mode and deploys to Shopify environment',
    flags: [
      {
        name: '--dev',
        description: '(Default) Deploys to development environment',
      },
      {
        name: '--live',
        description: 'Deploys to production environment',
      },
      {
        name: '--env=[env]',
        description: 'Deploys to custom environment, overrides previous flags',
      },
      {
        name: '--storybook',
        description: 'Deploys from storybook/ folder, must be used directly with basis-deploy',
      },
      {
        name: '--templates',
        description: 'Includes sections and template JSON files in deployment',
      },
    ],
  },
  {
    name: 'download',
    description: 'Downloads the theme from Shopify and re-organises files',
    flags: [
      {
        name: '--dev',
        description: 'Downloads from development environment',
      },
      {
        name: '--live',
        description: '(Default) Downloads from production environment',
      },
      {
        name: '--env=[env]',
        description: 'Downloads from custom environment, overrides previous flags',
      },
      {
        name: '--no-file-move',
        description: 'Prevents files from being re-organised',
      },
      {
        name: '--no-schema-reset',
        description: 'Prevents {% schema %} tags from being reset',
      },
    ],
  },
  {
    name: 'hot',
    description: 'Similar to watch except serves assets locally and supports hot module replacement',
    flags: [
      {
        name: '--dev',
        description: '(Default) Builds in development mode and deploys to development environment',
      },
      {
        name: '--env=[env]',
        description: 'Deploys to custom environment, overrides previous flags',
      },
      {
        name: '--assets-port',
        description: 'Sets the port used by the local asset server',
      },
      {
        name: '--browser',
        description: 'Sets browser used to open localhost links when using controls',
      },
      {
        name: '--debug',
        description: 'Replaces default messaging with debugging',
      },
      {
        name: '--no-incognito',
        description: 'Opens localhost link in standard window when browser is set to Chrome',
      },
      {
        name: '--port',
        description: 'Sets port used by Browsersync, default is between 3000-4000',
      },
      {
        name: '--show-filetypes',
        description: 'Outputs array of filetypes that have been updated',
      },
      {
        name: '--templates',
        description: 'Includes template JSON files in watch',
      },
    ],
  },
  {
    name: 'locales',
    description: 'Downloads settings_schema.json and shopify/locales/ files',
    flags: [
      {
        name: '--dev',
        description: 'Downloads from development environment',
      },
      {
        name: '--live',
        description: '(Default) Downloads from production environment',
      },
      {
        name: '--env=[env]',
        description: 'Downloads from custom environment, overrides previous flags',
      },
    ],
  },
  {
    name: 'start',
    description: 'Alias for yarn watch, accepts same flags',
    flags: [],
  },
  {
    name: 'templates',
    description: 'Downloads section group and template JSON files',
    flags: [
      {
        name: '--dev',
        description: 'Downloads from development environment',
      },
      {
        name: '--live',
        description: '(Default) Downloads from production environment',
      },
      {
        name: '--env=[env]',
        description: 'Downloads from custom environment, overrides previous flags',
      },
      {
        name: '--no-file-move',
        description: 'Prevents files from being re-organised',
      },
    ],
  },
  {
    name: 'watch',
    description: 'Compiles the theme in development mode, deploys files, starts Browsersync instance, and watches for further changes',
    flags: [
      {
        name: '--dev',
        description: '(Default) Builds in development mode and deploys to development environment',
      },
      {
        name: '--live',
        description: 'Builds in production mode and deploys to development environment',
      },
      {
        name: '--env=[env]',
        description: 'Deploys to custom environment, overrides previous flags',
      },
      {
        name: '--adapter',
        description: 'Disables Canvas specific features, add to scripts in package.json',
      },
      {
        name: '--allow-live',
        description: 'Enables deployment to published themes (not recommended)',
      },
      {
        name: '--browser',
        description: 'Sets browser used to open localhost links when using controls',
      },
      {
        name: '--debug',
        description: 'Replaces default messaging with debugging',
      },
      {
        name: '--no-clear',
        description: 'Disables clearing terminal messages',
      },
      {
        name: '--no-deploy',
        description: 'Disables deploying files whilst watching',
      },
      {
        name: '--no-incognito',
        description: 'Opens localhost link in standard window when browser is set to Chrome',
      },
      {
        name: '--port',
        description: 'Sets port used by Browsersync, default is between 3000-4000',
      },
      {
        name: '--show-filetypes',
        description: 'Outputs array of filetypes that have been updated',
      },
      {
        name: '--templates',
        description: 'Includes template JSON files in watch',
      },
    ],
  },
]
