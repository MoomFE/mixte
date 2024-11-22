import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/index.ts',
  },
  {
    entry: './src/register.ts',
    dtsExternal: ['unplugin-auto-import/types'],
  },
  {
    entry: './src/nuxt.ts',
    external: ['@nuxt/kit'],
    dtsExternal: ['@nuxt/kit', '@nuxt/schema'],
  },
]);
