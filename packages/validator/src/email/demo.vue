<template>
  <Demo
    :fn="isEmail"
    fn-name="isEmail"
    default-value="test@example.com"
  />
</template>

<script lang="ts" setup>
  import { isEmail } from '@mixte/validator';
  import Demo from '../mobile/demo.vue';
</script>
