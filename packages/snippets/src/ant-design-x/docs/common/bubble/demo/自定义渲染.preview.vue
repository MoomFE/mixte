<template>
  <div :key h-36 flex="~ col gap-2">
    <Bubble
      :typing="{ step: 2, interval: 50 }"
      :avatar="{ icon: AntDesignUserOutlined }"
      :content="text"
      :message-render="RenderMarkdown"
    />
  </div>
</template>

<script lang="tsx" setup>
  import { Bubble } from '@mixte/snippets/ant-design-x';
  import markdownit from 'markdown-it';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const md = markdownit({ html: true, breaks: true });

  const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://mixte.moomfe.com/mixte/snippets/ant-design-x)
`.trim();

  function RenderMarkdown(content: string) {
    return (
      <div v-html={md.render(content)} />
    );
  }

  const key = ref(1);

  useIntervalFn(() => key.value++, text.length * 100 + 2000);
</script>
