/**
 * Helper: Commands
 * -----------------------------------------------------------------------------
 * List of all commands and flags in Canvas.
 *
 */

/**
 * Export config.
 * @returns {Array}
 */
module.exports = [
  {
    name: 'component',
    canvas: true,
    description: 'Creates component scaffold in relevant folder',
    flags: [],
  },
  {
    name: 'design',
    canvas: true,
    description: 'Reads tokens.json file to generate config stylesheets and JS files, and updates Storybook styleguide',
    flags: [
      {
        name: '--no-js',
        description: 'Disables output of config script JS files',
      },
      {
        name: '--no-storybook',
        description: 'Disables output of Storybook styleguide files',
      },
      {
        name: '--path=[new/path]',
        description: 'Updates the path used for generated files',
      },
    ],
  },
  {
    name: 'docs',
    description: 'Builds markdown documentation for section settings schemas',
    flags: [
      {
        name: '--html',
        description: 'Exports documentation as HTML instead',
      },
      {
        name: '--template=[template]',
        description: 'Sets the documentation template',
      },
    ],
  },
  {
    name: 'library',
    canvas: true,
    description: 'Automatically installs a component from the Library',
    flags: [
      {
        name: '--branch=[branch]',
        description: 'Sets custom branch to fetch and use',
      },
      {
        name: '--components=[name]',
        description: 'Installs comma-separated list of components directly',
      },
      {
        name: '--debug',
        description: 'Sets debug mode to run the command inside the dependency',
      },
      {
        name: '--no-clear',
        description: 'Disables clearing terminal messages',
      },
    ],
  },
  {
    name: 'storybook',
    canvas: true,
    description: 'Runs Storybook locally',
    flags: [
      {
        name: '--port=[port]',
        description: 'Sets port used by Storybook, default is 6006',
      },
    ],
  },
  {
    name: 'storybook-build',
    canvas: true,
    description: 'Builds a static instance of Storybook which can be deployed to Shopify',
    flags: [
      {
        name: '--debug',
        description: 'Outputs Storybook\'s messaging to help debug build issues',
      },
    ],
  },
]
