import type { LowCodeEditorProps } from '@mixte/snippets/low-code-editor/types';
import { createInjectionState } from '@vueuse/core';
import { toRef } from 'vue';

export const [
  useProvideStore,
  useStore,
] = createInjectionState(<Config extends Record<string, any>>(props: LowCodeEditorProps<Config>) => {
  const componentsInfo = toRef(props, 'componentsInfo');
  const list = toRef(props, 'list');

  const groupList = toRef(props, 'groupList');

  return {
    componentsInfo,
    list,
    groupList,
  };
});
