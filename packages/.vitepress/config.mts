import type { DefaultTheme } from 'vitepress';
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
    ':pkg/src/:fn/index.md': 'mixte/:pkg/:fn.md',
    ':pkg/src/:fn/docs/:group.:name.md': 'mixte/:pkg/:fn/:name.md',
    ':pkg/src/:fn/docs/:name.md': 'mixte/:pkg/:fn/:name.md',
  },

  markdown: {
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: resolve(__dirname, './cache/twoslash'),
        }),
      }) as any,
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
          { text: 'mixte', link: `/mixte/${mixte[0].fn}`, activeMatch: '^/mixte/(?!(use|components|validator|snippets|mel-components))/' },
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
        { text: 'mixte', docs: mixte },
        { text: '@mixte/use', docs: use },
        { text: '@mixte/components', docs: components },
        { text: '@mixte/validator', docs: validator },
        { text: '@mixte/snippets', docs: snippets },
        { text: '@mixte/mel-components', docs: melComponents },
      ].map(({ text, docs }) => {
        const pkg = text.replace('@mixte/', '');

        return {
          text,
          items: docs.map((info) => {
            const nameFirst = info.sidebarTitle || (pkg.includes('components') ? pascalCase(info.fn) : info.fn);
            const nameLast = info.name ? ` ( ${info.name} )` : '';
            const link = `/mixte/${pkg !== 'mixte' ? `${pkg}/` : ''}${info.fn}`;

            const items: DefaultTheme.Config['sidebar'] = [];

            info.children && Object.entries(info.children as Record<string, string[]>).forEach(([group, fns]) => {
              if (!group) {
                return items.push(...fns.map(fn => ({ text: fn, link: `/mixte/${pkg}/${info.fn}/${fn}` })));
              }

              items.push({
                text: group,
                items: fns.map(fn => ({ text: fn, link: `${link}/${fn}` })),
              });
            });

            return {
              text: `${nameFirst}${nameLast}`,
              link,
              items,
            };
          }),
        };
      }),
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
      noExternal: ['element-plus', 'naive-ui', 'vueuc', 'date-fns', 'veaury', /^@ant-design\/.+/, 'antd', /^rc-.+/],
    },
  },
});
