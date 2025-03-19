import Sender from './src/sender.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type SenderInstance = InstanceType<typeof Sender>;

export type SenderProps = InstanceType<typeof Sender>['$props'];

export {
  Sender,
};
