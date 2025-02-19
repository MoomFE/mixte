<!--
  组件配置
    - 展现当前激活组件的配置项
-->

<template>
  <div class="mixte-lce-component-config">
    <Config v-if="Config" :key="activeComponentConfig!.id" v-model:config="activeComponentConfig" />
    <template v-else>
      {{ activeComponentConfig }}
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useEditor, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { computed } from 'vue';

  const { componentsInfo } = useStore()!;
  const { activeComponentConfig } = useEditor()!;

  const Config = computed(() => {
    if (!activeComponentConfig.value?.name) return;
    return componentsInfo.value?.[activeComponentConfig.value.name].componentConfig;
  });
</script>
