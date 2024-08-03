<template>
  <Render />
</template>

<script lang="tsx" setup>
  import { computed, onBeforeUpdate, ref } from 'vue';
  import { useElementSize } from '@vueuse/core';
  import { isNumeric } from 'mixte';
  import { flatten } from 'naive-ui/es/_utils/vue/flatten';
  import type { AutoGridProps, AutoGridSlots } from './types';

  const props = defineProps<AutoGridProps>();
  const slots = defineSlots<AutoGridSlots>();

  const rootRef = ref<HTMLElement>();
  const rootWidth = useElementSize(rootRef).width;

  const isCustomWidth = computed(() => isNumeric(props.width));
  const width = computed(() => isCustomWidth.value ? +props.width! : rootWidth.value);

  const itemWidth = computed(() => isNumeric(props.itemWidth) ? +props.itemWidth : width.value);
  const gap = computed(() => isNumeric(props.gap) ? +props.gap : 0);
  const gapX = computed(() => isNumeric(props.gapX) ? +props.gapX : gap.value);
  const gapY = computed(() => isNumeric(props.gapY) ? +props.gapY : gap.value);

  const collapsedRows = computed(() => isNumeric(props.collapsedRows) ? Math.max(1, +props.collapsedRows) : 1);

  /** 所有子元素 */
  const children = computed(() => {
    return flatten(slots.default?.() ?? []);
  });

  /** 每行渲染的子元素数量 */
  const length = computed(() => {
    return Math.floor((width.value + gapX.value) / (itemWidth.value + gapX.value)) || 1;
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
      <div
        ref={rootRef}
        style={{
          width: isCustomWidth.value ? `${props.width}px` : '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${length.value}, 1fr)`,
          columnGap: `${gapX.value}px`,
          rowGap: `${gapY.value}px`,
        }}
      >
        {renderChildren.map(Node => <div style="overflow: hidden">{Node}</div>)}
      </div>
    );
  }
</script>
