import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import fs from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../');

describe('@mixte/snippets', async () => {
  const modules = await fg.sync(['src/*/index.ts'], { cwd: rootDir });
  const modulesName = modules.map(path => path.split('/')[1]);

  it('所有模块均在 package.json 有定义', async () => {
    const packageJson = await import('../package.json');

    for (const name of modulesName)
      expect(packageJson.exports).toHaveProperty(`./${name}`);
  });

  it('所有的模块均在根目录下有对应的 .d.ts 文件', async () => {
    const result = await Promise.allSettled(
      modulesName.map((name) => {
        return fs.pathExists(resolve(rootDir, `${name}.d.ts`));
      }),
    );

    result.forEach((item) => {
      expect(item.status).toBe('fulfilled');
      expect(item.value).toBe(true);
    });
  });
});
