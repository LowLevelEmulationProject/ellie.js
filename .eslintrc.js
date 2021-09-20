module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'windows'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    'no-throw-literal': 'error',
    'no-unused-vars': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
