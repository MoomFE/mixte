---
outline: [1,4]
---

切换主题时的视图过渡动画

### 示例

<br>

#### 配合 [`useDark`](https://vueuse.org/core/useDark/) 使用

```vue twoslash
<template>
  <button @click="toggle">切换</button>
</template>

<script lang="ts" setup>
  import { useDark } from '@vueuse/core';
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';

  const isDark = useDark();

  function toggle(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    toggleThemeViewTransition(() => isDark.value = !isDark.value, {
      x,
      y,
      reverse: isDark,
    });
  }
</script>
```

#### 配合 [`VitePress`](https://vitepress.dev/zh/) 使用

<<< @/.vitepress/theme/Layout.vue

#### 配合 [`Nuxt Color Mode`](https://nuxt.com/modules/color-mode) 使用

```vue
<template>
  <template>
    <ul>
      <li @click="toggle($event, 'light')">light</li>
      <li @click="toggle($event, 'dark')">dark</li>
    </ul>
  </template>
</template>

<script lang="ts" setup>
  const color = useColorMode();

  function toggle(event: MouseEvent, theme: string) {
    const x = event.clientX;
    const y = event.clientY;

    toggleThemeViewTransition(() => color.preference = theme, {
      x,
      y,
      reverse: () => color.preference === 'dark',
      reverseSelector: '.dark-mode' // color-mode 默认深色模式的 class 选择器有 `-mode` 后缀
    });
  }
</script>
```
