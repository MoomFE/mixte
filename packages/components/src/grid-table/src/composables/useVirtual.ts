import type { TreeNode } from 'treemate';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { watchImmediate, wheneverEffectScopeImmediate, wheneverImmediate } from '@mixte/use';
import { createInjectionState, useCssVar, useElementSize } from '@vueuse/core';
import { computed, onMounted, ref, toValue, watch } from 'vue';
import { createHeightCache } from './createHeightCache';
import { useShared } from './useShared';
import { useTreeData } from './useTreeData';

/** 测量源 ( 行高的测量方式, 可注入以便测试 ) */
export type MeasureSource = (target: MaybeRefOrGetter<HTMLElement | undefined>) => Ref<number>;

/** 默认测量源 ( 基于 DOM 元素的实际尺寸 ) */
const domMeasureSource: MeasureSource = (target) => {
  return useElementSize(target, undefined, { box: 'border-box' }).height;
};

export const [
  useVirtualStore,
  useVirtual,
] = createInjectionState((options?: {
  /** 测量源 ( 默认为 DOM 测量 ) */
  measureSource?: MeasureSource;
}) => {
  const {
    props,

    isModernRenderMode,

    overscan,
    estimatedRowHeight,
    fixedRowHeight,

    tableWrapSize,
    tableWrapScroll,

    tableRef,

    tableTheadHeight,
  } = useShared()!;

  const { displayedData } = useTreeData()!;

  /** 测量源 */
  const measureSource = options?.measureSource ?? domMeasureSource;

  /** 行高变更信号 */
  const heightsVersion = ref(0);

  /** 累计高度缓存 */
  const heightCache = createHeightCache({
    getData: () => displayedData.value,
    getEstimated: () => estimatedRowHeight.value,
    getFixed: () => fixedRowHeight.value,
  });

  /** 累计高度数组 ( 响应式 ) */
  const heights = computed(() => {
    // 读取版本号建立依赖, 行高变更时失效重算
    void heightsVersion.value;

    // 缓存通过 getter 读取响应式值 ( displayedData / fixedRowHeight / estimatedRowHeight ), 其变化也会使本计算失效重算
    return heightCache.getHeights();
  });

  /** 表格展示区高度 */
  const tableBodyHeight = computed(() => {
    return tableWrapSize.height - tableTheadHeight.value;
  });

  /** 可见行的起始索引 */
  const visibleStart = computed(() => {
    return Math.max(0, findIndexByHeight(tableWrapScroll.y) - overscan.value);
  });

  /** 可见行的结束索引 */
  const visibleEnd = computed(() => {
    return Math.min(
      displayedData.value.length ?? 0,
      findIndexByHeight(tableWrapScroll.y + tableBodyHeight.value) + 1 + overscan.value,
    );
  });

  /** 可见行数据 */
  const data = computed(() => {
    if (!props.virtual) return;

    return displayedData.value.slice(visibleStart.value, visibleEnd.value) ?? [];
  });

  /** 表格高度 */
  const tableHeight = useCssVar('--mixte-gt-virtual-h', tableRef);
  const tableHeightWillChange = useCssVar('--mixte-gt-virtual-h-wc', tableRef);
  /** 表格表体单元格高度 */
  const tableTdHeight = useCssVar('--mixte-gt-virtual-td-h', tableRef);
  /** 表格顶部不可见区域高度 ( 虚拟表格占位 ) */
  const tablePlaceholderHeight = useCssVar('--mixte-gt-virtual-ph', tableRef);

  wheneverEffectScopeImmediate(() => props.virtual, (_, __, onCleanup) => {
    watchImmediate(() => heights.value[heights.value.length - 1], (totalHeight) => {
      tableHeight.value = `${totalHeight}px`;
    });

    watchImmediate(visibleStart, (start) => {
      tablePlaceholderHeight.value = `${heights.value[start] || 0}px`;
    });

    wheneverImmediate(fixedRowHeight, () => {
      tableTdHeight.value = `${fixedRowHeight.value}px`;
    });

    watch(() => tableWrapScroll.isScrolling, (isScrolling) => {
      tableHeightWillChange.value = isScrolling ? (isModernRenderMode.value ? 'padding-top' : 'height') : undefined;
    }, {
      flush: 'sync',
    });

    onCleanup(() => {
      tableHeight.value = undefined;
      tableHeightWillChange.value = undefined;
      tableTdHeight.value = undefined;
      tablePlaceholderHeight.value = undefined;
    });
  });

  /**
   * 更新行高度
   * - 统一处理缓存更新与失效信号递增, 调用方无需关心
   */
  function updateRowHeight(index: number, rowObj: object, height: number) {
    if (heightCache.updateHeight(index, rowObj, height)) {
      heightsVersion.value++;
    }
  }

  /**
   * 测量行高
   * - 由单元格组件调用
   * - 仅在虚拟列表且为第一列且未设置固定行高时进行测量
   */
  function useRowMeasure(
    node: MaybeRefOrGetter<TreeNode<any>>,
    index: MaybeRefOrGetter<number>,
    columnIndex: MaybeRefOrGetter<number>,
  ) {
    /** 行元素 */
    const rowRef = ref<HTMLElement>();

    /** 是否需要测量 ( 虚拟列表首列且未设置固定行高时 ) */
    const needMeasure = computed(() => {
      return props.virtual && toValue(columnIndex) === 0 && fixedRowHeight.value == null;
    });

    /**
     * 行元素 ref 设置
     * - 函数形式, 兼容 Vue 3.5 的模板 ref 处理
     * - 卸载时 Vue 会以 null 调用, 同时清空 rowRef
     */
    function setRowRef(el: unknown) {
      rowRef.value = el as HTMLElement | undefined;
    }

    onMounted(() => {
      wheneverEffectScopeImmediate(needMeasure, () => {
        const height = measureSource(rowRef);

        watch(height, (height) => {
          updateRowHeight(toValue(index), toValue(node).rawNode, height);
        });
      });
    });

    return {
      rowRef,
      setRowRef,
    };
  }

  /**
   * 根据高度二分查找索引 ( 响应式, 行高变更时失效重算 )
   */
  function findIndexByHeight(height: number) {
    return heightCache.findIndexByHeight(height, heights.value);
  }

  return {
    visibleStart,

    data,

    findIndexByHeight,

    useRowMeasure,
  };
});
