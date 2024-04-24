<template>
  <CamelCase :fn="upperFirst" fn-name="upperFirst" />
</template>

<script lang="ts" setup>
  import { upperFirst } from 'mixte';
  import CamelCase from './camelCase.vue';
</script>
