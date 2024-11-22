import { defineBuild } from '../../scripts/build-utils';

defineBuild([
  {
    entry: './src/getFastestCDN/index.ts',
    outputFileName: 'getFastestCDN',
  },
  {
    entry: './src/toggleThemeViewTransition/index.ts',
    outputFileName: 'toggleThemeViewTransition',
  },
  {
    entry: './src/useNaiveForm/index.ts',
    outputFileName: 'useNaiveForm',
    dtsExternal: ['naive-ui'],
  },
]);
