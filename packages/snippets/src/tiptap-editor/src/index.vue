<template>
  <EditorContent class="mixte-tiptap-editor-wrap" :editor="editor" />
</template>

<script lang="ts" setup>
  import type { TiptapEditorProps } from './types';
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import { onBeforeUnmount, onMounted, ref } from 'vue';

  const props = defineProps<TiptapEditorProps>();

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  const editor = ref<Editor>();

  onMounted(() => {
    editor.value = new Editor({
      extensions: props.extensions,
      editorProps: {
        attributes: { class: 'mixte-tiptap-editor' },
      },
      injectCSS: true,
      content: value.value,
      onUpdate: () => {
        value.value = editor.value!.getHTML();
      },
    });
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });
</script>
