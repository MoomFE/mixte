<template>
  <Render />
</template>

<script
  setup
  lang="tsx"
  generic="T extends any[] | number | undefined = undefined"
>
  import type { CSSProperties, VNodeChild } from 'vue';
  import type { AutoGridProps, AutoGridSlots } from './types';
  import { isFunction, isNumber } from 'mixte';
  import { flatten } from 'naive-ui/es/_utils/vue/flatten';
  import { computed, onBeforeUpdate, ref } from 'vue';
  import { useAutoGrid } from './composables/useAutoGrid';

  const props = defineProps<AutoGridProps<T>>();
  const slots = defineSlots<AutoGridSlots<T>>();

  const { rootRef, collapsedRows, columnCount, rootStyle } = useAutoGrid(props);

  /** 所有子元素 */
  const children = computed(() => {
    if (Array.isArray(props.list))
      return props.list!.map((item, index) => () => slots.default?.({ item, index }) ?? item);
    if (isNumber(props.list))
      return Array.from({ length: props.list! }).map((_, index) => () => slots.default?.({ item: index + 1, index }) ?? index);

    // @ts-expect-error
    return flatten((slots.default?.() as unknown as VNodeChild[]) ?? []);
  });

  /**
   * 响应式无法监听到组件插槽变化, 需要强制使响应式重新计算
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
        {
          renderChildren.value.map((child, index) => (
            <div style="overflow: hidden" key={index}>{isFunction(child) ? child() : child}</div>
          ))
        }
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
