import '@mixte/snippets/ant-design-x/patch-for-veaury';

type SenderComponent = typeof import('./src/sender.vue')['default'];
type SenderHeaderComponent = typeof import('./src/sender.header.vue')['default'];

export type SenderInstance = InstanceType<SenderComponent>;
export type SenderHeaderInstance = InstanceType<SenderHeaderComponent>;

export type SenderProps = InstanceType<SenderComponent>['$props'];
export type SenderHeaderProps = InstanceType<SenderHeaderComponent>['$props'];

export { default as SenderHeader } from './src/sender.header.vue';
export { default as Sender } from './src/sender.vue';
