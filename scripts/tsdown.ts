import process from 'node:process';
import React from '@vitejs/plugin-react';
import VueJsx from '@vitejs/plugin-vue-jsx';
import fs from 'fs-extra';
import { resolve } from 'pathe';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import Vue from 'unplugin-vue/rolldown';

interface CopyAsset {
  from: string;
  to: string;
}

interface CreateTsdownConfigOptions {
  entry: Record<string, string>;
  vue?: boolean;
  external?: Array<string | RegExp>;
  copy?: CopyAsset[];
  clean?: boolean;
}

const mixteExternal = /^@?mixte(\/|$)/;
const reactInVueExclude = /[/\\]components-react[\\/$]+/;
const copiedAssetsRoots = new Set<string>();

function createVuePlugins() {
  return [
    Vue({
      isProduction: true,
      template: {
        compilerOptions: { comments: false },
      },
    }),
    {
      ...VueJsx({
        exclude: [reactInVueExclude],
      }),
      enforce: 'pre' as const,
    },
    React({
      jsxImportSource: 'react',
    }),
    Icons({
      scale: 1,
      compiler: 'vue3',
    }),
    Components({
      dts: false,
      dirs: [],
      resolvers: [IconsResolver({ prefix: 'i' })],
    }),
  ];
}

export function createTsdownConfig(options: CreateTsdownConfigOptions) {
  return {
    entry: options.entry,
    tsconfig: './tsconfig.build.json',
    platform: 'neutral' as const,
    format: ['esm', 'cjs'],
    clean: options.clean ?? true,
    dts: options.vue
      ? {
          bundle: true,
          vue: true,
        }
      : {
          bundle: true,
        },
    minify: false,
    sourcemap: false,
    external: [mixteExternal, ...(options.external ?? [])],
    outExtensions({ format }: { format: string }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.mjs',
        dts: '.d.ts',
      };
    },
    plugins: options.vue ? createVuePlugins() : undefined,
    hooks: options.copy?.length
      ? {
          'build:done': async () => {
            const rootDir = process.cwd();

            if (copiedAssetsRoots.has(rootDir)) {
              return;
            }

            copiedAssetsRoots.add(rootDir);

            for (const { from, to } of options.copy ?? []) {
              const outputPath = resolve(rootDir, 'dist', to);

              await fs.remove(outputPath);
              await fs.copy(resolve(rootDir, from), outputPath);
            }
          },
        }
      : undefined,
  };
}
