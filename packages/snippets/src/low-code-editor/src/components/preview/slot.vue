<!--
  预览模式下, 组件列表的遍历渲染层
-->

<template>
  <template v-for="config in list" :key="config.id">
    <component
      :is="componentsInfo?.[config.name]?.component ?? EmptyComponent"
      :config
    />
  </template>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';
  import { useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  const list = defineModel<ComponentConfig<any>[]>('list', {
    default: () => [],
  });

  const { componentsInfo } = useStore()!;

  function EmptyComponent({ config }: { config: ComponentConfig<any> }) {
    console.error(`${config.name} ( ${config.displayName} ) 组件未注册`);
  }
</script>
