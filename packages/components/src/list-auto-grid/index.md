---
outline: [1,3]
---

- 为组件渲染的列表子元素统一设定一个最小宽度
- 当一行的剩余宽度不够容纳一个子元素时, 会将剩余宽度平均到每个子元素上

::: warning 注意
该组件支持 `Vue 2.7`、`Vue 3`, 若要在 `<= Vue 2.6` 中使用, 需要先安装 [`@vue/composition-api`](https://github.com/vuejs/composition-api) 插件
:::

## 演示

### 功能演示

### 以数组渲染列表

### 以数值渲染列表

## 在 Nuxt 中使用

在 [Nuxt](https://nuxt.com) 中使用时, 需要在 `nuxt.config.ts` 中配置 `build.transpile` 选项, 将 `@mixte/components/list-auto-grid` 添加到其中:

::: code-group
```ts twoslash [nuxt.config.ts]
// ---cut-start---
import { defineNuxtConfig } from 'nuxt/config';
// ---cut-end---
export default defineNuxtConfig({
  build: {
    transpile: ['@mixte/components/list-auto-grid'],
  },
});
```
:::
