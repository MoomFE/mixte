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
  ...['types', 'utils'].map((name) => {
    return {
      entry: `./src/grid-table/src/${name}.ts`,
      outputFileName: `grid-table/${name}`,
      vueDtsInput: `grid-table/src/${name}.d.ts`,
    };
  }),
]);
