// https://vitepress.dev/guide/custom-theme
import type { App } from 'vue';
import { ID_INJECTION_KEY } from 'element-plus';
import { inject } from '@vercel/analytics';
import Theme from 'vitepress/theme';
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client';
import * as Mixte from 'mixte';
import Layout from './Layout.vue';

import './style.css';
import 'uno.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/theme-chalk/el-message.css';
import '@shikijs/vitepress-twoslash/style.css';

export default {
  extends: Theme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.provide(ID_INJECTION_KEY, {
      prefix: 1024,
      current: 0,
    });

    if (typeof window !== 'undefined') { // @ts-expect-error
      window.Mixte = Mixte;
      import.meta.env.PROD && inject();
    }

    app.use(TwoSlashFloatingVue);

    app.config.warnHandler = (msg, instance, trace) => {
      if (msg.includes(`' was accessed via 'this'.`)) return;

      console.warn(`[Vue warn]: ${msg}`, instance, trace);
    };
  },
};
