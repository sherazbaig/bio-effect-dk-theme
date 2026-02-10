/**
 * Core: Query
 * -----------------------------------------------------------------------------
 * GraphQL query tool, acts as a replacement for Apollo.
 * - Do not query admin API from JS as you will need to publicly store the API
 *   access token and password which is a security risk.
 *
 */

/**
 * Query storefront API.
 * @param {Object} data - Parameters.
 * @param {Object} data.query - GraphQL query.
 * @param {Object} data.variables - GraphQL variables.
 * @returns {Promise}
 */
export default ({ query: graphqlQuery, variables }) => {
  return new Promise(async(resolve, reject) => {
    try {
      const { store, token, version } = cnvs.credentials.storefront
      const url = `https://${store}.myshopify.com/api/${version}/graphql.json`

      /**
       * Set headers.
       */
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      }

      /**
       * Add language header and format Storefront API language code.
       */
      if (variables?.language) {
        const languageCode = getLanguageCode(variables.language)
        headers['Accept-Language'] = languageCode.header
        variables.language = languageCode.variable
      }

      /**
       * Fetch response.
       */
      let response = await fetch(url, {
        body: JSON.stringify({
          query: buildQuery(graphqlQuery),
          variables,
        }),
        headers,
        method: 'POST',
      })

      if (!response.ok) {
        reject(response.description)
        return
      }

      response = await response.json()
      resolve(response.data)

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get language code from language variable.
 * - Storefront API does not support kebab-case language code so this is
 *   converted into SCREAMING_SNAKE_CASE.
 * - E.g. ZH-CN doesn't work, but ZH_CH does.
 * - Does not convert `Accept-Language` header as this expects kebab-case.
 * @param {String} languageVariable - Language variable.
 * @returns {Object}
 */
function getLanguageCode(languageVariable) {
  const sanitisedLanguageVariable = languageVariable.toLowerCase()
  let languageCode = languageVariable

  /**
   * Handle localhost sometimes returning multi-part language code which isn't
   * supported in expected LanguageCode enums.
   * - https://shopify.dev/docs/api/storefront/2023-10/enums/LanguageCode
   * - E.g. Localhost returns ar-AE which isn't a valid language code.
   */
  if (!['pt-br', 'pt-pt', 'zh-cn', 'zh-tw'].includes(sanitisedLanguageVariable)) {
    languageCode = languageCode.split('-')[0]
  }

  return {
    header: languageCode,
    variable: languageCode.toUpperCase().replaceAll('-', '_'),
  }
}

/**
 * Build GraphQL query string from AST format data.
 * @param {Object} query - AST format GraphQL query.
 * @returns {String}
 */
function buildQuery(astData) {

  /**
   * Uses body source as starting point.
   * - Remove import tags.
   */
  let query = astData.loc.source.body
    .replace(/#import.*\n/g, '')
    .trim()

  const fragments = {}

  /**
   * Go through each fragment definition and build query string.
   */
  astData.definitions.forEach((definition) => {
    if (definition.kind !== 'FragmentDefinition') {
      return
    }

    const fields = buildFields(definition.selectionSet.selections)
    fragments[definition.name.value] = fields.join('\n')
  })

  /**
   * Replace fragment object with query.
   */
  Object.entries(fragments).forEach(([key, value]) => {
    let formattedValue = value

    /**
     * Resolves nested fragments.
     */
    Object.entries(fragments).forEach(([fragmentKey, fragmentValue]) => {
      formattedValue = formattedValue.replaceAll(`...${fragmentKey}`, fragmentValue)
    })

    query = query.replaceAll(`...${key}`, formattedValue)
  })

  return query
}

/**
 * Build fields from selection sets.
 * - Supports arguments and nested fields.
 * @param {Array} selections - Selections array of objects.
 * @returns {String}
 */
function buildFields(selections) {
  return selections.map((selection) => {
    let field = selection.alias
      ? `${selection.alias?.value}: ${selection.name?.value}`
      : selection.name?.value

    /**
     * Inline fragments.
     */
    if (selection.kind === 'InlineFragment') {
      field = `... on ${selection.typeCondition.name.value}`
    }

    /**
     * Preserves fragment syntax.
     */
    if (selection.kind === 'FragmentSpread') {
      field = `...${selection.name.value}`
    }

    /**
     * If field has argument append to variable.
     */
    if (selection.arguments?.length) {
      const args = selection.arguments.map((argument) => {
        let value = argument.value.value

        switch (argument.value.kind) {
          case 'ListValue':
            value = buildListArgumentValue(argument)
            break

          case 'StringValue':
            value = `"${argument.value.value}"`
            break

          case 'Variable':
            value = `$${argument.value.name.value}`
            break
        }

        return `${argument.name.value}: ${value}`
      })

      field += `(${args.join(', ')})`
    }

    /**
     * If field has nested fields then append to variable.
     */
    if (selection.selectionSet) {
      const fields = buildFields(selection.selectionSet.selections)
      field += ` {\n${fields.join('\n')}\n}`
    }

    return field
  })
}

/**
 * Builds value of argument when it's a list value (array of objects).
 * @param {Object} argument - AST format argument object.
 * @returns {String}
 */
function buildListArgumentValue(argument) {
  const values = argument.value.values.map((value) => {
    const fields = value.fields.map((field) => {
      return `${field.name.value}: "${field.value.value}"`
    })

    return `{${fields.join(', ')}}`
  })

  return `[${values.join(', ')}]`
}
