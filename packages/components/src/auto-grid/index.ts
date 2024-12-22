import type { ComponentExposed } from 'vue-component-type-helpers';
import AutoGrid from './src/index.vue';

export type { AutoGridProps as MixteAutoGridProps } from './src/types';

export type MixteAutoGridInstance = ComponentExposed<typeof AutoGrid>;

export {
  AutoGrid as MixteAutoGrid,
};
