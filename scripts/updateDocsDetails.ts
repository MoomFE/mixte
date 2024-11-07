import type { Info } from '@/.vitepress/types/info';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { dirname, resolve } from 'pathe';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const docsDetails = {
    mixte: [] as ({ fn: string } & Info)[],
    use: [] as ({ fn: string } & Info)[],
    components: [] as ({ fn: string } & Info)[],
    validator: [] as ({ fn: string } & Info)[],
    snippets: [] as ({ fn: string } & Info)[],
  };

  const docsFile = await fg([`packages/(${Object.keys(docsDetails).join('|')})/src/*/index.md`], {
    cwd: resolve(__dirname, '../'),
  });

  for (const path of docsFile) {
    const [, pkg,, fn] = path.split('/');
    let title = '';
    let name = '';
    let hiddenTitle = false;
    let sidebarTitle = '';

    // 获取显示名称
    try {
      const info = await import(`../packages/${pkg}/src/${fn}/info`);
      title = info.title ?? title;
      name = info.name ?? name;
      hiddenTitle = info.hiddenTitle ?? hiddenTitle;
      sidebarTitle = info.sidebarTitle ?? sidebarTitle;
    }
    catch {}

    docsDetails[pkg as keyof typeof docsDetails].push({
      fn,
      title,
      name,
      hiddenTitle,
      sidebarTitle,
    });
  }

  Object.entries(docsDetails).forEach(([pkg, fns]) => {
    docsDetails[pkg as keyof typeof docsDetails] = fns.sort((a, b) => a.fn.localeCompare(b.fn));
  });

  fs.writeJsonSync(resolve(__dirname, '../meta/docs.json'), docsDetails, { spaces: 2 });
})();
