import { resolve } from 'node:path';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { MixteUseAutoImport } from '../use/src/register';

export default [
  AutoImport({
    dts: resolve(__dirname, '../auto-imports.d.ts'),
    vueTemplate: true,
    imports: [
      'vue',
      '@vueuse/core',
      MixteUseAutoImport({ useWithVueUseCore: true }),
    ],
    resolvers: [
      ElementPlusResolver(),
    ],
    eslintrc: {
      enabled: true,
      filepath: resolve(__dirname, '../.eslintrc-auto-import.json'),
    },
  }),
];
