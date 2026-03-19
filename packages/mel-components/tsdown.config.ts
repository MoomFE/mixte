import { createTsdownConfig } from '../../scripts/tsdown';

export default createTsdownConfig({
  entry: {
    'utils': './src/utils/index.ts',
    'mel-select': './src/mel-select/index.ts',
  },
  vue: true,
  external: ['lodash-unified', '@mixte/mel-components/utils'],
});
