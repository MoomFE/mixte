<template>
  <Sender v-model="value" />

  <div flex items-center gap-2 mt-2>
    value:
    <el-input v-model="value" placeholder="双向绑定演示" />
  </div>
</template>

<script lang="ts" setup>
  import { Sender } from '@mixte/snippets/ant-design-x';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const value = ref('');
</script>
