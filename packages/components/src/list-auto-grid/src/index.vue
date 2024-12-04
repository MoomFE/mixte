<template>
  <div ref="rootRef" class="mixte-list-auto-grid" :style="unref(rootStyle)">
    <div v-for="(item, index) in list" :key="index" style="overflow: hidden">
      <slot :item="item" :index="index" />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T extends object[] | number"
>
  import { toRef, unref } from 'vue';
  import { useAutoGrid } from './composables/useAutoGrid';

  const props = defineProps<{
    /** 列表数据 */
    list?: T;
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
  }>();

  defineSlots<{
    default: (props: { item: T extends object[] ? T[number] : number; index: number }) => any;
  }>();

  const list = toRef(props, 'list');

  const {
    rootRef,
    rootStyle,
  } = useAutoGrid(props);
</script>
