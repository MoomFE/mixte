<template>
  <CamelCase :fn="kebabCase" fn-name="CamelCase" default-input="fooBarBaz" />
</template>

<script lang="ts" setup>
  import { kebabCase } from 'mixte';
  import CamelCase from './camelCase.vue';
</script>
