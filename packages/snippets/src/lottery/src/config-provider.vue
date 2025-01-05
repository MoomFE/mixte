<template>
  <slot />
</template>

<script lang="ts" setup>
  import { useProvideStore } from '@mixte/snippets/lottery/config-provider-Injection-state';

  useProvideStore();
</script>
