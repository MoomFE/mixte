import Sender from './src/sender.vue';

export type SenderInstance = InstanceType<typeof Sender>;

export type SenderProps = InstanceType<typeof Sender>['$props'];

export {
  Sender,
};
