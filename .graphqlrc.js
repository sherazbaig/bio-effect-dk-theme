module.exports = {
  documents: 'src/graphql/**/*.gql',
  schema: {
    'https://bioeffect-eu.myshopify.com/api/2023-04/graphql.json': {
      headers: {
        'X-Shopify-Storefront-Access-Token': '421f1339007cf0cf4de27add35001700',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  },
  skipGraphQLImport: true,
}
