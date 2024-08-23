<template>
  <div ref="rootRef" :style="rootStyle">
    <div v-for="(item, index) in list" :key="index" style="overflow: hidden">
      <slot :item="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAutoGrid } from './composables/useAutoGrid';

  // @unocss-ignore

  interface ListAutoGridProps {
    /** 列表数据 */
    list: any[];
    /**
     * 组件宽度 (单位: px)
     *  - 正常情况无需使用, 会自动获取组件宽度
     */
    width?: number | `${number}`;
    /** 子元素最小宽度 (单位: px) */
    itemWidth?: number | `${number}`;
    /** 横纵间距 (单位: px) */
    gap?: number | `${number}`;
    /** 横向间距 (单位: px) */
    gapX?: number | `${number}`;
    /** 纵向间距 (单位: px) */
    gapY?: number | `${number}`;
  }

  const props = withDefaults(defineProps<ListAutoGridProps>(), {
    list: () => [],
  });

  const {
    rootRef,
    rootStyle,
  } = useAutoGrid(props);
</script>
