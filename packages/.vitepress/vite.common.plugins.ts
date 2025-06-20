import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ArcoResolver, ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { MixteUseAutoImport } from '../use/src/register';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  Icons({
    scale: 1,
    compiler: 'vue3',
  }),
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
  Components({
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    dts: resolve(__dirname, '../components.d.ts'),
    dirs: [
      resolve(__dirname, './components'),
    ],
    resolvers: [
      IconsResolver({ prefix: 'i' }),
      ElementPlusResolver({ importStyle: 'sass' }),
      NaiveUiResolver(),
      ArcoResolver({ importStyle: false }),
    ],
  }),
];
