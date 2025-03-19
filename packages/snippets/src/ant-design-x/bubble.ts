import BubbleList from './src/bubble.list.vue';
import Bubble from './src/bubble.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type BubbleInstance = InstanceType<typeof Bubble>;
export type BubbleListInstance = InstanceType<typeof BubbleList>;

export type BubbleProps = InstanceType<typeof Bubble>['$props'];
export type BubbleListProps = InstanceType<typeof BubbleList>['$props'];

export {
  Bubble,
  BubbleList,
};
