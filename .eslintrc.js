module.exports = {
  settings: {
    parser: '@typescript-eslint/parser',
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    },
  },
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'react-hooks',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Typescript
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    '@typescript-eslint/no-empty-function': ['warn'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 0,
    'react/no-multi-comp': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'semi': ['warn', 'never', { 'beforeStatementContinuationChars': 'always' }],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'prefer-destructuring': ['warn', { object: true, array: false }],
    'no-underscore-dangle': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-constant-condition': ['error', { checkLoops: false }],
  },
}
