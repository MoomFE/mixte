import type { GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
import type { ComputedRef, ModelRef, StyleValue } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '@mixte/components/grid-table/utils';
import { createInjectionState, useElementSize, useScroll } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { createTreeMate } from 'treemate';
import { computed, reactive, ref, toValue, watch } from 'vue';

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

  const { treeMate, expandedRowSet, displayedData, updateExpanded } = useTreeData(props, {
    rowKey,
    childrenKey,
    expandedRowKeys,
  });

  /** 所有固定在左侧的列 */
  const fixedLeftColumns = computed(() => {
    return props.columns?.filter(column => columnIsFixedLeft(column)) ?? [];
  });
  /** 所有固定在右侧的列 */
  const fixedRightColumns = computed(() => {
    return props.columns?.filter(column => columnIsFixedRight(column)).reverse() ?? [];
  });

  const tableWrapRef = ref<HTMLDivElement>();
  const tableWrapSize = reactive(useElementSize(tableWrapRef));
  const tableWrapScroll = reactive(useScroll(tableWrapRef));

  const tableRef = ref<HTMLDivElement>();

  /** 表格包裹层样式 */
  const tableWrapStyle = computed<StyleValue>(() => {
    let gridTemplateColumns = '';

    if (props.columns?.length) {
      for (const column of props.columns) {
        const width = column.width;

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
    tableWrapScroll.measure();
  });

  const tableTheadRef = ref<HTMLDivElement>();
  const tableTheadSize = reactive(useElementSize(tableTheadRef));

  return {
    props,
    slots,

    expandedRowKeys,

    rowKey,
    childrenKey,
    expandColumnKey,
    overscan,
    estimatedRowHeight,

    treeMate,
    expandedRowSet,
    displayedData,
    updateExpanded,

    fixedLeftColumns,
    fixedRightColumns,

    tableWrapRef,
    tableWrapSize,
    tableWrapScroll,
    tableWrapStyle,

    tableRef,

    tableTheadRef,
    tableTheadSize,
  };
});

export function useTreeData(
  props: GridTableProps<any>,
  options: {
    rowKey: ComputedRef<string>;
    childrenKey: ComputedRef<string>;
    expandedRowKeys: UseSharedStoreOptions['expandedRowKeys'];
  },
) {
  const { rowKey, childrenKey, expandedRowKeys } = options;

  const treeMate = computed(() => {
    return createTreeMate<Record<string, any>>(props.data ?? [], {
      ignoreEmptyChildren: true,
      getKey: row => row[rowKey.value],
      getChildren: row => row[childrenKey.value],
      getIsGroup: () => false,
    });
  });

  // todo
  //  - props.expandedRowKeys 变更时, 需要重新计算
  const expandedRowSet = ref(new Set(expandedRowKeys.value));

  const displayedData = computed(() => {
    // 直接使用 expandedRowKeys.value 不知为什么没有被收集依赖
    // 当 expandedRowKeys.value 改变时, computed 不会重新计算, 等有空再研究
    return treeMate.value.getFlattenedNodes([...expandedRowSet.value]);
  });

  function updateExpanded(key: string) {
    const index = expandedRowKeys.value.indexOf(key);

    if (index > -1) {
      expandedRowKeys.value.splice(index, 1);
      expandedRowSet.value.delete(key);
    }
    else {
      expandedRowKeys.value.push(key);
      expandedRowSet.value.add(key);
    }
  }

  return {
    treeMate,
    expandedRowSet,
    displayedData,
    updateExpanded,
  };
}
