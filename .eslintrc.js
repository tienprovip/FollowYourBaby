module.exports = {
  extends: ['expo', 'prettier'],
  plugins: [],
  rules: {
    // Disallow `any` — use `unknown` or specific types per project convention
    '@typescript-eslint/no-explicit-any': 'error',
    // Enforce consistent imports
    'import/no-duplicates': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'web-build/'],
};
