import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { pascalCase } from 'change-case';
import { components, mixte, snippets, use } from '../../meta/docs.json';
import { alias } from '../../meta/alias';
import { version } from '../../package.json';
import { MarkdownTransform } from './plugins/markdownTransform';
import VitePlugins from './vite.common.plugins';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: 'Mixte',
  description: '',

  lang: 'zh-CN',

  cleanUrls: true,
  rewrites: {
    'mixte/src/:fn/index.md': 'mixte/:fn.md',
    'use/src/:fn/index.md': 'mixte/use/:fn.md',
    'components/src/:fn/index.md': 'mixte/components/:fn.md',
    'snippets/src/:fn/index.md': 'mixte/snippets/:fn.md',
  },

  lastUpdated: true,

  sitemap: {
    hostname: 'https://mixte.moomfe.com/',
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: 'Api',
        items: [
          { text: 'mixte', link: `/mixte/${mixte[0].fn}`, activeMatch: '^/mixte/(?!use)' },
          { text: '@mixte/use', link: `/mixte/use/${use[0].fn}`, activeMatch: '^/mixte/use/' },
          { text: '@mixte/components', link: `/mixte/components/${components[0].fn}`, activeMatch: '^/mixte/components/' },
          { text: '@mixte/snippets', link: `/mixte/snippets/${snippets[0].fn}`, activeMatch: '^/mixte/snippets/' },
        ],
      },
      {
        text: `v${version}`,
        items: [
          { text: '更新日志', link: '/changelog.md' },
          { text: 'dev 分支文档地址', link: 'https://mixte-dev-branch.moomfe.com/' },
        ],
      },
    ],

    sidebar: {
      '/mixte/': [
        {
          text: 'mixte',
          items: mixte.map(info => ({ text: `${info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/${info.fn}` })),
        },
        {
          text: '@mixte/use',
          items: use.map(info => ({ text: `${info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/use/${info.fn}` })),
        },
        {
          text: '@mixte/components',
          items: components.map(info => ({ text: `${pascalCase(info.fn)}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/components/${info.fn}` })),
        },
        {
          text: '@mixte/snippets',
          items: snippets.map(info => ({ text: `${info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/snippets/${info.fn}` })),
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MoomFE/mixte' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright (c) 2023-present, Wei Zhang',
    },

    outline: {
      label: '大纲',
    },
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '深色模式',
    returnToTopLabel: '回到顶部',
  },

  vite: {
    resolve: {
      alias: [
        ...alias,
        { find: '@', replacement: resolve(__dirname, '../') },
        { find: '@@', replacement: resolve(__dirname, '../../') },
      ],
    },
    plugins: [
      VueJsx(),
      MarkdownTransform(),
      Unocss({
        configFile: resolve(__dirname, '../unocss.config.ts'),
      }),
      Icons({
        scale: 1,
        compiler: 'vue3',
      }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: resolve(__dirname, '../components.d.ts'),
        dirs: [
          resolve(__dirname, './components'),
        ],
        resolvers: [
          IconsResolver({ prefix: 'i' }),
          ElementPlusResolver(),
        ],
      }),
      ...VitePlugins,
    ],
    ssr: {
      noExternal: ['element-plus', 'naive-ui', 'vueuc', 'date-fns'],
    },
  },
});
