<template>
  <ElButton type="primary" @click="toggle">
    切换主题
  </ElButton>
</template>

<script lang="ts" setup>
  import { useData } from 'vitepress';
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const { isDark } = useData();

  function toggle(event: MouseEvent) {
    toggleThemeViewTransition(() => isDark.value = !isDark.value, {
      x: event.clientX,
      y: event.clientY,
      reverse: isDark,
    });
  }

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <button @click="toggle">获取</button>
</template>

<script lang="ts" setup>
  import { useDark } from '@vueuse/core'
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';

  const isDark = useDark()

  function toggle(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    toggleThemeViewTransition(() => isDark.value = !isDark.value, {
      x,
      y,
      reverse: isDark,
    });
  }
<\/script>
    `),
  );
</script>
