import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import { build } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import fs from 'fs-extra';
import { alias } from '../meta/alias';
import { packages } from '../meta/packages';

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue',
  'vue-demi',
  '@vueuse/core',
];

(async () => {
  for (const info of packages) {
    await build({
      resolve: {
        alias,
      },
      plugins: [
        info.vueComponent && [Vue(), VueJsx()],
      ],
      build: {
        outDir: info.outputDir,
        lib: {
          entry: info.input,
          formats: ['es', 'cjs'],
          fileName: format => `${info.outputFileName ?? 'index'}.${format === 'es' ? 'mjs' : format}`,
        },
        minify: false,
        emptyOutDir: false,
        rollupOptions: {
          external: externals.concat(info.external ?? []),
        },
      },
    });
  }
})();
