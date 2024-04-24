<template>
  <CamelCase :fn="pascalCase" fn-name="pascalCase" />
</template>

<script lang="ts" setup>
  import { pascalCase } from 'mixte';
  import CamelCase from './camelCase.vue';
</script>
