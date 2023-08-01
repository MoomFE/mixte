// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import Theme from 'vitepress/theme';
import * as Mixte from 'mixte';
import './style.css';
import 'uno.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp() {
    if (typeof window !== 'undefined') // @ts-expect-error
      window.Mixte = Mixte;
  },
};
