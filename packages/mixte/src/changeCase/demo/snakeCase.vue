<template>
  <CamelCase :fn="snakeCase" fn-name="snakeCase" default-input="fooBarBaz" />
</template>

<script lang="ts" setup>
  import { snakeCase } from 'mixte';
  import CamelCase from './camelCase.vue';
</script>
