import { resolve } from 'node:path';
import type { OutputOptions, RollupOptions } from 'rollup';
import fs from 'fs-extra';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import { packages } from '../meta/packages';

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const configs: RollupOptions[] = [];

const pluginEsbuild = esbuild();
const pluginAlias = alias({
  entries: {
    'mixte': 'packages/mixte/index.ts',
    '@mixte/use': 'packages/use/index.ts',
  },
});
const pluginDts = dts({
  respectExternal: true,
});

const externals = [
  'vue-demi',
  '@vueuse/core',
];

for (const { input, outputFile, external, dtsExternal } of packages) {
  const output: OutputOptions[] = [];

  // es
  output.push({
    file: `${outputFile}.mjs`,
    format: 'es',
  });

  // cjs
  output.push({
    file: `${outputFile}.cjs`,
    format: 'cjs',
  });

  configs.push({
    input,
    output,
    plugins: [pluginEsbuild, pluginAlias],
    external: externals.concat(external || []),
  });

  // dts
  configs.push({
    input,
    output: {
      file: `${outputFile}.d.ts`,
      format: 'es',
    },
    plugins: [pluginDts],
    external: externals.concat(dtsExternal || []),
  });
}

export default configs;
