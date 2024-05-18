import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { rollup } from 'rollup';
import fg from 'fast-glob';
import fs from 'fs-extra';
import dts from 'rollup-plugin-dts';
import { packages } from '../meta/packages';

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue',
  'vue/jsx-runtime',
  'vue-demi',
  '@vueuse/core',
];

(async () => {
  for (const info of packages) {
    console.log(`Building ${info.input}...`);

    if (info.vueComponent) {
      const vueFiles = (await fg(['**/*.vue'], {
        absolute: true,
        ignore: ['**/demo/**'],
        cwd: resolve(__dirname, '../', dirname(info.input)),
      }));

      for (const vueFile of vueFiles)
        await exec(`vue-tsc --declaration --emitDeclarationOnly ${vueFile}`);
    }

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
