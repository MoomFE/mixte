<template>
  <LowCodeEditorConfigProvider
    v-model:list="list" :components-info :group-enum
    size-full min-h-88 relative
  >
    <LowCodeEditor>
      <div size-full absolute top-0 left-0 flex gap-2>
        <div w-60 h-full flex-none>
          <LowCodeEditorComponentList />
        </div>
        <LowCodeEditorCanvas />
        <div w-72 h-full flex-none>
          <LowCodeEditorConfig />
        </div>
      </div>

      <LowCodeEditorBorderView />
    </LowCodeEditor>
  </LowCodeEditorConfigProvider>
</template>

<script lang="ts" setup>
  import { LowCodeEditorBorderView } from '@mixte/snippets/low-code-editor/border-view';
  import { LowCodeEditorCanvas } from '@mixte/snippets/low-code-editor/canvas';
  import { LowCodeEditorComponentList } from '@mixte/snippets/low-code-editor/component-list';
  import { LowCodeEditorConfig } from '@mixte/snippets/low-code-editor/config';
  import { LowCodeEditorConfigProvider } from '@mixte/snippets/low-code-editor/config-provider';
  import { LowCodeEditor } from '@mixte/snippets/low-code-editor/editor';
  import { componentsInfo, groupEnum } from './demo/components/index';
  import '@mixte/snippets/dist/low-code-editor/css/editor.scss';

  const list = ref([]);
</script>
