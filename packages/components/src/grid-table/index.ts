import type { ComponentExposed } from 'vue-component-type-helpers';
import GridTable from './src/index.vue';

export type { GridTableProps as MixteGridTableProps } from './src/types';

export type MixteGridTableInstance = ComponentExposed<typeof GridTable>;

export {
  GridTable as MixteGridTable,
};
