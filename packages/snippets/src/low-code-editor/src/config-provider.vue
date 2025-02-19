<!--
  全局配置
    - 用于接受全局配置, 将全局配置传递给子组件
-->

<template>
  <div class="mixte-lce-config-provider">
    <slot />
  </div>
</template>

<script
  setup
  lang="ts"
  generic="Config extends Record<string, any> = Record<string, any>"
>
  import type { ComponentConfig, LowCodeEditorProps } from '@mixte/snippets/low-code-editor/types';
  import { useProvideStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  const props = defineProps<LowCodeEditorProps<Config>>();

  const list = defineModel<ComponentConfig<Config>[]>('list', {
    default: () => [],
  });

  useProvideStore(props, list);
</script>
