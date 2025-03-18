import type { Info } from '@/.vitepress/types/info';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { dirname, resolve } from 'pathe';
import { camelCase, kebabCase } from 'scule';

interface DocsInfo extends Info {
  /** 函数/组件的文件夹名称 */
  fn: string;
  /** 子级文档 */
  children?: Record<string, string[]>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const docsDetails: Record<'mixte' | 'use' | 'components' | 'validator' | 'snippets' | 'melComponents', DocsInfo[]> = {
    mixte: [],
    use: [],
    components: [],
    validator: [],
    snippets: [],
    melComponents: [],
  };

  const docsFile = await fg([`packages/(${Object.keys(docsDetails).map(name => kebabCase(name)).join('|')})/src/*/index.md`], {
    cwd: resolve(__dirname, '../'),
  });

  for (const path of docsFile) {
    const [, pkg,, fn] = path.split('/');
    let title = '';
    let name = '';
    let hiddenTitle = false;
    let sidebarTitle = '';
    const children: DocsInfo['children'] = {};

    // 获取显示名称
    try {
      const info = (await import(`../packages/${pkg}/src/${fn}/info`)).default as Info;

      title = info.title ?? title;
      name = info.name ?? name;
      hiddenTitle = info.hiddenTitle ?? hiddenTitle;
      sidebarTitle = info.sidebarTitle ?? sidebarTitle;
    }
    catch {}

    // 获取子级文档
    if (pkg === 'snippets' && fn === 'ant-design-x') {
      const childrenDocsFile = await fg([`packages/${pkg}/src/${fn}/docs/*.md`], {
        cwd: resolve(__dirname, '../'),
      });

      for (const childPath of childrenDocsFile) {
        const [,,,,, childName] = childPath.split('/');
        const [fn, group] = childName.split('.').reverse().slice(1);

        children[group] ??= [];
        children[group].push(fn);
      }
    }

    docsDetails[camelCase(pkg) as keyof typeof docsDetails].push({
      fn,
      title,
      name,
      hiddenTitle,
      sidebarTitle,
      children,
    });
  }

  Object.entries(docsDetails).forEach(([pkg, fns]) => {
    docsDetails[pkg as keyof typeof docsDetails] = fns.sort((a, b) => a.fn.localeCompare(b.fn));
  });

  fs.writeJsonSync(resolve(__dirname, '../meta/docs.json'), docsDetails, { spaces: 2 });
})();
