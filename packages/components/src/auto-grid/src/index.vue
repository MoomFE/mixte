<template>
  <Render />
</template>

<script lang="tsx" setup>
  import type { CSSProperties, VNodeChild } from 'vue';
  import { computed, onBeforeUpdate, ref } from 'vue';
  import { flatten } from 'naive-ui/es/_utils/vue/flatten';
  import { useAutoGrid } from '../../list-auto-grid/src/composables/useAutoGrid';
  import type { AutoGridProps, AutoGridSlots } from './types';

  const props = defineProps<AutoGridProps>();
  const slots = defineSlots<AutoGridSlots>();

  const { rootRef, collapsedRows, columnCount, rootStyle } = useAutoGrid(props);

  /** 所有子元素 */
  const children = computed(() => {
    return flatten((slots.default?.() as unknown as VNodeChild[]) ?? []);
  });

  /**
   * 外部函数式组件无法监听到组件插槽变化, 需要强制函数式组件重新渲染
   * @see https://github.com/vuejs/core/issues/11227
   */
  const hasOverflowSuffixSlot = ref(!!slots.overflowSuffix);

  onBeforeUpdate(() => {
    hasOverflowSuffixSlot.value = !!slots.overflowSuffix;
  });

  /** 真实需要渲染的子元素 */
  const renderChildren = computed(() => {
    let renderChildren = children.value;

    if (props.collapsed) {
      const rowsChildrenLength = collapsedRows.value * columnCount.value;

      renderChildren = renderChildren.slice(0, rowsChildrenLength);

      if (children.value.length > rowsChildrenLength) {
        hasOverflowSuffixSlot.value; // eslint-disable-line ts/no-unused-expressions
        if (slots.overflowSuffix)
          renderChildren.splice(-1, 1, slots.overflowSuffix!() as any);
      }
    }

    return renderChildren;
  });

  const finalRootStyle = computed<CSSProperties>(() => {
    if (props.fluid && (children.value.length < columnCount.value)) {
      return {
        ...rootStyle.value,
        gridTemplateColumns: `repeat(${children.value.length}, 1fr)`,
      };
    }

    return rootStyle.value;
  });

  function Render() {
    return (
      <div ref={rootRef} class="mixte-auto-grid" style={finalRootStyle.value}>
        {renderChildren.value.map(Node => <div style="overflow: hidden">{Node}</div>)}
      </div>
    );
  }

  defineExpose({
    /** 每行可以渲染的子元素数量 */
    columnCount,
    /** 子元素是否折叠 */
    isCollapsed: computed(() => {
      return props.collapsed && children.value.length > collapsedRows.value * columnCount.value;
    }),
  });
</script>
