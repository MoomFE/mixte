<template>
  <Sender
    submit-type="shiftEnter"
    placeholder="Press Shift + Enter to send message"
    @submit="() => {
      ElMessage.success('Send message successfully!');
    }"
  >
    <template #header>
      123
    </template>
  </Sender>
</template>

<script lang="ts" setup>
  import { Sender } from '@mixte/snippets/ant-design-x';
  import { ElMessage } from 'element-plus';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';
</script>
