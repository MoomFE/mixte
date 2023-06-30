import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import fs from 'fs-extra';
import { packages } from '../meta/packages';

const rootDir = resolve(__dirname, '../');
const packagesDir = resolve(rootDir, 'packages');

// 打包代码
execSync('rollup -c', { stdio: 'inherit' });

// 拷贝 LICENSE 文件至子项目目录
packages.forEach(({ name }) => {
  fs.copyFileSync(
    resolve(rootDir, 'LICENSE'),
    resolve(packagesDir, name, 'LICENSE'),
  );
});
