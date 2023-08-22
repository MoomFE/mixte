export const packages = [
  { name: 'mixte' },
  {
    name: 'use',
    external: ['mixte'],
  },
  {
    name: 'use/resolvers',
    dtsExternal: ['unplugin-auto-import/types'],
  },
];
