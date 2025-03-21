import { defineBuild } from '../../scripts/build-utils';

const antDesignXExternal = [
  /^(@types\/)?react((\/.+)|-dom|$)/,
  /^@ant-design\/.+/,
  'antd',
];

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

  // ant-design-x
  ...['sender', 'welcome', 'x-provider', 'bubble', 'conversations', 'index'].map((name) => {
    return {
      entry: `./src/ant-design-x/${name}.ts`,
      outputFileName: `ant-design-x/${name}`,
      vueComponent: true,
      external: antDesignXExternal,
      dtsExternal: antDesignXExternal,
    };
  }),
  ...['patch-for-react-19', 'patch-for-veaury', 'utils'].map((name) => {
    return {
      entry: `./src/ant-design-x/src/${name}.ts`,
      outputFileName: `ant-design-x/${name}`,
      vueDtsInput: `ant-design-x/src/${name}.d.ts`,
      external: antDesignXExternal,
      dtsExternal: antDesignXExternal,
    };
  }),
]);
