import SenderHeader from './src/sender.header.vue';
import Sender from './src/sender.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type SenderInstance = InstanceType<typeof Sender>;
export type SenderHeaderInstance = InstanceType<typeof SenderHeader>;

export type SenderProps = InstanceType<typeof Sender>['$props'];
export type SenderHeaderProps = InstanceType<typeof SenderHeader>['$props'];

export {
  Sender,
  SenderHeader,
};
