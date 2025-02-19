<!--
  编辑器模式下, 组件插槽内容的渲染
    - 编辑时, 需使用 vuedraggable 进行渲染
-->

<template>
  <VueDraggable
    v-model="list"
    :group="{ name: 'component', pull: true, put: true }"
    :animation="150"
    :force-fallback="true"
    :fallback-tolerance="10"
    @start="onDragStart"
    @end="() => dragComponentId = undefined"
    @add="onAdd"
  >
    <template v-for="config in list" :key="config.id">
      <ComponentWrap :config>
        <component
          :is="componentsInfo?.[config.name].component"
          :config
        />
      </ComponentWrap>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';
  import type { DraggableEvent } from 'vue-draggable-plus';
  import { useEditor, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { nextTick } from 'vue';
  import { VueDraggable } from 'vue-draggable-plus';
  import ComponentWrap from './component-wrap.vue';

  const list = defineModel<ComponentConfig<any>[]>('list', {
    default: () => [],
  });

  const { componentsInfo } = useStore()!;
  const { dragComponentId, activeComponentId } = useEditor()!;

  function onAdd(event: DraggableEvent<ComponentConfig<any>>) {
    nextTick(() => {
      activeComponentId.value = event.clonedData.id;
    });
  }

  function onDragStart(event: DraggableEvent<ComponentConfig<any>>) {
    dragComponentId.value = event.data.id;
  }
</script>
