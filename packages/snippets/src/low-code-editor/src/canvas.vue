<!--
  画布
    - 提供网格, 标尺等功能
-->

<template>
  <div class="mixte-lce-canvas">
    <div class="mixte-lcec-content">
      <LowCodeEditorPreview class="mixte-lcecc-preview" />
    </div>
  </div>

  <!-- 组件边框线 -->
  <!-- <BorderView /> -->
</template>

<script lang="ts" setup>
  import { useComponentStore, usePreviewStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { LowCodeEditorPreview } from '@mixte/snippets/low-code-editor/preview';
  import BorderView from './components/editor/border-view.vue';
  import SlotPlaceholder from './components/editor/slot-placeholder.vue';
  import Slot from './components/editor/slot.vue';

  usePreviewStore({ Slot });
  useComponentStore({ SlotPlaceholder });
</script>
