import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/auto-grid/index.ts',
    outputFileName: 'auto-grid',
    vueComponent: true,
  },
  {
    entry: './src/list-auto-grid/index.ts',
    outputFileName: 'list-auto-grid',
    vueComponent: true,
  },
]);
