import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { pascalCase } from 'change-case';
import { components, mixte, use } from '../../meta/docs.json';
import { alias } from '../../meta/alias';
import { version } from '../../package.json';
import { MarkdownTransform } from './plugins/markdownTransform';
import VitePlugins from './vite.common.plugins';

export default defineConfig({
  title: 'Mixte',
  description: '',

  lang: 'zh-CN',

  cleanUrls: true,
  rewrites: {
    'mixte/src/:fn/index.md': 'mixte/:fn.md',
    'use/src/:fn/index.md': 'mixte/use/:fn.md',
    'components/src/:fn/index.md': 'mixte/components/:fn.md',
  },

  lastUpdated: true,

  sitemap: {
    hostname: 'https://mixte.moomfe.com/',
  },

  themeConfig: {
    nav: [
      {
        text: 'Api',
        items: [
          { text: 'mixte', link: `/mixte/${mixte[0].fn}`, activeMatch: '^/mixte/(?!use)' },
          { text: '@mixte/use', link: `/mixte/use/${use[0].fn}`, activeMatch: '^/mixte/use/' },
          { text: '@mixte/components', link: `/mixte/components/${components[0].fn}`, activeMatch: '^/mixte/components/' },
        ],
      },
      {
        text: `v${version}`,
        items: [{ text: '更新日志', link: 'https://github.com/MoomFE/mixte/blob/main/CHANGELOG.md' }],
      },
    ],

    sidebar: {
      '/mixte/': [
        {
          text: 'mixte',
          items: mixte.map(info => ({ text: info.fn, link: `/mixte/${info.fn}` })),
        },
        {
          text: '@mixte/use',
          items: use.map(info => ({ text: info.fn, link: `/mixte/use/${info.fn}` })),
        },
        {
          text: '@mixte/components',
          items: components.map(info => ({
            text: `${pascalCase(info.fn)}${info.name ? ` ( ${info.name} )` : ''}`,
            link: `/mixte/components/${info.fn}`,
          })),
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
      alias: {
        ...alias,
        '@': resolve(__dirname, '../'),
        '@@': resolve(__dirname, '../../'),
      },
    },
    plugins: [
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
      noExternal: ['element-plus'],
    },
  },
});
