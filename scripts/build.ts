import { resolve } from 'node:path';
import { dirname } from '@moomfe/small-utils/node-utils';
import { build } from 'vite';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';

/** 项目根目录 */
const rootPath = resolve(dirname(import.meta), '../');
/** 代码根目录 */
const srcPath = resolve(rootPath, 'packages');

// Core
await build({
  build: {
    outDir: resolve(srcPath, 'core/dist'),
    lib: {
      entry: resolve(srcPath, 'core/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : format}`,
    },
    minify: false,
  },
});
await rollup({
  input: resolve(srcPath, 'core/index.ts'),
  plugins: [
    dts({ respectExternal: true }),
  ],
}).then((bundle) => {
  bundle.write({
    file: resolve(srcPath, 'core/dist/index.d.ts'),
    format: 'es',
  });
});

// Use
await build({
  build: {
    outDir: resolve(srcPath, 'use/dist'),
    lib: {
      entry: resolve(srcPath, 'use/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : format}`,
    },
    minify: false,
    rollupOptions: {
      external: ['vue-demi', '@vueuse/core'],
    },
  },
});
await rollup({
  input: resolve(srcPath, 'use/index.ts'),
  plugins: [
    dts({ respectExternal: true }),
  ],
  external: ['vue-demi', '@vueuse/core'],
}).then((bundle) => {
  bundle.write({
    file: resolve(srcPath, 'use/dist/index.d.ts'),
    format: 'es',
  });
});
