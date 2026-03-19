import '@mixte/snippets/ant-design-x/patch-for-veaury';

type WelcomeComponent = typeof import('./src/welcome.vue')['default'];

export type WelcomeInstance = InstanceType<WelcomeComponent>;

export type WelcomeProps = InstanceType<WelcomeComponent>['$props'];

export { default as Welcome } from './src/welcome.vue';
