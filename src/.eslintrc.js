module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: false,
  },
  extends: [
    '../.eslintrc.js',
    'react-app',
  ],
  globals: {
    css: false,
    process: false,
  },
  rules: {
    'no-console': 'warn',
    'no-lone-blocks': 'off',
    'no-restricted-imports': [ 'error', { patterns:['@mui/*/*/*', '!@mui/material/test-utils/*'] } ],
  },
};
