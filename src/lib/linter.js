'use strict'

const { ESLint } = require('eslint')

module.exports.minimumStyleRules = {
  '@typescript-eslint/indent': ['error', 2],
  '@typescript-eslint/semi': ['error', 'never'],
  '@typescript-eslint/keyword-spacing': 'error',
  '@typescript-eslint/comma-spacing': 'error',
  'keyword-spacing': 'off',
  'semi': 'off',
  'indent': 'off',
  'space-before-function-paren': 'off',
  'comma-spacing': 'off'
}

/**
 * @param {string} code
 * @param {import('eslint').ESLint.Options} options
 */
module.exports.lintCode = (code, options = {}) => {
  const linter = new ESLint({
    baseConfig: {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      env: {
        node: true,
        es6: true
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    useEslintrc: false,
    ...options
  })

  return linter.lintText(code)
}
