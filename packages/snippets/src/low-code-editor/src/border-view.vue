<!--
  编辑器模式下, 组件边框线
-->

<template>
  <div
    v-if="activeComponentId"
    ref="rootRef"
    class="mixte-lce-border-view"
    :style
  >
    <div class="mixte-lcebv-tools">
      <button @click="deleteActive">
        <i-ant-design-delete-twotone class="size-4" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useEditor, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { useElementBounding } from '@vueuse/core';
  import { computed, reactive, ref } from 'vue';

  const { list } = useStore()!;
  const { activeComponentId, activeComponentElement } = useEditor()!;

  const rootRef = ref<HTMLDivElement>();

  const activeComponentRect = reactive(useElementBounding(activeComponentElement));

  const style = computed(() => {
    return {
      width: `${activeComponentRect.width}px`,
      height: `${activeComponentRect.height}px`,
      left: `${activeComponentRect.x}px`,
      top: `${activeComponentRect.y}px`,
    };
  });

  function deleteActive() {
    list.value.splice(
      list.value.findIndex(item => item.id === activeComponentId.value),
      1,
    );
    activeComponentId.value = activeComponentElement.value = undefined;
  }
</script>
