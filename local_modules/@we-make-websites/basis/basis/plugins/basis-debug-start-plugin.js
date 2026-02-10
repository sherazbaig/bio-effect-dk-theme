/**
 * Plugin: Basis debug start plugin
 * -----------------------------------------------------------------------------
 * Outputs messages at the start of each Webpack stage.
 *
 */
const { Compilation } = require('webpack')

const debug = require('../helpers/debug')

/**
 * Set variables.
 */
const pluginName = 'BasisDebugStart'

/**
 * Tap into hooks and add functionality.
 */
module.exports = class BasisDebugStart {
  apply(compiler) {
    if (process.env.DEBUG !== 'true') {
      return
    }

    compiler.hooks.environment.tap(pluginName, () => debugHook('environment'))
    compiler.hooks.run.tapAsync(pluginName, (_, callback) => debugHook('run', callback))
    compiler.hooks.watchRun.tapAsync(pluginName, (_, callback) => debugHook('watchRun', callback))
    compiler.hooks.beforeCompile.tapAsync(pluginName, (_, callback) => debugHook('beforeCompile', callback))
    compiler.hooks.compile.tap(pluginName, () => debugHook('compile'))

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      debug('Hook', 'thisCompilation start', 'bgWhite')

      compilation.hooks.afterOptimizeChunkModules.tap(pluginName, () => debugHook('afterOptimizeChunkModules'))

      compilation.hooks.processAssets.tapAsync(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => debugStage('additional', callback),
      )

      compilation.hooks.processAssets.tapAsync(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE },
        (_, callback) => debugStage('optimise', callback),
      )

      compilation.hooks.processAssets.tapAsync(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE },
        (_, callback) => debugStage('optimise size', callback),
      )

      compilation.hooks.processAssets.tapAsync(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE },
        (_, callback) => debugStage('analyse', callback),
      )

      compilation.hooks.processAssets.tapAsync(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_REPORT },
        (_, callback) => debugStage('report', callback),
      )
    })

    compiler.hooks.done.tapAsync(pluginName, (_, callback) => debugHook('done', callback))
    compiler.hooks.failed.tap(pluginName, () => debugHook('failed'))
    compiler.hooks.additionalPass.tapAsync(pluginName, (_, callback) => debugHook('additionalPass', callback))
    compiler.hooks.shutdown.tapAsync(pluginName, (_, callback) => debugHook('shutdown', callback))
  }
}

/**
 * Function to run in hook when debugging.
 * @param {String} hook - Hook name.
 * @param {Function|Boolean} callback - Callback process to run at end.
 */
function debugHook(hook, callback = false) {
  if (hook === 'watchRun') {
    debug('Watch', 'Job start\n')
  }

  debug('Hook', `${hook} start`, 'bgWhite')

  if (typeof callback !== 'function') {
    return
  }

  callback()
}

/**
 * Function to run in stage when debugging.
 * @param {String} stage - Stage name.
 * @param {Function|Boolean} callback - Callback process to run at end.
 */
function debugStage(stage, callback = false) {
  debug('Stage', `${stage} start`, 'bgWhite')

  if (typeof callback !== 'function') {
    return
  }

  callback()
}
