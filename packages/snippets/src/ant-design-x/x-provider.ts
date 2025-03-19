import XProvider from './src/x-provider.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type XProviderInstance = InstanceType<typeof XProvider>;

export type XProviderProps = InstanceType<typeof XProvider>['$props'];

export {
  XProvider,
};
