import type { ExternalOption } from 'rollup';
import { exec } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import chalk from 'chalk';
import Comlink from 'comlink'; // @ts-expect-error
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';
import fs from 'fs-extra';
import ora from 'ora';
import { dirname, resolve } from 'pathe';
import { normalizePath } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const worker = new Worker(resolve(__dirname, './build-worker.mjs'));
const api = Comlink.wrap<{ build: (lib: LibConfig) => Promise<void> }>(nodeEndpoint(worker));

const spinner = ora();

interface LibConfig {
  /**
   * 打包入口文件
   */
  entry?: string;
  /**
   * 输出文件名
   * @default 打包入口文件名
   */
  outputFileName?: string;
  /**
   * 需要排除的依赖
   */
  external?: ExternalOption;
  /**
   * 打包 dts 时需要排除的依赖
   */
  dtsExternal?: ExternalOption;
  /**
   * 是否是 vue 组件
   */
  vueComponent?: boolean;
  /**
   * vue 组件的 dts 打包入口文件路径
   */
  vueDtsInput?: string;
  /**
   * 拷贝文件
   */
  copy?: { from: string; to: string }[];
}

export async function defineBuild(libs: LibConfig[]) {
  const rootDir = normalizePath(process.cwd());
  const outDir = resolve(rootDir, 'dist');

  await fs.emptyDir(outDir);

  const hasVueComponent = libs.some(lib => lib.vueComponent);

  if (hasVueComponent) {
    spinner.start('Building vue components types');

    await new Promise<void>((_resolve, _reject) => {
      exec(`vue-tsc --declaration --emitDeclarationOnly --project ${resolve(rootDir, 'tsconfig.build.json')}`, { cwd: rootDir }, (error, stdout) => {
        if (error) _reject(new Error(stdout));
        else _resolve();
      });
    });

    spinner.succeed('Build vue components types success');
  }

  for (const lib of libs) {
    if (!lib.entry) continue;

    spinner.start(`Building ${chalk.green(lib.entry)}`);
    await api.build(lib);
    spinner.succeed(`Build ${chalk.green(lib.entry)} success`);
  }

  worker.terminate();

  // 移除类型文件
  if (hasVueComponent) {
    await fs.remove(resolve(outDir, 'dts'));
  }

  // 拷贝文件
  if (libs.some(lib => lib.copy?.length)) {
    spinner.start('Copying files');

    for (const lib of libs) {
      if (!lib.copy?.length) continue;

      for (const { from, to } of lib.copy) {
        const fromPath = resolve(rootDir, from);
        const toPath = resolve(outDir, to);

        await fs.copy(fromPath, toPath);
      }
    }

    spinner.succeed('Copy files success');
  }
}
