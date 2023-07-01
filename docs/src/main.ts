import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import type { UserModule } from './types';
import routes from '@/modules/router/routes';

import '@unocss/reset/tailwind.css';
import 'uno.css';
import '@/styles/styles.scss';

export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => {
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/**/index.ts', { eager: true })).forEach(m => m.install?.(ctx));
  },
);
