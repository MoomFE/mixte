<template>
  <TiptapEditor v-model="value" />
</template>

<script lang="ts" setup>
  import { TiptapEditor } from '@mixte/snippets/tiptap-editor';
  import '@mixte/snippets/dist/tiptap-editor/css/index.scss';

  const value = ref('<p>🎉 Hello, World!</p>');
</script>
