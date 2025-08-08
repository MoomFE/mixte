import { watchDeep, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState } from '@vueuse/core';
import { createTreeMate } from 'treemate';
import { computed, ref, shallowRef, watch } from 'vue';
import { useShared } from './useShared';

export const [
  useTreeDataStore,
  useTreeData,
] = createInjectionState(() => {
  const { props, rowKey, childrenKey, expandedRowKeys } = useShared()!;

  const treeMate = computed(() => {
    return createTreeMate<Record<string, any>>(props.data ?? [], {
      ignoreEmptyChildren: true,
      getKey: row => row[rowKey.value],
      getChildren: row => row[childrenKey.value as string],
      getIsGroup: () => false,
    });
  });

  /** 所有可展开的行主键列表 */
  const allExpandableRowKeys = computed(() => treeMate.value.getNonLeafKeys() as string[]);
  /** 是否存在可展开的行 */
  const hasExpandableRows = computed(() => allExpandableRowKeys.value.length > 0);

  /** 树形数据展开的行主键列表 */
  const expandedRowSet = ref(new Set(expandedRowKeys.value));

  const watchExpandedRowKeys = shallowRef(true);

  wheneverEffectScopeImmediate(watchExpandedRowKeys, () => {
    // 父组件更新时, 更新 set 并且移除非树形数据的 keys
    watchDeep(expandedRowKeys, (newKeys: string[]) => {
      expandedRowSet.value = new Set(newKeys);

      if (newKeys.length) {
        newKeys.forEach((key) => {
          if (!allExpandableRowKeys.value.includes(key)) expandedRowSet.value.delete(key);
        });

        if (newKeys.length !== expandedRowSet.value.size) {
          watchExpandedRowKeys.value = false;
          expandedRowKeys.value = [...expandedRowSet.value];
          watchExpandedRowKeys.value = true;
        }
      }
    });

    // 数据变化时, 移除不在新数据中的 keys
    watch(allExpandableRowKeys, () => {
      const size = expandedRowSet.value.size;

      expandedRowSet.value.forEach((key) => {
        if (!allExpandableRowKeys.value.includes(key)) expandedRowSet.value.delete(key);
      });

      if (size !== expandedRowSet.value.size) {
        expandedRowKeys.value = [...expandedRowSet.value];
      }
    });
  });

  /**
   * 更新行展开状态
   * @private
   */
  function updateExpanded(key: string) {
    watchExpandedRowKeys.value = false;

    const index = expandedRowKeys.value.indexOf(key);

    if (index > -1) {
      expandedRowKeys.value.splice(index, 1);
      expandedRowSet.value.delete(key);
    }
    else {
      expandedRowKeys.value.push(key);
      expandedRowSet.value.add(key);
    }

    watchExpandedRowKeys.value = true;
  }

  const displayedData = computed(() => {
    // 直接使用 expandedRowKeys.value 不知为什么没有被收集依赖
    // 当 expandedRowKeys.value 改变时, computed 不会重新计算, 等有空再研究
    return treeMate.value.getFlattenedNodes([...expandedRowSet.value]);
  });

  /** 展开所有行 */
  function expandAllRows() {
    watchExpandedRowKeys.value = false;

    const allKeys = allExpandableRowKeys.value.slice();

    expandedRowKeys.value = allKeys;
    expandedRowSet.value = new Set(allKeys);

    watchExpandedRowKeys.value = true;
  }
  /** 折叠所有行 */
  function collapseAllRows() {
    watchExpandedRowKeys.value = false;

    expandedRowKeys.value = [];
    expandedRowSet.value.clear();

    watchExpandedRowKeys.value = true;
  }

  /** 展开指定行 */
  function expandRows(keys: string[]) {
    if (!keys.length) return;

    watchExpandedRowKeys.value = false;

    keys.forEach((key) => {
      if (allExpandableRowKeys.value.includes(key)) expandedRowSet.value.add(key);
    });

    expandedRowKeys.value = [...expandedRowSet.value];

    watchExpandedRowKeys.value = true;
  }
  /** 折叠指定行 */
  function collapseRows(keys: string[]) {
    if (!keys.length) return;

    watchExpandedRowKeys.value = false;

    keys.forEach((key) => {
      if (expandedRowSet.value.has(key)) expandedRowSet.value.delete(key);
    });

    expandedRowKeys.value = [...expandedRowSet.value];

    watchExpandedRowKeys.value = true;
  }

  return {
    treeMate,
    hasExpandableRows,
    expandedRowSet,
    displayedData,
    updateExpanded,

    expandAllRows,
    expandRows,
    collapseAllRows,
    collapseRows,
  };
});
