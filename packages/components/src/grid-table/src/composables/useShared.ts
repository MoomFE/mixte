import type { GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
import type { MixteScrollbarInstance } from '@mixte/components/scrollbar';
import type { ModelRef, StyleValue } from 'vue';
import { createInjectionState, useElementSize, useScroll } from '@vueuse/core';
import { isFunction, isNumeric } from 'mixte';
import { computed, reactive, ref, toValue, watch } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '../utils';

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

  /** 表格行主键 */
  const rowKey = computed(() => toValue(props.rowKey) ?? 'id');
  /** 树形数据子节点字段名 */
  const childrenKey = computed(() => props.childrenKey ?? 'children');
  /** 树形数据展开的列主键 */
  const expandColumnKey = computed(() => props.expandColumnKey ?? (props.columns?.[0]?.field ?? ''));
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
  const fixedLeftColumns = computed(() => props.columns?.filter(column => columnIsFixedLeft(column)) ?? []);
  /** 所有固定在左侧的列的位置 */
  const fixedLeftColumnsRect = ref<Pick<DOMRect, 'left' | 'right'>[]>([]);
  /** 所有固定在右侧的列 */
  const fixedRightColumns = computed(() => props.columns?.filter(column => columnIsFixedRight(column)).reverse() ?? []);
  /** 所有固定在右侧的列的位置 */
  const fixedRightColumnsRect = ref<Pick<DOMRect, 'left' | 'right'>[]>([]);

  const scrollbarRef = ref<MixteScrollbarInstance>();
  const scrollbarContentRef = computed(() => scrollbarRef.value?.contentRef);
  const scrollbarContentScroll = reactive(useScroll(scrollbarContentRef));

  const tableWrapRef = ref<HTMLDivElement>();
  const tableWrapSize = reactive(useElementSize(tableWrapRef));

  const tableRef = ref<HTMLDivElement>();
  const tableSize = reactive(useElementSize(tableRef));

  /** 表格包裹层样式 */
  const tableWrapStyle = computed<StyleValue>(() => {
    let gridTemplateColumns = '';

    if (props.columns?.length) {
      for (const column of props.columns) {
        let width = column.width;

        // 函数形式
        if (isFunction(width)) width = width({ column });

        // 未设置
        if (width == null) gridTemplateColumns += 'auto ';
        // 数字宽度
        else if (isNumeric(width) && Number(width) >= 0) gridTemplateColumns += `${width}px `;
        // 合法的宽度
        else if (CSS.supports('grid-template-columns', `${width} auto`)) gridTemplateColumns += `${width} `;
        // 其他情况
        else gridTemplateColumns += 'auto ';
      }
    }

    return {
      gridTemplateColumns,
    };
  });

  // 表格包裹层尺寸变化时, 重新测量滚动条情况
  watch(() => `${tableWrapSize.width}-${tableWrapSize.height}`, () => {
    scrollbarContentScroll.measure();
  });

  /** 表格表头高度 */
  const tableTheadHeight = ref(0);

  return {
    props,
    slots,

    expandedRowKeys,

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

    scrollbarRef,
    scrollbarContentScroll,

    tableWrapRef,
    tableWrapSize,
    scrollbarContentScroll,
    tableWrapStyle,

    tableRef,
    tableSize,

    tableTheadHeight,
  };
});
