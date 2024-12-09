import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/utils/index.ts',
    outputFileName: 'utils',
  },
  {
    entry: './src/mel-select/index.ts',
    outputFileName: 'mel-select',
    vueComponent: true,
    external: ['@mixte/mel-components/utils'],
    dtsExternal: ['lodash-unified', '@mixte/mel-components/utils'],
  },
]);
