import { createTsdownConfig } from '../../scripts/tsdown';

export default createTsdownConfig({
  entry: {
    'auto-grid': './src/auto-grid/index.ts',
    'infinite-scroll': './src/infinite-scroll/index.ts',
    'grid-table/index': './src/grid-table/index.ts',
    'grid-table/types': './src/grid-table/src/types.ts',
  },
  vue: true,
  external: ['@mixte/components/grid-table/types'],
  copy: [{
    from: './src/grid-table/src/css',
    to: 'grid-table/css',
  }],
});
