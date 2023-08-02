// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import { h } from 'vue';
import { ID_INJECTION_KEY } from 'element-plus';
import Theme from 'vitepress/theme';
import * as Mixte from 'mixte';

import './style.css';
import 'uno.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }: { app: App }) {
    app.provide(ID_INJECTION_KEY, {
      prefix: 1024,
      current: 0,
    });

    if (typeof window !== 'undefined') // @ts-expect-error
      window.Mixte = Mixte;
  },
};
