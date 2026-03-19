import type { ComponentExposed } from 'vue-component-type-helpers';

type AutoGridComponent = typeof import('./src/index.vue')['default'];

export { default as MixteAutoGrid } from './src/index.vue';

export type MixteAutoGridInstance = ComponentExposed<AutoGridComponent>;

export type { AutoGridProps as MixteAutoGridProps } from './src/types';
