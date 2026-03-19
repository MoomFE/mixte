import '@mixte/snippets/ant-design-x/patch-for-veaury';

type XProviderComponent = typeof import('./src/x-provider.vue')['default'];

export type XProviderInstance = InstanceType<XProviderComponent>;

export type XProviderProps = InstanceType<XProviderComponent>['$props'];

export { default as XProvider } from './src/x-provider.vue';
