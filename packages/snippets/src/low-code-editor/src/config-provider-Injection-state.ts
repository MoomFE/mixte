import type { LowCodeEditorProps } from '@mixte/snippets/low-code-editor/types';
import { createInjectionState } from '@vueuse/core';
import { toRefs } from 'vue';

export const [
  useProvideStore,
  useStore,
] = createInjectionState(<Config extends Record<string, any>>(props: LowCodeEditorProps<Config>) => {
  return {
    ...toRefs(props),
  };
});
