import { createTsdownConfig } from '../../scripts/tsdown';

export default createTsdownConfig({
  entry: {
    index: './src/index.ts',
    register: './src/register.ts',
    nuxt: './src/nuxt.ts',
  },
  external: ['unplugin-auto-import/types', '@nuxt/kit', '@nuxt/schema'],
});
