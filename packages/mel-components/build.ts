import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/mel-select/index.ts',
    outputFileName: 'mel-select',
    vueComponent: true,
    dtsExternal: ['lodash-unified'],
  },
]);
