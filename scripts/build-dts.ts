import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import fs from 'fs-extra';
import dts from 'rollup-plugin-dts';
import { packages } from '../meta/packages';

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue-demi',
  '@vueuse/core',
];

(async () => {
  for (const info of packages) {
    console.log(`Building ${info.input}...`);

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
  }
})();
