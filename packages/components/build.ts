import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/auto-grid/index.ts',
    outputFileName: 'auto-grid',
    vueComponent: true,
  },
  {
    entry: './src/infinite-scroll/index.ts',
    outputFileName: 'infinite-scroll',
    vueComponent: true,
  },

  {
    entry: './src/grid-table/index.ts',
    outputFileName: 'grid-table/index',
    vueComponent: true,
  },
  {
    entry: `./src/grid-table/src/types.ts`,
    outputFileName: `grid-table/types`,
    vueDtsInput: `grid-table/src/types.d.ts`,
  },
  {
    copy: [{
      from: './src/grid-table/src/css',
      to: 'grid-table/css',
    }],
  },
]);
