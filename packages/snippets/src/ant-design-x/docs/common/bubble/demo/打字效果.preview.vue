<template>
  <div flex="~ col gap-2">
    <Bubble
      :typing="{ step: 2, interval: 50 }"
      :avatar="{ icon: AntDesignUserOutlined }"
      :content="text.repeat(repeat)"
    />
    <Bubble
      :typing="{ step: 2, interval: 50, suffix: '💗' }"
      :avatar="{ icon: AntDesignUserOutlined }"
      :content="text.repeat(repeat)"
    />

    <div flex="~ justify-end">
      <el-button @click="repeat = repeat < 5 ? repeat + 1 : 1">
        Repeat {{ repeat }} Times
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Bubble } from '@mixte/snippets/ant-design-x';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const repeat = ref(1);

  const text = 'Ant Design X love you! ';
</script>
