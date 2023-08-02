import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { mixte, use } from '../../meta/docs.json';
import { alias } from '../../meta/alias';
import { version } from '../../package.json';
import { MarkdownTransform } from './plugins/markdownTransform';

export default defineConfig({
  title: 'Mixte',
  description: '',

  lang: 'zh-CN',

  cleanUrls: true,
  rewrites: {
    'mixte/src/:fn/index.md': 'mixte/:fn.md',
    'use/src/:fn/index.md': 'mixte/use/:fn.md',
  },

  themeConfig: {
    nav: [
      {
        text: 'Api',
        items: [
          { text: 'mixte', link: `/mixte/${mixte[0]}`, activeMatch: '^/mixte/(?!use)' },
          { text: '@mixte/use', link: `/mixte/use/${use[0]}`, activeMatch: '^/mixte/use/' },
        ],
      },
      {
        text: `v${version}`,
        items: [{ text: '更新日志', link: 'https://github.com/MoomFE/mixte/blob/main/CHANGELOG.md' }],
      },
    ],

    sidebar: {
      '/mixte/': mixte.map(fn => ({ text: fn, link: `/mixte/${fn}` })),
      '/mixte/use/': use.map(fn => ({ text: fn, link: `/mixte/use/${fn}` })),
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
  },

  lastUpdated: true,

  vite: {
    resolve: {
      alias,
    },
    plugins: [
      MarkdownTransform(),
      Unocss({
        configFile: resolve(__dirname, '../unocss.config.ts'),
      }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: resolve(__dirname, '../components.d.ts'),
        dirs: [
          resolve(__dirname, './components'),
        ],
      }),
      AutoImport({
        dts: resolve(__dirname, '../auto-imports.d.ts'),
        vueTemplate: true,
        imports: [
          'vue',
        ],
        eslintrc: {
          enabled: true,
          filepath: resolve(__dirname, '../.eslintrc-auto-import.json'),
        },
      }),
    ],
  },
});
