import type { LibConfig } from './build-lib';
import { exec } from 'node:child_process';
import process from 'node:process';
import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import { resolve } from 'pathe';
import { normalizePath } from 'vite';
import { buildLib, resolveOutputFileName, usesDtsInput } from './build-lib';

const spinner = ora();

export async function defineBuild(libs: LibConfig[]) {
  const rootDir = normalizePath(process.cwd());
  const outDir = resolve(rootDir, 'dist');

  await fs.emptyDir(outDir);

  const needsVueDts = libs.some(usesDtsInput);

  if (needsVueDts) {
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
    const { entry } = lib;
    if (!entry) continue;

    spinner.start(`Building ${chalk.green(entry)}`);
    await buildLib({ ...lib, entry });
    spinner.succeed(`Build ${chalk.green(entry)} success`);
  }

  // 移除类型文件
  if (needsVueDts) {
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

  // 同步 package.json exports
  await syncExports(rootDir, libs);
}

interface PackageJson {
  exports?: Record<string, any>;
}

/** 导出条件键 */
const exportConditions = ['types', 'import', 'require'] as const;

/** 入口对应的导出配置 */
type ExpectedExport = Record<(typeof exportConditions)[number], string>;

/** 判断导出条目内容是否与预期一致 */
function isSameExport(current: any, expected: ExpectedExport) {
  return current !== null
    && typeof current === 'object'
    && exportConditions.every(condition => current[condition] === expected[condition]);
}

/** 判断是否存在通配符导出条目可覆盖指定导出的全部条件 */
function isCoveredByPattern(exportsMap: Record<string, any>, name: string, expected: ExpectedExport) {
  for (const [pattern, target] of Object.entries(exportsMap)) {
    const starIndex = pattern.indexOf('*');
    if (starIndex === -1 || !target || typeof target !== 'object') continue;

    const prefix = pattern.slice(0, starIndex);
    const suffix = pattern.slice(starIndex + 1);
    if (!name.startsWith(prefix) || !name.endsWith(suffix)) continue;

    const star = name.slice(prefix.length, name.length - suffix.length);

    const covered = exportConditions.every((condition) => {
      const patternTarget: unknown = target[condition];
      return typeof patternTarget === 'string'
        && patternTarget.includes('*')
        && patternTarget.replaceAll('*', star) === expected[condition];
    });

    if (covered) return true;
  }

  return false;
}

/**
 * 同步 package.json 的 exports 与构建入口
 *  - 为每个入口生成/修正导出 ( `.` 与 `./<outputFileName>` ), 包含 `types` / `import` / `require` 三份映射
 *  - 嵌套入口交由通配符条目覆盖, 其他手写条目 ( 如 `./*` 资源透传 ) 不会被修改或删除
 */
async function syncExports(rootDir: string, libs: LibConfig[]) {
  const packageJsonPath = resolve(rootDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath) as PackageJson;
  const exportsMap = packageJson.exports;

  if (!exportsMap) return;

  const syncNames: string[] = [];
  const addedNames: string[] = [];

  for (const lib of libs) {
    const { entry } = lib;
    if (!entry) continue;

    const outputFileName = resolveOutputFileName({ ...lib, entry });
    const exportName = `./${outputFileName.replace(/\/index$/, '')}`;
    const name = exportName === './index' ? '.' : exportName;

    const expected: ExpectedExport = {
      types: `./dist/${outputFileName}.d.ts`,
      import: `./dist/${outputFileName}.mjs`,
      require: `./dist/${outputFileName}.cjs`,
    };

    if (isSameExport(exportsMap[name], expected)) continue;
    if (isCoveredByPattern(exportsMap, name, expected)) continue;

    if (!(name in exportsMap)) addedNames.push(name);

    exportsMap[name] = expected;
    syncNames.push(name);
  }

  if (!syncNames.length) return;

  // 新增的条目插入到 `./*` 透传条目之前, 保持其位于末尾
  if (addedNames.length && './*' in exportsMap) {
    const rebuilt: Record<string, any> = {};

    for (const [key, value] of Object.entries(exportsMap)) {
      if (key === './*') {
        for (const addedName of addedNames) rebuilt[addedName] = exportsMap[addedName];
      }

      rebuilt[key] = value;
    }

    packageJson.exports = rebuilt;
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  spinner.succeed(`Sync package.json exports: ${chalk.green(syncNames.join(', '))}`);
}
