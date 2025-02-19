<template>
  config: {{ config }}
</template>

<script lang="ts" setup>
  import type { config } from './config';

  defineProps<{ config: typeof config }>();
</script>
