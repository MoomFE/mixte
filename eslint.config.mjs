import moomfe from '@moomfe/eslint-config';

export default moomfe(
  {},
  {
    name: 'mixte/ts/rules',
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    name: 'mixte/demo/rules',
    files: ['**/demo/**/*'],
    rules: {
      'no-console': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'vue/no-template-shadow': 'off',
    },
  },
);
