import type { ComponentExposed } from 'vue-component-type-helpers';
import InfiniteScroll from './src/index.vue';

export type { InfiniteScrollProps as MixteInfiniteScrollProps } from './src/types';

export type MixteInfiniteScrollInstance = ComponentExposed<typeof InfiniteScroll>;

export {
  InfiniteScroll as MixteInfiniteScroll,
};
