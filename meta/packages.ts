export const packages = [
  // mixte
  {
    input: 'packages/mixte/index.ts',
    outputDir: 'packages/mixte/dist',
  },
  // @mixte/use/register
  {
    input: 'packages/use/src/register.ts',
    outputDir: 'packages/use/dist',
    outputFileName: 'register',
    dtsExternal: ['unplugin-auto-import/types'],
  },
  // @mixte/use
  {
    input: 'packages/use/index.ts',
    outputDir: 'packages/use/dist',
    external: ['mixte'],
  },
  // @mixte/components
  {
    input: 'packages/components/index.ts',
    outputDir: 'packages/components/dist',
    external: ['mixte'],
  },
];
