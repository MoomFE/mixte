import type { ComponentExposed } from 'vue-component-type-helpers';
import GridTable from './src/index.vue';

export type {
  GridTableColumn as MixteGridTableColumn,
  GridTableProps as MixteGridTableProps,
} from './src/types';

export type MixteGridTableInstance = ComponentExposed<typeof GridTable>;

export {
  defineTableColumns,
} from '@mixte/components/grid-table/utils';

export {
  GridTable as MixteGridTable,
};
