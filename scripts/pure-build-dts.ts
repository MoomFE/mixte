import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { dirname, resolve } from 'pathe';
import { rollup } from 'rollup';
import fg from 'fast-glob';
import fs from 'fs-extra';
import dts from 'rollup-plugin-dts';
import { delay } from 'mixte';
import type { LastArrayElement } from 'type-fest';
import type { packages } from '../meta/packages';
import { transformVscInput } from './plugins/transform-vsc-input';

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue',
  'vue/jsx-runtime',
  'vue-demi',
  '@vueuse/core',
];

export async function pureBuildDts(pkg: LastArrayElement<typeof packages>[]) {
  const vueFiles: string[] = [];

  for (const info of pkg) {
    console.log(`Building ${info.input}...`);

    if (info.vueComponent) {
      const currentVueFiles = (await fg(['src/*.vue'], {
        absolute: true,
        ignore: ['**/demo/**'],
        cwd: resolve(__dirname, '../', dirname(info.input)),
      }));

      // 打包前先删除旧的为 vue 生成的 .d.ts 文件
      for (const vueFile of currentVueFiles)
        await fs.remove(`${vueFile}.d.ts`);

      for (const vueFile of currentVueFiles) {
        await exec(`vue-tsc --declaration --emitDeclarationOnly ${vueFile}`);

        while (!fs.existsSync(`${vueFile}.d.ts`))
          await delay(1000);
      }

      vueFiles.push(...currentVueFiles);
    }

    const bundle = await rollup({
      input: info.input,
      external: info.vueSfcComponent
        ? () => true
        : externals.concat(info.dtsExternal ?? []),
      plugins: [
        dts({ respectExternal: true }),
        info.vueSfcComponent && transformVscInput(info),
      ],
    });

    await bundle.write({
      file: `${info.outputDir}/${info.outputFileName ?? 'index'}.d.ts`,
      format: 'es',
    });

    console.log(`Built ${info.input}.`);
  }

  // 打包后删除为 vue 生成的 .d.ts 文件
  for (const vueFile of vueFiles)
    await fs.remove(`${vueFile}.d.ts`);
}
