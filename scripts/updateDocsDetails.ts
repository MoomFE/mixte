import { resolve } from 'node:path';
import fg from 'fast-glob';
import fs from 'fs-extra';

(async () => {
  const docsDetails = {
    mixte: [] as string[],
    use: [] as string[],
  };

  const docsFile = await fg([`packages/(${Object.keys(docsDetails).join('|')})/src/*/index.md`], {
    cwd: resolve(__dirname, '../'),
  });

  docsFile.forEach((path) => {
    const [, pkg,, fn] = path.split('/');

    docsDetails[pkg as keyof typeof docsDetails].push(fn);
  });

  Object.entries(docsDetails).forEach(([pkg, fns]) => {
    docsDetails[pkg as keyof typeof docsDetails] = fns.sort();
  });

  fs.writeJsonSync(resolve(__dirname, '../meta/docs.json'), docsDetails, { spaces: 2 });
})();
