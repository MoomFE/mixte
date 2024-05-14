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
  // @mixte/components/auto-grid
  {
    input: 'packages/components/src/auto-grid/index.ts',
    outputDir: 'packages/components/dist',
    outputFileName: 'auto-grid',
    external: ['mixte'],
  },

  // @mixte/validator
  {
    input: 'packages/validator/index.ts',
    outputDir: 'packages/validator/dist',
  },

  // @mixte/snippets/getFastestCDN
  {
    input: 'packages/snippets/src/getFastestCDN/index.ts',
    outputDir: 'packages/snippets/dist',
    outputFileName: 'getFastestCDN',
  },
  // @mixte/snippets/useNaiveForm
  {
    input: 'packages/snippets/src/useNaiveForm/index.ts',
    outputDir: 'packages/snippets/dist',
    outputFileName: 'useNaiveForm',
    external: ['mixte'],
    dtsExternal: ['naive-ui'],
  },
  // @mixte/snippets/acro-dynamic-form
  {
    input: 'packages/snippets/src/acro-dynamic-form/index.ts',
    outputDir: 'packages/snippets/dist',
    outputFileName: 'acro-dynamic-form',
    external: ['@arco-design/web-vue'],
  },
];
