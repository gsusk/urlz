module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    prettier: 0,
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  },
};
