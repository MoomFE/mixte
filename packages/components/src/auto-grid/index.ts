import type { AutoGridProps } from './src/types';
import AutoGrid from './src/index.vue';

type AutoGridInstance = InstanceType<typeof AutoGrid>;

export type {
  AutoGridInstance as MixteAutoGridInstance,
  AutoGridProps as MixteAutoGridProps,
};

export {
  AutoGrid as MixteAutoGrid,
};
