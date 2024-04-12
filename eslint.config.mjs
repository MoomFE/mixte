import moomfe from '@moomfe/eslint-config';

export default moomfe(
  {},
  {
    name: 'mixte/ts/rules',
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
);
