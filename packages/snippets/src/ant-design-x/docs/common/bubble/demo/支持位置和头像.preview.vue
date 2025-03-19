<template>
  <div flex="~ col gap-2">
    <Bubble
      placement="start"
      content="Good morning, how are you?"
      :avatar="{ icon: AntDesignUserOutlined, style: fooAvatar }"
    />
    <Bubble
      placement="start"
      content="What a beautiful day!"
      :avatar="{}"
      :styles="{ avatar: hideAvatar }"
    />
    <Bubble
      placement="end"
      content="Hi, good morning, I'm fine!"
      :avatar="{ icon: AntDesignUserOutlined, style: barAvatar }"
    />
    <Bubble
      placement="end"
      content="Thank you!"
      :avatar="{}"
      :styles="{ avatar: hideAvatar }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Bubble } from '@mixte/snippets/ant-design-x';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const fooAvatar = { color: '#f56a00', backgroundColor: '#fde3cf' } as const;
  const barAvatar = { color: '#fff', backgroundColor: '#87d068' } as const;
  const hideAvatar = { visibility: 'hidden' } as const;
</script>
