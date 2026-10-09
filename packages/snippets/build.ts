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

  // lottery
  {
    entry: './src/lottery/index.ts',
    outputFileName: 'lottery',
    vueComponent: true,
  },
  ...['config-provider-Injection-state', 'utils'].map((name) => {
    return {
      entry: `./src/lottery/src/${name}.ts`,
      outputFileName: `lottery/${name}`,
      vueDtsInput: `lottery/src/${name}.d.ts`,
    };
  }),
  {
    copy: [{
      from: './src/lottery/src/css',
      to: 'lottery/css',
    }],
  },

  // low-code-editor
  ...['config-provider', 'component-list', 'canvas', 'border-view', 'config', 'preview', 'editor'].map((name) => {
    return {
      entry: `./src/low-code-editor/${name}.ts`,
      outputFileName: `low-code-editor/${name}`,
      vueComponent: true,
    };
  }),
  ...['config-provider-Injection-state', 'types', 'utils'].map((name) => {
    return {
      entry: `./src/low-code-editor/src/${name}.ts`,
      outputFileName: `low-code-editor/${name}`,
      vueDtsInput: `low-code-editor/src/${name}.d.ts`,
    };
  }),
  {
    copy: [{
      from: './src/low-code-editor/src/css',
      to: 'low-code-editor/css',
    }],
  },
]);
