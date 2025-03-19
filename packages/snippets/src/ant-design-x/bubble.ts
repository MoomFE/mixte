import Bubble from './src/bubble.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type BubbleInstance = InstanceType<typeof Bubble>;

export type BubbleProps = InstanceType<typeof Bubble>['$props'];

export {
  Bubble,
};
