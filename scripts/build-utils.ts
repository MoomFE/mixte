import { exec } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import chalk from 'chalk';
import Comlink from 'comlink'; // @ts-expect-error
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';
import fg from 'fast-glob';
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
  entry: string;
  /**
   * 输出文件名
   * @default 打包入口文件名
   */
  outputFileName?: string;
  /**
   * 需要排除的依赖
   */
  external?: string[];
  /**
   * 打包 dts 时需要排除的依赖
   */
  dtsExternal?: string[];
  /**
   * 是否是 vue 组件
   */
  vueComponent?: boolean;
}

export async function defineBuild(libs: LibConfig[]) {
  const rootDir = normalizePath(process.cwd());
  const outDir = resolve(rootDir, 'dist');

  await fs.emptyDir(outDir);

  const hasVueComponent = libs.some(lib => lib.vueComponent);

  if (hasVueComponent) {
    spinner.start('Building vue components types');
    await new Promise<void>((resolve, reject) => {
      exec('vue-tsc --declaration --emitDeclarationOnly', { cwd: rootDir }, (error, stdout) => {
        if (error) reject(new Error(stdout));
        else resolve();
      });
    });
    spinner.succeed('Build vue components types success');
  }

  for (const lib of libs) {
    spinner.start(`Building ${chalk.green(lib.entry)}`);
    await api.build(lib);
    spinner.succeed(`Build ${chalk.green(lib.entry)} success`);
  }

  worker.terminate();

  if (hasVueComponent) {
    const dirs = await fg([`${outDir}/*`], {
      onlyDirectories: true,
      cwd: rootDir,
    });

    for (const dir of dirs)
      await fs.remove(dir);
  }
}
