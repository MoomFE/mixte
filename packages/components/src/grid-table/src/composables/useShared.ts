import type { GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
import type { StyleValue } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '@mixte/components/grid-table/utils';
import { createInjectionState, useElementSize, useScroll } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { computed, reactive, ref, toValue, watch } from 'vue';

export const [
  useSharedStore,
  useShared,
] = createInjectionState((
  props: GridTableProps<any>,
  slots: GridTableSlots<any>,
) => {
  /** 表格行主键 */
  const rowKey = computed(() => {
    return toValue(props.rowKey) ?? 'id';
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
        else if (isNumeric(width)) gridTemplateColumns += `${width}px `;
        // 合法的宽度
        else if (CSS.supports('grid-template-columns', width)) gridTemplateColumns += `${width} `;
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

    rowKey,
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
