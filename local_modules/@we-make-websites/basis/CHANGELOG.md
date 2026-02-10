# 📅 Basis Changelog

Basis uses [semantic versioning](https://semver.org/).

See [Basis Adapter changelog](https://bitbucket.org/we-make-websites/basis-adapter/src/master/CHANGELOG.md) for updates to Basis Adapter.

See [Canvas changelog](https://bitbucket.org/we-make-websites/canvas/src/master/CHANGELOG.md) for updates to Canvas.

Jira tasks or Slack messages linked where issue was raised or actioned by someone other than Craig Baldwin.

## 5.3.2 - 2023-07-04

### 🛠️ Fixes
* Fixed CSS optimiser plugin breaking Liquid tags in critical style snippets

## 5.3.0 - 2023-07-04

### 📋 Updates
* Added support for `openReport` setting in _canvas.config.js_ or _adapter.config.js_
* Added _.github/_ folder files (_CODEOWNERS_, _CONTRIBUTING.md_, _dependabot.yml_, and _pull_request_template.md_)
* Renamed `--report` flag to `--build-report`
* Replaced custom stylesheet tags with `stylesheet_tag` Liquid filter
* Updated schema plugin to output error if duplicate section schema file is found ([BASIS-188](https://we-make-websites.atlassian.net/browse/BASIS-188))
* Updated dependencies

### 🛠️ Fixes
* Fixed file copy plugin not outputting an error when copying duplicate files ([BASIS-188](https://we-make-websites.atlassian.net/browse/BASIS-188))
* Fixed CSS optimiser plugin breaking Liquid tags in critical style snippets
* Fixed `--templates` flag not working
* Fixed security issues

## 5.2.0 - 2023-06-06

### 📋 Updates
* Added empty imports plugin to replace imports with empty versions when condition in _canvas.config.js_ is `true`
* Replaced Bugsnag empty imports functionality with empty imports plugin
* Replaced `glob-fs` with `@we-make-websites/file-sync`
* Replaced _get-files-in-folder.js_ helper with `@we-make-websites/file-sync`
* Updated _get-canvas-config.js_ to get _adapter.config.js_ if it exists
* Updated _canvas-bugsnag-plugins.js_ to only run when `process.env.BUDDY` is set
* Updated dependencies

## 5.1.0 - 2023-05-09

### 📋 Updates
* Added `hot` command which uses a local asset server for hot module replacement
* Added `--show-filetypes` flag to `watch` command to output array of filetypes that have been updated
* Added plugin to replace Bugsnag imports when no `BUGSNAG_API_KEY` variable is set
* Replaced `vue-style-loader` with `style-loader`
* Updated order of scripts and stylesheets in _theme-scripts.liquid_ and _theme-styles.liquid_ snippets to better reflect inferred specificity - now follows runtime, critical, bundle, layout, and template
* Updated `watch` command messaging to group localhost URLs
* Updated dependencies

### 🛠️ Fixes
* Fixed infinite compile bug when an error is encountered during compile
* Fixed `download` command deleting sections when a nested snippet of the same name exists ([BASIS-182](https://we-make-websites.atlassian.net/browse/BASIS-182))
* Fixed `download` command failing when _shopify/templates/robots.txt.liquid_ doesn't exist ([BASIS-182](https://we-make-websites.atlassian.net/browse/BASIS-182))

## 5.0.0 - 2023-04-17

### 🚀 Breaking
* Added support for _schemas/settings_schema.js_ file, now supports fragments
* Removed Vue 2 support

### 📋 Updates
* Added `~graphql` alias that points to _graphql/_ folder
* Added `--debug-classes` flag to `build` command to output found classes and the files they were found in
* Updated `download` and `locales` commands to not download _config/settings_schema.json_
* Updated `watch` command to use Webpack hooks for improved reliability
* Updated CSS optimiser to detect classes passed as props to Liquid snippets
* Updated CSS optimiser to support optimising critical stylesheets before creating snippets
* Updated icons plugin to replace _directional-navigation_ case with _direction_ in icon snippets
* Updated dependencies
* Removed style loader for global components, all global styles must be imported into a critical, layout, or async stylesheet

### 🛠️ Fixes
* Fixed gift_card critical styles snippet not being created
* Fixed `download` command downloading section group JSON files
* Fixed `--debug` flag error handling

## 4.4.1 - 2023-05-03

### 🛠️ Fixes
* Fixed `download` command deleting sections when a nested snippet of the same name exists ([BASIS-182](https://we-make-websites.atlassian.net/browse/BASIS-182))
* Fixed `download` command failing when _shopify/templates/robots.txt.liquid_ doesn't exist ([BASIS-182](https://we-make-websites.atlassian.net/browse/BASIS-182))

## 4.4.0 - 2023-03-01

### 📋 Updates
* Added icons shortcode support in stylesheets
* Added debug error messages to plugin catch conditions
* Added `--debug-strings` flag to `build` command to output found strings and the files they were found in
* Added support for _canvas.config.js_ browser configuration
* Updated all commands to support section groups
* Updated CSS optimiser to automatically optimise utility stylesheets
* Updated dependencies

### 🛠️ Fixes
* Fixed development bundling issues
* Fixed `$string()` helper failing to find string due to optional chaining
* Fixed Browsersync notification text styles being affected by tokens
* Fixed theme editor URL

## 4.3.0 - 2022-11-17

### 📋 Updates
* Added `--storybook` flag to `deploy` command to support deploying from _storybook/_ folder
* Added `--templates` flag to `watch` command so it deploys template JSON files
* Updated `copy` command to require `--allow-live` flag to deploy to published themes
* Updated dependencies

## 4.2.0 - 2022-10-27

### 📋 Updates
* Updated `download` command to support any level of nested folders
* Updated branch naming check dependency

### 🛠️ Fixes
* Fixed file copy plugin silently erroring when duplicate files exist in _dist/_ folder
* Fixed issues with `fallbackCacheGroup` bundling by removing it
* Fixed non-Liquid files being copied from _components/_ folder when saving in watch mode

## 4.1.1 - 2022-10-13

### 📋 Updates
* Updated Bugsnag sourcemap uploader plugin to overwrite existing sourcemaps
* Updated recommended VS Code extensions and settings

### 🛠️ Fixes
* Fixed Buddy `$RELEASE_VERSION` variable being ignored

## 4.1.0 - 2022-10-13

### 📋 Updates
* Added theme editor link to `watch` command controls and URLs list ([BASIS-134](https://we-make-websites.atlassian.net/browse/BASIS-134))
* Added support for the `enableDevMode` option in the Canvas CSS optimisation plugin
* Updated `helpme` command descriptions
* Updated dependencies

### 🛠️ Fixes
* Fixed certain dependencies split chunk filenames being too long for Shopify (e.g. Splide)
* Fixed `CANVAS_URL_PARAMETER` not being replaced

## 4.0.0 - 2022-09-28

### 🚀 Breaking
* Increased minimum Node version to `16.17.0`
* No longer supports automatically importing component files
* Removed support for _async_ prefixed files

### 📋 Updates
* Added `--add` flag to `debug` command to emit file added events
* Updated `--debug` flag messaging
* Updated `build` command to delete empty JS and _.DS_Store_ files
* Theme name is now set to _Release_ (instead of _Framework_) when using the `--release-version` flag

#### Infinite build bug ([BASIS-131](https://we-make-websites.atlassian.net/browse/BASIS-131))
* Replaced `HtmlWebpackPlugin` with custom plugin to prevent double `beforeCompile` hook trigger issue
* Replaced `CopyWebpackPlugin` with custom plugin to prevent double compile issue
* Replaced multiple instances of `glob` with custom file finding helper function
* Updated webpack's `context` config
* Updated `build` and `watch` commands to empty _dist/_ folder instead of deleting it
* Increased Webpack watch `aggregateTimeout` option from `600` to `1000` to avoid duplicate compiles
* Fixed Canvas core plugin's `updateAssets()` function not returning a `Promise` to work with `await`

### 🛠️ Fixes
* Fixed custom content tool section schema attribute ([BASIS-137](https://we-make-websites.atlassian.net/browse/BASIS-137))
* Fixed CSS optimiser failing if `keep` property does not exist in _canvas.config.js_
* Fixed Canvas theme variables plugin throwing error if it tries to update Liquid snippet which doesn't exist
* Fixed _get-files-in-folder.js_ helper failing if not provided an array of filetypes to filter by
* Fixed `--release-version` flag not working

## 3.9.0 - 2022-09-01

### 📋 Updates
* Added global components bundle to development mode
* Added new templates paths to Paths helper
* Added `--open-report` flag to `build` command to open report in browser automatically
* Updated strings compiler to throw error if it fails to build _theme-compiled-strings.liquid_
* Updated Canvas shortcodes to be prefixed with `CANVAS_` so their purpose is clearer
* Updated plugins to support _shopify/snippets/theme/theme-variables-checkout.liquid_ file if it exists
* Updated `watch` command `--no-deploy` flag messaging
* Updated dependencies
* Removed schema documentation plugin as it's now its own command

#### Async sub-components ([BASIS-126](https://we-make-websites.atlassian.net/browse/BASIS-126))
* Sub-components loaded asynchronously are now compiled into _async_ prefixed files
* Added support for `CANVAS_COMPONENTS` shortcode to be replaced with array of components
* Updated Canvas core plugin to delete junk components (those that don't match their folder name)
* Updated Canvas core plugin to delete _component_ prefixed files if an _async_ prefixed version exists
* Updated themekit ignores to include new _async_ prefixed files

#### Bundle JS files ([BASIS-126](https://we-make-websites.atlassian.net/browse/BASIS-126))
* For clearer organisation _*.bundle.js_ and _*.bundle.min.js_ files are now called _bundle.*.dev.js_ and _bundle.*.js_ respectively
* Updated naming convention of bundled JS files in config files
* Updated themekit ignores to include new _bundle_ prefixed files

### 🛠️ Fixes
* Fixed rare cases where _bundle.component_ file is exported and fails to load ([BASIS-126](https://we-make-websites.atlassian.net/browse/BASIS-126))
* Fixed icon and string compiler errors being discarded ([BASIS-128](https://we-make-websites.atlassian.net/browse/BASIS-128))
* Fixed 'window is not defined' errors due to use of `window.console` in Node

## 3.8.0 - 2022-07-28

### 📋 Updates
* Linted all files to pass new eslint rules
* Empty and static component JS files are now removed
* Added `--prod-devtools` flag to `build` command to enable Vue DevTools in production mode
* Added `--schema-documentation` flag to `build` command to produce documentation for section settings schema ([BASIS-59](https://we-make-websites.atlassian.net/browse/BASIS-59))

### 🛠️ Fixes
* Fixed custom content tool plugin injected section schema format ([BASIS-101](https://we-make-websites.atlassian.net/browse/BASIS-101))
* Fixed _get-files-in-folder.js_ helper not filtering correctly

## 3.7.0 - 2022-07-14

### 📋 Updates
* Created separate `vue2` dependency release to support Vue 2 SFC files in Basis Adapter ([BASIS-116](https://we-make-websites.atlassian.net/browse/BASIS-116))
* Added `--debug` flag to `build` and `watch` commands
* Added `--no-deploy` flag to `watch` command
* Added `--dist` flag to `debug` command
* Updated critical styles Liquid support to support tags and filters
* Updated theme scripts to read Canvas config
* Updated default config to split global components into their own bundle
* Updated dependencies
* Reverted change which meant `watch` command stopped watching when deploy failed

### 🛠️ Fixes
* Fixed Buddy attempting to deploy after build failure ([BASIS-120](https://we-make-websites.atlassian.net/browse/BASIS-120))
* Fixed sections schema plugin failing to inject schema when there are lots of section files ([BASIS-121](https://we-make-websites.atlassian.net/browse/BASIS-121))
* Fixed Bundle analyser plugin outputting messaging when build fails
* Minor `await`/`async` fixes to Webpack plugins

## 3.6.0 - 2022-06-30

### 📋 Updates
* Added Canvas CSS optimiser plugin
* Added `--allow-live`, `--browser` and `--no-incognito` flags to `watch` command
* Updated `watch` controls to open localhost links in Firefox by default
* Updated dependencies
* Removed `type` attributes from theme scripts and styles

### 🛠️ Fixes
* Fixed Basis Adapter failing due to missing _components/_ folder ([BASIS-113](https://we-make-websites.atlassian.net/browse/BASIS-113))
* Fixed `watch` command not exiting when failing to deploy

## 3.5.0 - 2022-06-16

### 📋 Updates
* Added `templates` command to download only template JSON files
* Replaced `watch` command keyboard shortcuts with terminal controls
* Updated sections schema plugin to support Canvas component _fragment.js_ schema files

#### `copy` command
* Added `--development` and `--production` flags to define default environments
* Updated to fetch list of themes from stores listed in _config.yml_ to offer as source/destination choices
* Updated messaging
* Updated to gracefully exit

### 🛠️ Fixes
* Fixed strings compiler misinterpreting dynamic values ([BASIS-106](https://we-make-websites.atlassian.net/browse/BASIS-106))

## 3.4.0 - 2022-05-19

### 📋 Updates
* Added myshopify.com theme preview link to `watch` command
* Added `--port` flag to the `watch` command
* Added `i` and `o` shortcuts to the `watch` command to open preview URL in browser
* Added shortcuts to `helpme` command reference
* Added Vue bundle to development mode Webpack config
* Added glob paths to Paths helper
* Added `debug` command to watch file changes
* Updated development mode Webpack config to split vendors bundle when over 1MB
* Updated `build` and `watch` commands to use shared build and deploy APIs
* Updated custom content tool plugin to automatically inject schema Liquid into data attribute
* Updated strings compiler validation to output a list of missing strings instead of a sentence
* Removed unused `console-clear` dependency

### 🛠️ Fixes
* Fixed `build` command `--strings` flag displaying incorrect messaging
* Fixed strings compiler validation causing a fatal error if string references an object which doesn't exist ([BASIS-95](https://we-make-websites.atlassian.net/browse/BASIS-95))

## 3.3.0 - 2022-05-05

### 📋 Updates
* Added support for custom content tool ([BASIS-69](https://we-make-websites.atlassian.net/browse/BASIS-69))
* Added `helpme` command to detail all support commands and flags
* Updated `@we-make-websites/branch-naming-check` to support branches named `main`
* Updated dependencies

### 🛠️ Fixes
* Fixed section schema functionality being limited to Canvas
* Fixed custom elements not being defined properly ([CANVAS-142](https://we-make-websites.atlassian.net/browse/CANVAS-142))
* Fixed `download` command failing due to _.DS_Store_ file ([BASIS-84](https://we-make-websites.atlassian.net/browse/BASIS-84))

## 3.2.0 - 2022-04-13

### 📋 Updates
* Added `@` wildcard support to JS files in _scripts/templates/_ folder
* Added `--release-version` flag to `build` command to use Buddy `$RELEASE_VERSION` variable instead of Canvas version in _settings_schema.json_ theme version
* Added `--no-clear` flag to `build` and `watch` commands to prevent clearing terminal
* Added support for `mode` variable in `cnvs.environment`
* Combined `build` command's `--icons --all` flags into `--icons-all` flag

### 🛠️ Fixes
* Fixed icon compiler throwing fatal error when _icons/_ folder contains _.DS_Store_ file ([BASIS-78](https://we-make-websites.atlassian.net/browse/BASIS-78))
* Fixed `locales` command not using production environment as default
* Fixed missing _icons/_ folder causing error in development mode

## 3.1.0 - 2022-04-07

### 📋 Updates
* Added `--templates` flag to `deploy` command to upload template JSON files
* Updated `copy` command to read _config.yml_ file to offer autocomplete list of environments
* Updated reports to not be created when being built by a Buddy pipeline
* Replaced time taken function with `Tny.time()` function
* Replaced `fs.rm()` with `fs.remove()` when deleting _dist/_ folder when running `build` or `watch` commands
* Updated commands to use environment variable to determine if running a Canvas project
* Added fallback _.themekit/_ folder
* Improved `watch` command error handling when _config.yml_ or environment doesn't exist
* Updated dependencies

### 🛠️ Fixes
* Fixed Browsersync not connecting to browsers
* Fixed localhost being redirected on sites with custom domain redirection ([BASIS-75](https://we-make-websites.atlassian.net/browse/BASIS-75))
* Fixed `deploy` and `watch` commands not throwing a custom error when _dist/_ folder doesn't exist
* Fixed not being able to exit `watch` process until after first build
* Fixed missing _icons/_ folder causing fatal error

## 3.0.1 - 2022-03-24

### 🛠️ Fixes
* Fixed strings compiler causing errors in non-Canvas builds
* Fixed `build` command running functions multiple times in single build
* Fixed `build` command messaging when run in a Buddy pipeline
* Fixed `design` command paths

## 3.0.0 - 2022-03-17

### 🚀 Breaking
* Increased minimum Node version to `16.14.0`
* Updated commands to use new themekit folder for ignore files

### 📋 Updates
* Updated Basis plugins to be asynchronous
* Moved console messaging from Basis core plugin to command files
* Split Basis plugins so a plugin doesn't perform multiple tasks
* Increased watch timeout so watch waits longer after first file save before starting build
* Added icons functionality to build process - optimises and compiles SVG files in _icons/_ folder into Liquid snippets
* Added strings functionality to build process - uses `$string()` helper to compile `cnvs.compiledStrings` object
* Added `--icons` and `--strings` flags to `build` command
* Added paths required by new functionality
* Updated theme version that's displayed in Shopify themes admin
* Added `copy` command - copies locales, settings, and templates from one theme to another
* Added keyboard listener to watch command - pressing 'u' runs upload whilst watching
* Renamed BASIS and CANVAS to Basis and Canvas respectively

### 🛠️ Fixes
* Fixed schema fragments being cached after initial build and not updating on change
* Fixed update script JS function failing as file source is not always a string
* Fixed theme scripts and styles not referencing template files with a suffix correctly
* Fixed time taken not displaying correct clock emoji in some situations

## 2.3.0 - 2022-02-10

### 📋 Updates
* Replaced Chalk and Ora dependencies with custom Tannoy feature
* Updated `download` command to reset `cnvs.environnment` in _shopify/snippets/theme/theme-variables.liquid_, if it exists
* Updated critical styles builder to create a snippet for all .scss file in the _styles/critical_ folder, instead of defined list
* Updated time taken to output relevant clock emoji
* Updated dependencies

### 🛠️ Fixes
* Fixed webpack loader rules not merging correctly when using _basis.config.js_

## 2.2.0 - 2022-01-26

### 📋 Updates
* Made webpack config extendable with _basis.config.js_ file in root of project
* Added `--adapter` flag for use with `build` and `watch` commands for non-Canvas themes
* Source maps are now outputted for minified JS files when in production mode
* Version parameter is now included in chunk template name and used instead of Shopify parameter in _theme-scripts.liquid_ snippet
* Updated compiler to support Bugsnag integration using Buddy environment variables
* Updated vendors bundle file name template to _[name].bundle.js_ and _[name].bundle.min.js_
* Updated dependencies

### 🛠️ Fixes
* Fixed issues when building Frame 3 themes
* Fixed environment variables issue due to their values always being stored as strings
* Fixed critical stylesheet snippets being generated when no critical stylesheet exists

## 2.1.1 - 2021-12-16

### 🛠️ Fixes
* Fixed build failing when a file exists at the root of the _src/shopify_ folder

## 2.1.0 - 2021-12-14

### 📋 Updates
* Updated dependencies

## 2.0.2 - 2021-12-02

### 🛠️ Fixes
* Fixed webpack loaders not being resolved

## 2.0.1 - 2021-12-02

### 🛠️ Fixes
* Fixed availability of `postcss` packages in _node\_modules_

## 2.0.0 - 2021-12-02

### ⚠️ Breaking
* Moved `component` command and templates to Canvas repo

### 📋 Updates
* Added _stores_ and component _templates_ path to paths helper
* Updated webpack config to ignore storybook files when watching
* Removed processing error message
* Updated dependencies

### 🛠️ Fixes
* Fixed `download` command failing in Basis Adapter
* Fixed `download` command using development environment by default

## 1.3.0 - 2021-11-30

### 📋 Updates
* Added support for Basis Adapter

## 1.2.0 - 2021-11-17

### 📋 Updates
* Updated `component` command templates with new CSS loading methods
* Updated dependencies

### 🛠️ Fixes
* Fixed duplicate injection of component stylesheets
* Fixed stylesheets not being loaded when JavaScript is disabled

## 1.1.1 - 2021-11-11

### 🛠️ Fixes
* Fixed Liquid support in critical stylesheets
* Fixed _package.json_ description and homepage
* Removed unused `cross-env` dependency

## 1.1.0 - 2021-11-10

### 📋 Updates
* Updated component command template default attributes
* Dependency updates

## 1.0.1 - 2021-11-09

### 🛠️ Fixes
* Fixed _README.md_ documentation links
* Fixed _CHANGELOG.md_ missing date
* No undeclared variables eslint rule not being applied correctly

## 1.0.0 - 2021-11-04

### ⚠️ Breaking
* Moved Shopify theme files to _src/shopify_ folder
* Added support for _critical_ styles folder instead of fixed file

### 📋 Updates
* Updated dependencies
* Updated dependency versions to be explicit
* Extensively re-built `component` command
* Added `--env` flag support to `watch` command
* Critical JS files are now removed in the _critical styles plugin_
* Created _paths.js_ file with reference paths to all required folders and files
* Updated themekit ignore files
* Added contributors to _package.json_
* Updated Browsersync notification styles to match custom preview bar
* Updated async component template to use classes from helper file
* Added support for customers templates global stylesheet and script file
* Updated section templates with `aria-labelledby` property and placeholder title element
* Updated timings to display in seconds when greater than 1000ms

### 🛠️ Fixes
* Fixed customer templates JS files not being compiled and included in _theme-scripts.liquid_
* Fixed customer templates CSS files not being compiled and included in _theme-styles.liquid_
* Removed beta version from version string when combining package versions in _settings_schema.json_

## 0.6.0 - 2021-09-07
* Updated dependencies

## 0.5.17 - 2021-08-19
* Updated `component` command templates with `liquid` class

## 0.5.16 - 2021-08-19
* Updated dependencies
* Updated `component` command prompt order
* Updated `lint-staged` to run stylelint on Vue files
* Updated index component and store with mobile state
* Fixed iOS bounce scroll changing header state to closed

## 0.5.15 - 2021-08-18
* Canvas update

## 0.5.14 - 2021-08-17
* Canvas update

## 0.5.13 - 2021-08-16
* Fixed `component` command when generating snippet
* Updated dependencies

## 0.5.12 - 2021-08-13
* Canvas update

## 0.5.11 - 2021-08-12
* Updated download ignore list

## 0.5.10 - 2021-08-11
* Updated dependencies
* Updated webpack development and production mode `optimization` settings
* Removed outdated page entry point from theme scripts template

## 0.5.9 - 2021-08-10
* Canvas update

## 0.5.8 - 2021-08-09
* Added static option to `component` command
* Updated dependencies
* Updated webpack development and production mode `optimization` settings

## 0.5.7 - 2021-08-05
* Added critical component styles to templates

## 0.5.6 - 2021-08-04
* Added `--env` flag support to `deploy`, `download`, and `locales` commands
* Updated `component` command output
* Increased duration of Browsersync notifications
* Fixed `download` command not moving _global_ folder components

## 0.5.5 - 2021-08-03
* Canvas update

## 0.5.4 - 2021-08-03
* Added additional options to `yarn component` command
* Fixed `yarn start` functions running multiple times when saving files in quick succession

## 0.5.3 - 2021-08-02
* Canvas update

## 0.5.2 - 2021-08-02
* Canvas update

## 0.5.1 - 2021-08-02
* Added support to Basis schema plugin for _global_ components folder

## 0.5.0 - 2021-07-29
* Added support for _global_ components folder
* Added support for _scripts/vendors_ to be compiled as standalone assets
* Updated webpack plugins to use `tapAsync`

## 0.4.0 - 2021-07-26
* Added linting
* Linted all files

## 0.3.0 - 2021-07-21
* Upgraded Vue 2 to Vue 3
* Updated dependencies

## 0.2.0 - 2021-07-15
* Added Online Store 2.0 support

## 0.1.0 - 2021-06-21
* Initial development
