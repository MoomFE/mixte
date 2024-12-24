<template>
  <EditorContent class="mixte-tiptap-editor-wrap" :editor="editor" />
</template>

<script lang="ts" setup>
  import type { TiptapEditorProps } from './types';
  import { useStore } from '@mixte/snippets/tiptap-editor/config-provider-Injection-state';
  import Underline from '@tiptap/extension-underline';
  import StarterKit from '@tiptap/starter-kit';
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

  defineProps<TiptapEditorProps>();

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  const editor = useStore()?.editor ?? ref<Editor>();

  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        StarterKit,
        Underline,
      ],
      editorProps: {
        attributes: { class: 'mixte-tiptap-editor' },
      },
      injectCSS: true,
      content: value.value,
      onUpdate: () => {
        value.value = editor.value!.getHTML();
      },
    });

    watch(value, () => {
      const isSame = editor.value?.getHTML() === value.value;

      if (!isSame) {
        editor.value?.commands.setContent(value.value, false);
      }
    });
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });
</script>
