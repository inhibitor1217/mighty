module.exports = {
  extends: ['airbnb-typescript', 'prettier'],
  env: {
    browser: true,
  },
  ignorePatterns: [
    'coverage/',
    'node_modules/',
    '.serverless/',
    '.webpack/',
    '_warmup/',
    '.vscode/',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin-import'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
