<!--
  画布
-->

<template>
  <div class="mixte-lce-canvas">
    <div class="mixte-lcec-content-wrap">
      <div class="mixte-lcec-content">
        <LowCodeEditorPreview class="mixte-lcecc-preview" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useComponentStore, usePreviewStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { LowCodeEditorPreview } from '@mixte/snippets/low-code-editor/preview';
  import SlotPlaceholder from './components/editor/slot-placeholder.vue';
  import Slot from './components/editor/slot.vue';

  usePreviewStore({ Slot });
  useComponentStore({ SlotPlaceholder });
</script>
