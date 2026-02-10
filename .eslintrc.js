module.exports = {
  extends: [
    '@we-make-websites/eslint-config',
    'plugin:storybook/recommended',
  ],
  globals: {
    Bugsnag: true,
    cnvs: true,
    QRCode: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './node_modules/@we-make-websites/basis/basis/config.js',
      },
    },
  },
}
