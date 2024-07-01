/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/react-refresh'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
