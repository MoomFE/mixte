<template>
  <Demo
    :fn="isCitizenID"
    fn-name="isCitizenID"
    default-value="360602199901239999"
  />
</template>

<script lang="ts" setup>
  import { isCitizenID } from '@mixte/validator';
  import Demo from '../mobile/demo.vue';
</script>
