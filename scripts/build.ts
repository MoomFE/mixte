import { resolve } from 'node:path';
import { build } from 'vite';
import { rollup } from 'rollup';
import fs from 'fs-extra';
import dts from 'rollup-plugin-dts';
import { alias } from '../meta/alias';
import { packages } from '../meta/packages';
import { asyncForEach } from '../packages/mixte/index';

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue-demi',
  '@vueuse/core',
];

(async () => await asyncForEach(packages, async (info) => {
  // mjs, cjs
  await build({
    resolve: {
      alias,
    },
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

  // dts
  const bundle = await rollup({
    input: info.input,
    external: externals.concat(info.dtsExternal ?? []),
    plugins: [
      dts({ respectExternal: true }),
    ],
  });

  await bundle.write({
    file: `${info.outputDir}/${info.outputFileName ?? 'index'}.d.ts`,
    format: 'es',
  });
}))();
