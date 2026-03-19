import type { ComponentExposed } from 'vue-component-type-helpers';

type InfiniteScrollComponent = typeof import('./src/index.vue')['default'];

export { default as MixteInfiniteScroll } from './src/index.vue';

export type MixteInfiniteScrollInstance = ComponentExposed<InfiniteScrollComponent>;

export type { InfiniteScrollProps as MixteInfiniteScrollProps } from './src/types';
