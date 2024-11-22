import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';
import fs from 'fs-extra';
import { basename, extname, resolve } from 'pathe';
import { rollup } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import { build, normalizePath } from 'vite';

const api = {
  async build(lib) {
    const rootDir = normalizePath(process.cwd());
    const outDir = resolve(rootDir, 'dist');

    const tsconfigPath = resolve(rootDir, 'tsconfig.json');
    const tsconfig = await fs.readJson(tsconfigPath, 'utf-8');

    const packages = await fs.readJson(resolve(rootDir, 'package.json'), 'utf-8');

    const alias = Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths ?? {}).map(([key, paths]) => {
        return [
          key,
          resolve(rootDir, paths[0]),
        ];
      }),
    );

    const external = Object.keys(packages.dependencies ?? {});

    const entry = resolve(rootDir, lib.entry);
    const outputFileName = lib.outputFileName ?? basename(entry, extname(entry));

    // 打包 .mjs, .cjs 文件
    await build({
      resolve: {
        alias,
      },
      plugins: [
        lib.vueComponent && [Vue(), VueJsx()],
      ],
      build: {
        outDir,
        lib: {
          entry,
          formats: ['es', 'cjs'],
          fileName: format => `${outputFileName}.${format === 'es' ? 'mjs' : format}`,
        },
        rollupOptions: {
          external: [
            ...external,
            ...lib.external ?? [],
          ],
        },
        minify: false,
        emptyOutDir: false,
      },
      logLevel: 'warn',
    });

    const dtsInput = lib.vueComponent
      ? await fs.exists(`${outDir}/${outputFileName}/index.d.ts`)
        ? `${outDir}/${outputFileName}/index.d.ts`
        : `${outDir}/${outputFileName}.d.ts`
      : entry;

    // 打包 vue 组件的 .d.ts 文件
    const bundle = await rollup({
      input: dtsInput,
      plugins: [
        dts({
          tsconfig: tsconfigPath,
          respectExternal: true,
        }),
      ],
      external: [
        ...external,
        ...lib.dtsExternal ?? [],
      ],
      logLevel: 'silent',
    });

    await bundle.write({
      file: `${outDir}/${outputFileName}.d.ts`,
      format: 'es',
    });
  },
};

Comlink.expose(api, nodeEndpoint(parentPort));
