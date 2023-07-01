import NProgress from 'nprogress';
import './index.scss';
import type { UserModule } from '@/types';

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    NProgress.configure({
      showSpinner: false,
    });

    router.beforeEach(() => {
      NProgress.start();
    });

    router.afterEach(() => {
      NProgress.done();
    });
  }
};
