import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mixte',
  description: '',
  vite: {
    plugins: [
      Unocss(),
    ],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

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
});
