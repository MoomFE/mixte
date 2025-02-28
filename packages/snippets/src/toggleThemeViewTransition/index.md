---
outline: [2,4]
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
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';
  import { useDark } from '@vueuse/core';

  const isDark = useDark();

  function toggle({ clientX: x, clientY: y }: MouseEvent) {
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
  <ul>
    <li @click="toggle($event, 'light')">light</li>
    <li @click="toggle($event, 'dark')">dark</li>
  </ul>
</template>

<script lang="ts" setup>
  const color = useColorMode();

  function toggle({ clientX: x, clientY: y }: MouseEvent, theme: string) {
    toggleThemeViewTransition(() => color.preference = theme, {
      x,
      y,
      reverse: () => color.preference === 'dark',
      reverseSelector: '.dark-mode' // color-mode 默认深色模式的 class 选择器有 `-mode` 后缀
    });
  }
</script>
```

### 类型

```ts
interface ToggleThemeViewTransitionOptions {
  /** X 轴坐标 ( 传递鼠标事件的 clientX ) */
  x?: number;
  /** Y 轴坐标 ( 传递鼠标事件的 clientY ) */
  y?: number;
  /**
   * 是否反转动画
   * @default () => false
   */
  reverse?: Ref<boolean> | (() => boolean);
  /**
   * 反转动画时匹配的选择器
   * @default '.dark'
   */
  reverseSelector?: string;
  /**
   * 是否检测用户偏好是否是减少动画
   * @default true
   */
  prefersReducedMotion?: boolean;
}

/**
 * @param toggle 切换主题的方法
 * @param options 可选项
 */
function toggleThemeViewTransition(toggle: () => void, options?: ToggleThemeViewTransitionOptions): Promise<void>;
```
