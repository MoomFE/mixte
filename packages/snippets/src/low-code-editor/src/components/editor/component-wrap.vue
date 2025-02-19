<!--
  编辑器模式下, 组件的包裹层
    - 包含组件选中时的边框线, 尺寸调整, 定位等功能
-->

<template>
  <div
    ref="rootRef"
    class="mixte-lce-component-wrap"
    :class="classes"
    @mousedown="activeComponentId = config.id"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';
  import { useEditor } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { whenever } from '@mixte/use';
  import { useElementHover } from '@vueuse/core';
  import { computed, onWatcherCleanup, ref } from 'vue';

  const props = defineProps<{ config: ComponentConfig<any> }>();

  const {
    dragComponentId,
    hoverComponentId,
    hoverComponentElement,
    activeComponentId,
    activeComponentElement,
  } = useEditor()!;

  const rootRef = ref<HTMLDivElement>();
  const rootHover = useElementHover(rootRef);

  const classes = computed(() => {
    // 当前组件为激活状态, 显示实线
    if (activeComponentId.value === props.config.id) return 'active';
    // 当前组件为拖拽状态, 显示虚线
    if (dragComponentId.value === props.config.id) return 'dragging';
    // 没有组件处于拖拽状态时, 鼠标悬停显示虚线
    if (!dragComponentId.value) return 'normal';
    return '';
  });

  whenever(rootHover, () => {
    hoverComponentId.value = props.config.id;
    hoverComponentElement.value = rootRef.value;

    onWatcherCleanup(() => {
      hoverComponentId.value = hoverComponentElement.value = undefined;
    });
  }, {
    flush: 'sync',
  });

  whenever(() => activeComponentId.value === props.config.id, () => {
    activeComponentElement.value = rootRef.value;
  }, {
    flush: 'sync',
  });
</script>
