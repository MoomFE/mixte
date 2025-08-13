import type { GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
import type { ModelRef } from 'vue';
import { createInjectionState, useElementSize, useEventListener, useScroll } from '@vueuse/core';
import { isBrowser, isFunction, isNumeric } from 'mixte';
import { computed, reactive, ref, toValue, watch } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '../utils';

const supportsSubgrid = isBrowser && CSS?.supports('grid-template-columns', `subgrid`);

interface UseSharedStoreOptions {
  expandedRowKeys: ModelRef<string[]>;
}

export const [
  useSharedStore,
  useShared,
] = createInjectionState((
  props: GridTableProps<any>,
  slots: GridTableSlots<any>,
  options: UseSharedStoreOptions,
) => {
  const { expandedRowKeys } = options;

  /** 渲染模式 */
  const renderMode = computed(() => {
    const mode = props.renderMode ?? 'auto';
    if (mode === 'modern' || mode === 'legacy') return mode;
    if (supportsSubgrid) return 'modern';
    return 'legacy';
  });
  /** 是否是现代渲染模式 */
  const isModernRenderMode = computed(() => renderMode.value === 'modern');
  /** 是否是传统渲染模式 */
  const isLegacyRenderMode = computed(() => renderMode.value === 'legacy');

  const columns = computed(() => {
    return props.columns?.filter((column) => {
      const visible = column.visible ?? true;
      if (isFunction(visible) ? !visible({ column }) : !visible) return false;

      const hidden = column.hidden ?? false;
      if (isFunction(hidden) ? hidden({ column }) : hidden) return false;

      return true;
    });
  });

  /** 表格行主键 */
  const rowKey = computed(() => toValue(props.rowKey) ?? 'id');
  /** 树形数据子节点字段名 */
  const childrenKey = computed(() => props.childrenKey ?? 'children');
  /** 树形数据展开的列主键 */
  const expandColumnKey = computed(() => props.expandColumnKey ?? (columns.value?.[0]?.field ?? ''));
  /** 树形数据缩进宽度 */
  const expandedIndent = computed(() => {
    let indent = props.expandedIndent;
    return isNumeric(indent) && (indent = Number(indent)) >= 0 ? indent : 15;
  });

  /** 预渲染的行数 */
  const overscan = computed(() => {
    let overscan = props.overscan;
    return isNumeric(overscan) && (overscan = Number(overscan)) >= 0 ? overscan : 5;
  });

  /** 预估行高度 */
  const estimatedRowHeight = computed(() => {
    let estimatedHeight = props.estimatedRowHeight;
    return isNumeric(estimatedHeight) && (estimatedHeight = Number(estimatedHeight)) > 0 ? estimatedHeight : 50;
  });

  /** 所有固定在左侧的列 */
  const fixedLeftColumns = computed(() => columns.value?.filter(column => columnIsFixedLeft(column)) ?? []);
  /** 所有固定在左侧的列的位置 */
  const fixedLeftColumnsRect = ref<Pick<DOMRect, 'left' | 'right'>[]>([]);
  /** 所有固定在右侧的列 */
  const fixedRightColumns = computed(() => columns.value?.filter(column => columnIsFixedRight(column)).reverse() ?? []);
  /** 所有固定在右侧的列的位置 */
  const fixedRightColumnsRect = ref<Pick<DOMRect, 'left' | 'right'>[]>([]);

  const tableWrapRef = ref<HTMLDivElement>();
  const tableWrapSize = reactive(useElementSize(tableWrapRef));
  const tableWrapScroll = reactive(useScroll(tableWrapRef));

  const tableRef = ref<HTMLDivElement>();
  const tableSize = reactive(useElementSize(tableRef));

  // 表格包裹层尺寸变化时, 重新测量滚动条情况
  watch(() => `${tableWrapSize.width}-${tableWrapSize.height}`, () => {
    tableWrapScroll.measure();
  });

  /** 表格表头高度 */
  const tableTheadHeight = ref(0);

  /** 鼠标悬停的行索引 */
  const hoverIndex = ref<number | null>(null);

  useEventListener(tableRef, 'pointerover', (event: PointerEvent) => {
    const target = event.target as HTMLDivElement | undefined;
    const td = target?.closest<HTMLDivElement>('.mixte-gt-td');

    if (td) hoverIndex.value = Number(td.dataset.index);
    else hoverIndex.value = null;
  });

  useEventListener(tableWrapRef, 'pointerleave', () => {
    hoverIndex.value = null;
  });

  return {
    props,
    slots,

    expandedRowKeys,

    renderMode,
    isModernRenderMode,
    isLegacyRenderMode,

    columns,
    rowKey,
    childrenKey,
    expandColumnKey,
    expandedIndent,
    overscan,
    estimatedRowHeight,

    fixedLeftColumns,
    fixedLeftColumnsRect,
    fixedRightColumns,
    fixedRightColumnsRect,

    tableWrapRef,
    tableWrapSize,
    tableWrapScroll,

    tableRef,
    tableSize,

    tableTheadHeight,
    hoverIndex,
  };
});
