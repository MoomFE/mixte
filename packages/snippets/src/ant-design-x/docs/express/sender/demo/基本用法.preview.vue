<template>
  <el-space w-full direction="vertical" fill>
    <Sender
      v-model="value"
      :loading
      @submit="onSubmit"
      @cancel="onCancel"
    />
    <Sender model-value="Force as loading" loading read-only />
    <Sender model-value="Set to disabled" disabled />
  </el-space>
</template>

<script lang="ts" setup>
  import { Sender } from '@mixte/snippets/ant-design-x';
  import { wheneverEffectScope } from '@mixte/use';
  import { useTimeoutFn } from '@vueuse/core';
  import { ElMessage } from 'element-plus';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const value = ref('Hello? this is X!');
  const loading = ref(false);

  wheneverEffectScope(loading, () => {
    useTimeoutFn(() => {
      loading.value = false;
      ElMessage.success('Send message successfully!');
    }, 3000);
  });

  function onSubmit() {
    value.value = '';
    loading.value = true;
    ElMessage.info('Send message!');
  }

  function onCancel() {
    loading.value = false;
    ElMessage.info('Cancel sending!');
  }
</script>
