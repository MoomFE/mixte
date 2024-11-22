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
  import { isVue2, toRef, unref, useSlots } from 'vue-demi';
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

  // 为了在 Vue3 中拥有更好的类型推导, 但是 Vue2 并不支持这个 API, 先这样兼容一下
  let oldDefineSlots: any;

  if (isVue2) { // @ts-expect-error
    oldDefineSlots = globalThis.defineSlots; // @ts-expect-error
    globalThis.defineSlots = useSlots;
  }

  // eslint-disable-next-line vue/define-macros-order
  defineSlots<{
    default: (props: { item: T extends object[] ? T[number] : number; index: number }) => any;
  }>();

  if (isVue2) { // @ts-expect-error
    globalThis.defineSlots = oldDefineSlots;
  }

  const list = toRef(props, 'list');

  const {
    rootRef,
    rootStyle,
  } = useAutoGrid(props);
</script>
