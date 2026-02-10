/**
 * Helper: Convert
 * -----------------------------------------------------------------------------
 * Convert strings into different cases.
 * - Add in alphabetical order.
 *
 */

/**
 * Convert handle string to sentence case.
 * @param {String} string - String to convert.
 * @returns {String}
 */
export function convertHandleToSentenceCase(string) {
  if (!string) {
    return ''
  }

  return string
    .replace(/-/g, ' ')
    .toLowerCase()
    .trim()
}

/**
 * Convert a string into camelCase.
 * @param {String} string - String to convert.
 * @returns {String}
 */
export function convertToCamelCase(string) {
  if (!string) {
    return ''
  }

  return string
    .replace(
      /.\b(?<word>\w)/g,
      (_, $1) => {
        return $1.toUpperCase()
      },
    )
    .replace(/[\s:'"]/g, '')
    .replace(
      /^(?<rest>.)/u,
      (_, $1) => {
        return $1.toLowerCase()
      },
    )
}

/**
 * Convert a string into handle (kebab-case).
 * @param {String} string - String to convert.
 * @returns {String}
 */
export function convertToHandle(string) {
  if (!string) {
    return ''
  }

  const matches = string.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+|[\u4e00-\u9fa5]+/g)

  // Early return if no matches are found
  if (!matches || !matches.length) {
    return string
  }

  return matches
    .map((part) => part.toLowerCase())
    .join('-')
}

/**
 * Convert a string to PascalCase.
 * @param {String} string - String to convert.
 * @return {String}
 */
export function convertToPascalCase(string) {
  if (!string) {
    return ''
  }

  return string
    .trim()
    .replace(
      /(?<firstLetter>\w)(?<rest>\w*)/g,
      (_, $1, $2) => {
        return $1.toUpperCase() + $2.toLowerCase()
      },
    )
    .replace(/-/g, '')
    .replace(/\s/g, '')
}
