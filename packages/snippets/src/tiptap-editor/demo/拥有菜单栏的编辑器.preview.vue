<template>
  <TiptapEditorConfigProvider>
    <TiptapEditorMenu />
    <TiptapEditorBubbleMenu />
    <TiptapEditor v-model="value" />
  </TiptapEditorConfigProvider>
</template>

<script lang="ts" setup>
  import { TiptapEditor } from '@mixte/snippets/tiptap-editor';
  import { TiptapEditorBubbleMenu } from '@mixte/snippets/tiptap-editor/bubble-menu';
  import { TiptapEditorConfigProvider } from '@mixte/snippets/tiptap-editor/config-provider';
  import { TiptapEditorMenu } from '@mixte/snippets/tiptap-editor/menu';
  import '@mixte/snippets/dist/tiptap-editor/css/index.scss';

  const value = ref('<p>🎉 Hello, World!</p>');
</script>
