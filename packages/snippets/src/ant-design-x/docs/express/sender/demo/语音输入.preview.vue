<template>
  <Sender
    allow-speech
    @submit="() => {
      ElMessage.success('Send message successfully!');
    }"
  />
</template>

<script lang="ts" setup>
  import { Sender } from '@mixte/snippets/ant-design-x';
  import { ElMessage } from 'element-plus';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';
</script>
