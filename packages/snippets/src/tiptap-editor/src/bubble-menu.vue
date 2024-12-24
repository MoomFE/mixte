<template>
  <template v-if="editor">
    <BubbleMenu
      :editor
      :tippy-options="{ duration: 100 }"
    >
      <div class="mixte-tiptap-editor-bubble-menu">
        <TiptapEditorMenu
          :keys="['bold', 'italic', 'underline', 'strike', 'code']"
        />
      </div>
    </BubbleMenu>
  </template>
</template>

<script lang="ts" setup>
  import { useStore } from '@mixte/snippets/tiptap-editor/config-provider-Injection-state';
  import { TiptapEditorMenu } from '@mixte/snippets/tiptap-editor/menu';
  import { BubbleMenu } from '@tiptap/vue-3';

  const editor = useStore()?.editor;
</script>
