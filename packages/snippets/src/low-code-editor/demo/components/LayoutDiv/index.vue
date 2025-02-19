<template>
  <div>
    <SlotPlaceholder />
  </div>
</template>

<script lang="ts" setup>
  import { useComponent } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  const SlotPlaceholder = useComponent()?.SlotPlaceholder;
</script>
