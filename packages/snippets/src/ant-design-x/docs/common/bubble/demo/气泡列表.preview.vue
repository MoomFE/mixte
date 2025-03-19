<template>
  <div flex="~ justify-end" mb-2>
    <el-button @click="count++">Add Bubble</el-button>
    <el-button disabled>Scroll To First [todo]</el-button>
  </div>

  <BubbleList
    :style="{ maxHeight: 300, paddingRight: 12 }"
    :roles
    :items
  />
</template>

<script lang="ts" setup>
  import type { BubbleListProps } from '@mixte/snippets/ant-design-x';
  import { BubbleList } from '@mixte/snippets/ant-design-x';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const count = ref(3);

  const items = computed(() => {
    return Array.from({ length: count.value }).map((_, i) => {
      const isAI = !!(i % 2);
      const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.';

      return { key: i, role: isAI ? 'ai' : 'user', content };
    });
  });

  const roles: BubbleListProps['roles'] = {
    ai: {
      placement: 'start',
      avatar: { icon: AntDesignUserOutlined, style: { background: '#fde3cf' } },
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 600,
      },
    },
    user: {
      placement: 'end',
      avatar: { icon: AntDesignUserOutlined, style: { background: '#87d068' } },
    },
  };
</script>
