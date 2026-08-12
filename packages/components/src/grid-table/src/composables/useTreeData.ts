import { watchDeep } from '@mixte/use';
import { createInjectionState } from '@vueuse/core';
import { createTreeMate } from 'treemate';
import { computed, readonly, ref, watch } from 'vue';
import { isSameKeySet } from '../utils';
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
  /** 所有可展开的行主键集合 */
  const allExpandableRowKeySet = computed(() => new Set(allExpandableRowKeys.value));
  /** 是否存在可展开的行 */
  const hasExpandableRows = computed(() => allExpandableRowKeys.value.length > 0);

  /**
   * 展开的行主键集合
   *  - 显示以集合为准
   *  - 对外模型是 v-model 契约, 父组件 prop 更新前读取到的可能是旧值, 因此显示不能直接依赖它
   *  - 初始值同样需要规范化, 避免脏 key 在后续操作中被带入集合与模型
   */
  const expandedRowKeySet = ref(new Set<string>(normalizeRowKeys(expandedRowKeys.value)));

  /** 应用展开集合 ( 不触碰对外模型 ) */
  function applyExpandedRowKeySet(keys: Set<string> | string[]) {
    expandedRowKeySet.value = new Set(keys);
  }

  /**
   * 同步集合与对外模型
   *  - 内部修改的统一入口, 会 emit 通知父组件
   *  - 内容一致时不重复更新, 避免无意义的重渲染与 emit
   *  - 例外: 模型 → 集合方向由下方 watchDeep 直接维护集合
   */
  function syncExpandedRowKeys(keys: Set<string> | string[]) {
    const keySet = new Set(keys);

    if (isSameKeySet(keySet, expandedRowKeySet.value)) return;

    applyExpandedRowKeySet(keySet);
    expandedRowKeys.value = [...keySet];
  }

  /**
   * 规范化展开的行主键列表
   *  - 幂等 ( Set 去重保插入顺序, 与 isSameRowKeys 保序比较配合, 回写不会造成循环 )
   */
  function normalizeRowKeys(keys: string[]): string[] {
    const expandable = allExpandableRowKeySet.value;
    return [...new Set(keys)].filter(key => expandable.has(key));
  }

  /** 判断两个 keys 列表是否一致 ( 保序, 需与 normalizeRowKeys 的保序去重配合 ) */
  function isSameRowKeys(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((key, index) => key === b[index]);
  }

  // 父组件更新时同步集合, 规范化后按需回写模型 ( 回写幂等, 不会造成循环 )
  watchDeep(expandedRowKeys, (newKeys: string[]) => {
    const normalizedKeys = normalizeRowKeys(newKeys);

    if (!isSameRowKeys([...expandedRowKeySet.value], normalizedKeys)) {
      applyExpandedRowKeySet(normalizedKeys);
    }

    if (!isSameRowKeys(newKeys, normalizedKeys)) {
      expandedRowKeys.value = normalizedKeys;
    }
  });

  // 数据变化时, 移除不在新数据中的 keys
  watch(allExpandableRowKeys, () => {
    const currentKeys = [...expandedRowKeySet.value];
    const normalizedKeys = normalizeRowKeys(currentKeys);

    if (!isSameRowKeys(currentKeys, normalizedKeys)) {
      syncExpandedRowKeys(normalizedKeys);
    }
  });

  /**
   * 更新行展开状态
   * @private
   */
  function updateExpanded(key: string) {
    // 不可展开的行不处理, 避免将非树形数据的 key 写入集合与模型
    if (!allExpandableRowKeySet.value.has(key)) return;

    const keySet = new Set(expandedRowKeySet.value);

    if (keySet.has(key)) keySet.delete(key);
    else keySet.add(key);

    syncExpandedRowKeys(keySet);
  }

  const displayedData = computed(() => {
    return treeMate.value.getFlattenedNodes([...expandedRowKeySet.value]);
  });

  /** 展开所有行 */
  function expandAllRows() {
    syncExpandedRowKeys(allExpandableRowKeys.value);
  }
  /** 折叠所有行 */
  function collapseAllRows() {
    syncExpandedRowKeys([]);
  }

  /** 展开指定行 */
  function expandRows(keys: string[]) {
    if (!keys.length) return;

    const keySet = new Set(expandedRowKeySet.value);

    keys.forEach((key) => {
      if (allExpandableRowKeySet.value.has(key)) keySet.add(key);
    });

    syncExpandedRowKeys(keySet);
  }
  /** 折叠指定行 */
  function collapseRows(keys: string[]) {
    if (!keys.length) return;

    const keySet = new Set(expandedRowKeySet.value);

    keys.forEach((key) => {
      keySet.delete(key);
    });

    syncExpandedRowKeys(keySet);
  }

  return {
    hasExpandableRows,
    expandedRowKeySet: readonly(expandedRowKeySet),
    displayedData,
    updateExpanded,

    expandAllRows,
    expandRows,
    collapseAllRows,
    collapseRows,
  };
});
