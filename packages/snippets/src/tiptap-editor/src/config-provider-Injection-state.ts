/// <reference types="@tiptap/starter-kit" />
/// <reference types="@tiptap/extension-underline" />

import type { Editor } from '@tiptap/vue-3';
import { createInjectionState } from '@vueuse/core';
import { ref } from 'vue';

export const [
  useProvideStore,
  useStore,
] = createInjectionState(() => {
  const editor = ref<Editor>();

  return {
    editor,
  };
});
