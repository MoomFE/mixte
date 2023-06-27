import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import type { OutputOptions, RollupOptions } from 'rollup';
import { packages } from '../meta/packages';

const configs: RollupOptions[] = [];

const pluginEsbuild = esbuild();
const pluginDts = dts({
  respectExternal: true,
});

const externals = [
  'vue-demi',
];

for (const { name } of packages) {
  const input = `packages/${name}/index.ts`;
  const output: OutputOptions[] = [];

  // es
  output.push({
    file: `packages/${name}/dist/index.mjs`,
    format: 'es',
  });

  // cjs
  output.push({
    file: `packages/${name}/dist/index.cjs`,
    format: 'cjs',
  });

  configs.push({
    input,
    output,
    plugins: [pluginEsbuild],
    external: externals,
  });

  // dts
  configs.push({
    input,
    output: {
      file: `packages/${name}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [pluginDts],
    external: externals,
  });
}

export default configs;
