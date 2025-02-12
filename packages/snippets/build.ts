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

  // tiptap-editor
  ...['index', 'menu', 'bubble-menu', 'config-provider'].map((name) => {
    return {
      entry: `./src/tiptap-editor/${name}.ts`,
      outputFileName: `tiptap-editor${name === 'index' ? '' : `/${name}`}`,
      vueComponent: true,
    };
  }),
  ...['config-provider-Injection-state', 'icons'].map((name) => {
    return {
      entry: `./src/tiptap-editor/src/${name}.ts`,
      outputFileName: `tiptap-editor/${name}`,
      vueDtsInput: `tiptap-editor/src/${name}.d.ts`,
    };
  }),
  {
    copy: [{
      from: './src/tiptap-editor/src/css',
      to: 'tiptap-editor/css',
    }],
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

  // ant-design-x
  ...['sender'].map((name) => {
    return {
      entry: `./src/ant-design-x/${name}.ts`,
      outputFileName: `ant-design-x/${name}`,
      vueComponent: true,
      external: [
        /^react-dom\/.+/,
      ],
    };
  }),
  ...['init-veaury'].map((name) => {
    return {
      entry: `./src/ant-design-x/src/${name}.ts`,
      outputFileName: `ant-design-x/${name}`,
      vueDtsInput: `ant-design-x/src/${name}.d.ts`,
      external: [
        /^react-dom\/.+/,
      ],
    };
  }),
]);
