import { fileURLToPath } from 'node:url';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs';
import React from '@vitejs/plugin-react';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { dirname, resolve } from 'pathe';
import { pascalCase } from 'scule';
import Unocss from 'unocss/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ArcoResolver, ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitepress';
import { alias } from '../../meta/alias';
import { components, melComponents, mixte, snippets, use, validator } from '../../meta/docs.json';
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
    'validator/src/:fn/index.md': 'mixte/validator/:fn.md',
    'snippets/src/:fn/index.md': 'mixte/snippets/:fn.md',
    'mel-components/src/:fn/index.md': 'mixte/mel-components/:fn.md',
  },

  markdown: {
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: resolve(__dirname, './cache/twoslash'),
        }),
      }),
    ],
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
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
          { text: '@mixte/validator', link: `/mixte/validator/${validator[0].fn}`, activeMatch: '^/mixte/validator/' },
          { text: '@mixte/snippets', link: `/mixte/snippets/${snippets[0].fn}`, activeMatch: '^/mixte/snippets/' },
          { text: '@mixte/mel-components', link: `/mixte/mel-components/${melComponents[0].fn}`, activeMatch: '^/mixte/mel-components/' },
        ],
      },
      {
        text: `v${version}`,
        items: [
          { text: '更新日志', link: '/changelog.md' },
          {
            text: '历史版本文档地址',
            items: [
              { text: 'v2.5.0', link: 'https://mixte-v2.moomfe.com/' },
              { text: 'v1.31.2', link: 'https://mixte-v1.moomfe.com/' },
            ],
          },
          {
            text: '分支文档地址',
            items: [
              { text: 'dev', link: 'https://mixte-dev-branch.moomfe.com/' },
            ],
          },
        ],
      },
    ],

    sidebar: {
      '/mixte/': [
        {
          text: 'mixte',
          items: mixte.map(info => ({ text: `${info.sidebarTitle || info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/${info.fn}` })),
        },
        {
          text: '@mixte/use',
          items: use.map(info => ({ text: `${info.sidebarTitle || info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/use/${info.fn}` })),
        },
        {
          text: '@mixte/components',
          items: components.map(info => ({ text: `${info.sidebarTitle || pascalCase(info.fn)}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/components/${info.fn}` })),
        },
        {
          text: '@mixte/validator',
          items: validator.map(info => ({ text: `${info.sidebarTitle || info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/validator/${info.fn}` })),
        },
        {
          text: '@mixte/snippets',
          items: snippets.map(info => ({ text: `${info.sidebarTitle || info.fn}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/snippets/${info.fn}` })),
        },
        {
          text: '@mixte/mel-components',
          items: melComponents.map(info => ({ text: `${info.sidebarTitle || pascalCase(info.fn)}${info.name ? ` ( ${info.name} )` : ''}`, link: `/mixte/mel-components/${info.fn}` })),
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
      {
        ...VueJsx({
          exclude: [/[/\\]components-react[\\/$]+/],
        }),
        enforce: 'pre',
      },
      React({
        jsxImportSource: 'react',
      }),
      {
        config: () => ({
          esbuild: {
            include: /\.[jt]sx?$/,
          },
        }),
      },
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
          ElementPlusResolver({ importStyle: 'sass' }),
          NaiveUiResolver(),
          ArcoResolver({ importStyle: false }),
        ],
      }),
      ...VitePlugins,
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "${resolve(__dirname, 'theme/element-plus/index.scss')}" as element;`,
        },
      },
    },
    ssr: {
      noExternal: ['element-plus', 'naive-ui', 'vueuc', 'date-fns', 'veaury'],
    },
  },
});
