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
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-jest',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ],
  rules: {
    'arrow-body-style': 'off',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
