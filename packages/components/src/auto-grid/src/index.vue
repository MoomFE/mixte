<template>
  <Render />
</template>

<script lang="tsx" setup>
  import { computed, onBeforeUpdate, ref } from 'vue';
  import { flatten } from 'naive-ui/es/_utils/vue/flatten';
  import { useAutoGrid } from '../../list-auto-grid/src/composables/useAutoGrid';
  import type { AutoGridProps, AutoGridSlots } from './types';

  const props = defineProps<AutoGridProps>();
  const slots = defineSlots<AutoGridSlots>();

  const { rootRef, collapsedRows, length, rootStyle } = useAutoGrid(props);

  /** 所有子元素 */
  const children = computed(() => {
    return flatten(slots.default?.() ?? []);
  });

  /**
   * 外部函数式组件无法监听到组件插槽变化, 需要强制函数式组件重新渲染
   * @see https://github.com/vuejs/core/issues/11227
   */
  const hasOverflowSuffixSlot = ref(!!slots.overflowSuffix);

  onBeforeUpdate(() => {
    hasOverflowSuffixSlot.value = !!slots.overflowSuffix;
  });

  function Render() {
    let renderChildren = children.value;

    if (props.collapsed) {
      const rowsChildrenLength = collapsedRows.value * length.value;

      renderChildren = renderChildren.slice(0, rowsChildrenLength);

      if (children.value.length > rowsChildrenLength) {
        hasOverflowSuffixSlot.value; // eslint-disable-line ts/no-unused-expressions
        if (slots.overflowSuffix)
          renderChildren.splice(-1, 1, slots.overflowSuffix!() as any);
      }
    }

    return (
      <div ref={rootRef} class="mixte-auto-grid" style={rootStyle.value}>
        {renderChildren.map(Node => <div style="overflow: hidden">{Node}</div>)}
      </div>
    );
  }
</script>
