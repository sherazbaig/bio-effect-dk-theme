/**
 * Core / Plugin: Helpers
 * -----------------------------------------------------------------------------
 * Vue plugin to extend Vue instance with global helpers.
 * - Add in alphabetical order.
 *
 */
import { formatMoney } from '@we-make-websites/theme-currency'

import classes from '~/config/classes'
import timings from '~/config/timings'
import { formatImageUrl } from '~/helpers/format'
import { handlePluralisation } from '~/helpers/general'

/**
 * Expose install method.
 */
export default {
  install: (app) => {

    /**
     * Get block class (if passed as prop).
     * @param {String} blockClass - Block class to add to element.
     * @param {String} element - Element class to add to element.
     * @param {String} modifier - Modifier class to add to element.
     * @returns {String}
     */
    app.config.globalProperties.$blockClass = (blockClass, element, modifier) => {
      if (!blockClass) {
        return ''
      }

      let elementClass = blockClass

      if (element) {
        elementClass += `__${element}`
      }

      if (modifier) {
        elementClass += `--${modifier}`
      }

      return elementClass
    }

    /**
     * Finds class/state in `config/classes.js`.
     * @param {String} state - Class/state to find.
     * @returns {String}
     */
    app.config.globalProperties.$class = (state) => {
      if (!classes[state]) {
        throw new Error(`No '${state}' found in 'config/classes.js'`)
      }

      return classes[state]
    }

    /**
     * Format image URL.
     * - See scripts/helpers/format.js for arguments.
     * @returns {String}
     */
    app.config.globalProperties.$formatImageUrl = (src, options) => {
      return formatImageUrl(src, options)
    }

    /**
     * Formats money into store format.
     * @param {Number} value - Value in cents.
     * @param {Object} options - Money format options.
     * @param {String} options.format - Shopify money format.
     * @param {Boolean} options.removeZeros - Whether to remove zeros from
     * price.
     * @returns {String}
     */
    app.config.globalProperties.$formatMoney = (
      value,
      options = {},
    ) => {
      const defaults = {
        format: cnvs.store.moneyFormat,
        removeZeros: true,
      }

      const { format, removeZeros } = {
        ...defaults,
        ...options,
      }

      return formatMoney(value, format, removeZeros)
    }

    /**
     * Retrieve langauge string from theme strings.
     * @param {String} path - Path to string defined in `theme-strings.liquid`,
     * for example `accessibility.close`.
     * @param {Object} [options] - Options object.
     * @param {Boolean} [options.decode] - Use decodeURIComponent() on
     * replacement strings, only applies when `replace` is used.
     * @param {Number} [options.pluralise] - Number used to determine whether
     * the single or plural string is used in the provided path.
     * @param {Object} [options.replace] - Key: value pairs of text to replace
     * in the string, e.g. { label: 'New' } would replace `{{ label }}` in the
     * string.
     * @returns {String}
     */
    app.config.globalProperties.$string = (path, {
      decode = true,
      pluralise,
      replace = {},
    } = {}) => {
      let compiledString = cnvs.compiledStrings || {}
      let customString = cnvs.strings || {}
      let missingString = false

      /**
       * Go through cnvs.compiledStrings and cnvs.strings.
       */
      for (const part of path.split('.')) {
        if (!customString[part] && !compiledString[part]) {
          missingString = true
          break
        }

        compiledString = compiledString[part] ? compiledString[part] : false
        customString = customString[part] ? customString[part] : false
      }

      /**
       * Define string, cnvs.strings should override cnvs.compiledStrings.
       */
      let string = false

      if (
        typeof compiledString === 'string' ||
        typeof compiledString === 'object'
      ) {
        string = compiledString
      }

      if (
        typeof customString === 'string' ||
        typeof customString === 'object'
      ) {
        string = customString
      }

      /**
       * Throw error if no string found
       */
      if (missingString || !string) {
        window.console.log(`No string found at 'cnvs.compiledStrings.${path}' or 'cnvs.strings.${path}'`)
        return 'No string found'
      }

      /**
       * If pluralise then update string to use single or plural items.
       * - Assumes provided path is object in format { single: '', plural: '' }
       */
      const correctStringType =
        typeof string === 'object' || string.includes('=&gt;')

      if (typeof pluralise !== 'number' && correctStringType) {
        window.console.log(`Object found at 'cnvs.compiledStrings.${path}' or 'cnvs.strings.${path}'`)
        return '[ Object ]'
      }

      if (typeof pluralise === 'number' && correctStringType) {
        if (typeof string !== 'object') {
          string = string
            .replace(/[=]&gt;/g, ':')
            .replace(/&quot;/g, '"')

          string = JSON.parse(string)
        }

        string = handlePluralisation(string, pluralise)
      }

      /**
       * Go through each each replacement and replace string with value.
       */
      if (Object.keys(replace).length) {
        Object.keys(replace).forEach((key) => {
          const regex = new RegExp(`{{ ${key} }}`, 'g')

          const replaceKey = decode
            ? decodeURIComponent(replace[key])
            : replace[key]

          string = string.replace(regex, replaceKey)
        })
      }

      /**
       * Replace escaped characters.
       */
      string = string
        .replace(/&#39;/g, '\'')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/[=]&gt;/g, ':')

      return string
    }

    /**
     * Retrieve timing from timings file.
     * @param {String} timing - Timing to retrieve.
     * @param {Object} [options] - Options object.
     * @param {Number} [options.index] - Forloop index to multiply timing by.
     * @param {Boolean} [options.printUnit] - Print unit at end of time, passing
     * a number to index automatically prints the unit.
     * @param {String} [options.unit] - Unit to return timing in, `ms` or `s`.
     * @returns {Number|String}
     */
    app.config.globalProperties.$timing = (timing, { index, printUnit, unit = 'ms' } = {}) => {
      let time = timings[timing]

      if (!time) {
        return 0
      }

      if (unit === 's') {
        time /= 1000
      }

      if (typeof index === 'number') {
        time *= index
      }

      if (
        printUnit ||
        (typeof index === 'number' && typeof printUnit === 'undefined')
      ) {
        time = `${time}${unit}`
      }

      return time
    }

    /**
     * Retrieve variable from theme strings.
     * @param {String} path - Path to variable stored in
     * `theme-variables.liquid`, excluding cnvs, for example `routes.cart.add`.
     * @returns {*}
     */
    app.config.globalProperties.$variable = (path) => {
      let variable = cnvs

      path.split('.').forEach((part) => {
        variable = variable[part]
      })

      return variable
    }
  },
}
