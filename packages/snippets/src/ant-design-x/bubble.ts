import '@mixte/snippets/ant-design-x/patch-for-veaury';

type BubbleComponent = typeof import('./src/bubble.vue')['default'];
type BubbleListComponent = typeof import('./src/bubble.list.vue')['default'];

export type BubbleInstance = InstanceType<BubbleComponent>;
export type BubbleListInstance = InstanceType<BubbleListComponent>;

export type BubbleProps = InstanceType<BubbleComponent>['$props'];
export type BubbleListProps = InstanceType<BubbleListComponent>['$props'];

export { default as BubbleList } from './src/bubble.list.vue';
export { default as Bubble } from './src/bubble.vue';
