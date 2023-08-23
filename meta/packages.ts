export const packages = [
  { name: 'mixte' },
  {
    name: 'use',
    external: ['mixte'],
  },
  {
    name: 'use/register',
    dtsExternal: ['unplugin-auto-import/types'],
  },
];
