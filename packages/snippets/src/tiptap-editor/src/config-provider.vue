<template>
  <div class="mixte-tiptap-editor-config-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { useProvideStore } from '@mixte/snippets/tiptap-editor/config-provider-Injection-state';

  useProvideStore();
</script>
