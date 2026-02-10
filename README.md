# 🎨 Bioeffect

Next generation theme framework and compiler built using dynamic Vue components and Basis.

See [Canvas](https://we-make-websites.gitbook.io/canvas/canvas-5.9.0?fallback=true) and [Basis](https://we-make-websites.gitbook.io/basis/basis-5.9.0?fallback=true) documentation for further details.

## Overview

The files in this handover are the original source files of the theme (contained in the _src/_ folder). Using the commands below these files are compiled into minified versions (in the _dist/_ folder) which can then be uploaded to Shopify.

Theme changes should only be made to the source files.

## Installation

### Dependencies

* Node 16.17.0
* Themekit 1.3.0

### Initial setup

1. Install dependencies using `yarn install`
2. Duplicate _config.sample.yml_ and rename to _config.yml_
3. Update environments in _config.yml_ with store name, theme ID, and admin API password/token with theme edit access (we recommend using the [Theme Access app](https://apps.shopify.com/theme-access))

## Commands

General workflow is to use `yarn watch` whilst making changes, this command allows you to make changes and have them be automatically uploaded to your theme. Once your changes are complete you need to run `yarn deploy` to deploy the production-ready files to your theme.

You shouldn't use `yarn watch` to work on a theme and then use that theme as the published theme as `yarn watch` does not minify the files as efficiently and the performance of your theme will be affected.

For more commands use `yarn helpme`.

### `yarn build`

* Compiles the _src/_ folder into the _dist/_ folder in production mode ready for upload to Shopify
* Also produces a bundle analyser report in the _reports/_ folder
* **Flags**
  * `--dev` - Builds in development mode (quicker but JS and SCSS is not minimised)
  * `--live` - (Default) Builds in production mode
  * `--debug` - Replaces default messaging with debugging (for debugging Basis compiler)
  * `--no-clear` - Disables clearing terminal messages
  * `--icons` - Optimises any un-optimised icons in the _src/icons/_ folder, does not build a complete theme
  * `--icons-all` - Optimises all icons in the _src/icons/_ folder, does not build a complete theme
  * `--open-report` - Opens report in browser automatically if one is built
  * `--report` - Outputs a report when in development (`--dev`) mode

### `yarn component`

* Scaffolds new component based on user input

### `yarn deploy`

* Compiles the src/ folder into the dist/ folder in production mode and uploads to `development` environment in config.yml
* Does not deploy template JSON files by default to avoid overwriting theme settings
* We do not recommend deploying to the published theme, instead we suggest using a deployment manager like Buddy
* **Flags**
  * `--dev` - (Default) Deploys to development environment
  * `--live` - Deploys to production environment, will not work if production is set to readonly in config.yml
  * `--templates` - Uploads section group and template JSON files, these files are usually ignored to prevent accidentally overwriting section settings

### `yarn watch`

* Compiles the _src/_ folder into the _dist/_ folder in development mode and uploads to `development` environment in _config.yml_
* Starts watch ready to re-compile and re-upload files upon file save
* Does not deploy template JSON files by default to avoid overwriting theme settings
* **Flags**
  * `--dev` - (Default) Builds in development mode (quicker but JS and SCSS is not minimised)
  * `--live` - Builds in production mode
  * `--debug` - Replaces default messaging with debugging (for debugging Basis compiler)
