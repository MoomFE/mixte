import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';
import { mixte, use } from '../../meta/docs.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mixte',
  description: '',

  cleanUrls: true,
  rewrites: {
    'mixte/src/:fn/index.md': 'mixte/:fn.md',
    'use/src/:fn/index.md': 'mixte/use/:fn.md',
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'mixte', link: `/mixte/${mixte[0]}` },
      { text: 'use', link: `/mixte/use/${use[0]}` },
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
      alias: {
        'mixte': resolve(__dirname, '../mixte/index'),
        '@mixte/use': resolve(__dirname, '../use/index'),
      },
    },
    plugins: [
      Unocss({
        configFile: resolve(__dirname, '../unocss.config.ts'),
      }),
    ],
  },
});
