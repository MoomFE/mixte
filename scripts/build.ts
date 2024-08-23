import { fileURLToPath } from 'node:url';
import process from 'node:process';
import type { UserConfig } from 'vite';
import { dirname, resolve } from 'pathe';
import { build, normalizePath } from 'vite';
import { createGenerator } from '@unocss/core';
import { loadConfig } from '@unocss/config';
import { defu } from 'defu';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { alias } from '../meta/alias';
import { packages } from '../meta/packages';
import { transformVscInput } from './plugins/transform-vsc-input';

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.removeSync(resolve(__dirname, '../packages/auto-imports.d.ts'));
fs.removeSync(resolve(__dirname, '../packages/.eslintrc-auto-import.json'));

const externals = [
  'vue',
  'vue-demi',
  '@vueuse/core',
];

(async () => {
  let generator: ReturnType<typeof createGenerator> | undefined;

  for (const info of packages) {
    const input = resolve(__dirname, `../${info.input}`);
    const outputDir = resolve(__dirname, `../${info.outputDir}`);

    const buildOptions: UserConfig['build'] = {
      outDir: outputDir,
      lib: {
        entry: input,
        formats: ['es', 'cjs'],
        fileName: format => `${info.outputFileName ?? 'index'}.${format === 'es' ? 'mjs' : format}`,
      },
      minify: false,
      emptyOutDir: false,
      rollupOptions: {
        external: externals.concat(info.external ?? []),
      },
    };

    if (!info.vueSfcComponent) {
      await build({
        resolve: { alias },
        plugins: [
          info.vueComponent && [Vue(), VueJsx()],
        ],
        build: buildOptions,
      });
      continue;
    }

    // Vue Sfc Component
    {
      // 编译入口文件, 重定向 src 目录下的文件到 outputSrcDir
      await build({
        resolve: { alias },
        plugins: [
          transformVscInput(info),
        ],
        build: defu(
          <UserConfig['build']>{
            rollupOptions: {
              external: id => normalizePath(id) !== input,
            },
          },
          buildOptions,
        ),
      });

      const inputSrcDir = resolve(dirname(input), 'src');
      const outputSrcDir = resolve(outputDir, info.outputFileName);

      // 把整个 src 目录复制到 outputSrcDir
      await fs.emptyDir(outputSrcDir);
      await fs.copy(inputSrcDir, outputSrcDir);

      // 将 .vue 文件中用到的样式类注入到 <style scoped> 中

      const vueFiles = await fg(['*.vue'], {
        absolute: true,
        cwd: outputSrcDir,
      });

      if (vueFiles.length && !generator) {
        const config = await loadConfig(process.cwd(), resolve(__dirname, '../packages/unocss.config.ts'));
        generator = createGenerator(config.config);
      }

      for (const vueFile of vueFiles) {
        const code = await fs.readFile(vueFile, 'utf-8');

        if (code.includes('@unocss-ignore')) {
          continue;
        }

        const { css } = await generator!.generate(code, {
          preflights: false,
        });

        await fs.writeFile(vueFile, `${code}\n<style scoped>\n${css}\n</style>`);
      }
    }
  }
})();
