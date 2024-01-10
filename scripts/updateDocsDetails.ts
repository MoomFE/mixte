import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import fs from 'fs-extra';
import type { Info } from '@/.vitepress/types/info';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const docsDetails = {
    mixte: [] as ({ fn: string } & Info)[],
    use: [] as ({ fn: string } & Info)[],
    components: [] as ({ fn: string } & Info)[],
    snippets: [] as ({ fn: string } & Info)[],
  };

  const docsFile = await fg([`packages/(${Object.keys(docsDetails).join('|')})/src/*/index.md`], {
    cwd: resolve(__dirname, '../'),
  });

  for (const path of docsFile) {
    const [, pkg,, fn] = path.split('/');
    let name = '';
    let hiddenH1 = false;

    // 获取显示名称
    try {
      const info = await import(`../packages/${pkg}/src/${fn}/info`);
      name = info.name ?? name;
      hiddenH1 = info.hiddenH1 ?? hiddenH1;
    }
    catch (error) {}

    docsDetails[pkg as keyof typeof docsDetails].push({
      fn,
      name,
      hiddenH1,
    });
  }

  Object.entries(docsDetails).forEach(([pkg, fns]) => {
    docsDetails[pkg as keyof typeof docsDetails] = fns.sort((a, b) => a.fn.localeCompare(b.fn));
  });

  fs.writeJsonSync(resolve(__dirname, '../meta/docs.json'), docsDetails, { spaces: 2 });
})();
