<!--
  组件配置
    - 展现当前激活组件的配置项
-->

<template>
  <div class="mixte-lce-component-config" w-full>
    {{ activeComponentConfig }}
  </div>
</template>

<script lang="ts" setup>
  import { useEditor } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  const { activeComponentConfig } = useEditor()!;
</script>
