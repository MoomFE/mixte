import type { ComponentExposed } from 'vue-component-type-helpers';
import '@mixte/components/dist/grid-table/css/index.scss';

type GridTableComponent = typeof import('./src/index.vue')['default'];

export { default as MixteGridTable } from './src/index.vue';

export type MixteGridTableInstance = ComponentExposed<GridTableComponent>;

export type {
  GridTableColumn as MixteGridTableColumn,
  GridTableProps as MixteGridTableProps,
} from './src/types';

export {
  defineTableColumns,
} from './src/utils';
