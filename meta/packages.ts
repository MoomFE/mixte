export const packages = [
  // mixte
  {
    input: 'packages/mixte/index.ts',
    outputFile: 'packages/mixte/dist/index',
  },
  // @mixte/use/register
  {
    input: 'packages/use/src/register.ts',
    outputFile: 'packages/use/dist/register',
    dtsExternal: ['unplugin-auto-import/types'],
  },
  // @mixte/use
  {
    input: 'packages/use/index.ts',
    outputFile: 'packages/use/dist/index',
    external: ['mixte'],
  },
];
