import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';
import { mixte } from '../../meta/docs.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mixte',
  description: '',

  cleanUrls: true,
  rewrites: {
    'mixte/src/:fn/index.md': 'mixte/:fn.md',
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'mixte', link: `/mixte/${mixte[0]}` },
    ],

    sidebar: {
      '/mixte/': mixte.map(fn => ({
        text: fn,
        link: `/mixte/${fn}`,
      })),
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
    plugins: [
      Unocss(),
    ],
  },
});
