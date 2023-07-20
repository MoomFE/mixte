import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import type { OutputOptions, RollupOptions } from 'rollup';
import { packages } from '../meta/packages';

const configs: RollupOptions[] = [];

const pluginEsbuild = esbuild();
const pluginAlias = alias({
  entries: {
    mixte: 'packages/mixte/index.ts',
  },
});
const pluginDts = dts({
  respectExternal: true,
});

const externals = [
  'vue-demi',
  '@vueuse/core',
];

for (const { name, external, dtsExternal } of packages) {
  const dir = name.split('/')[0];
  const file = name.split('/').slice(1).join('/') || 'index';
  const input = `packages/${dir}/${file}.ts`;
  const output: OutputOptions[] = [];

  // es
  output.push({
    file: `packages/${dir}/dist/${file}.mjs`,
    format: 'es',
  });

  // cjs
  output.push({
    file: `packages/${dir}/dist/${file}.cjs`,
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
      file: `packages/${dir}/dist/${file}.d.ts`,
      format: 'es',
    },
    plugins: [pluginDts],
    external: externals.concat(dtsExternal || []),
  });
}

export default configs;
