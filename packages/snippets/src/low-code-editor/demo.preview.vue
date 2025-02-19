<template>
  <TiptapEditorConfigProvider
    :components-info="componentsInfo"
  >
    <TiptapEditorComponentList />
  </TiptapEditorConfigProvider>
</template>

<script lang="ts" setup>
  import { TiptapEditorComponentList } from '@mixte/snippets/low-code-editor/component-list';
  import { TiptapEditorConfigProvider } from '@mixte/snippets/low-code-editor/config-provider';
  import { componentsInfo } from './demo/components/index';
</script>
