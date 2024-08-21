import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import AutoImport from 'unplugin-auto-import/vite';
import { ArcoResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { MixteUseAutoImport } from '../use/src/register';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      ArcoResolver(),
    ],
    eslintrc: {
      enabled: true,
      filepath: resolve(__dirname, '../.eslintrc-auto-import.json'),
    },
  }),
];
