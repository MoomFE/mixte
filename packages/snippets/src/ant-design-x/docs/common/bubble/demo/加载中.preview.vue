<template>
  <Bubble
    :loading
    :avatar="{ icon: AntDesignUserOutlined }"
    content="hello world !"
  />
  <div flex="~ items-center gap-2" mt-2>
    Loading state:
    <el-switch v-model="loading" />
  </div>
</template>

<script lang="ts" setup>
  import { Bubble } from '@mixte/snippets/ant-design-x';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const loading = ref(true);
</script>
