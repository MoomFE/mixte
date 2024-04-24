<template>
  <CamelCase :fn="lowerFirst" fn-name="lowerFirst" default-input="Foo-Bar-Baz" />
</template>

<script lang="ts" setup>
  import { lowerFirst } from 'mixte';
  import CamelCase from './camelCase.vue';
</script>
