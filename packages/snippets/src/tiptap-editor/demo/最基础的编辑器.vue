<template>
  <TiptapEditor
    v-model="value"
    :extensions="[StarterKit]"
  />
</template>

<script lang="ts" setup>
  import { TiptapEditor } from '@mixte/snippets/tiptap-editor';
  import StarterKit from '@tiptap/starter-kit';
  import '../src/css/reset.scss';

  const value = ref('🎉 Hello, World!');
</script>
