<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# Nuxt 项目中的 Vue 习惯

> 触发条件：当前项目使用 Nuxt（存在 `nuxt.config.ts`）。
> 范围说明：个人对 Nuxt 保持保守 —— 这里只沉淀少数经过真实项目验证的做法；
> 其余一切以 **Nuxt 官方文档 + 项目现状** 为准，不凭印象发明写法。

## 稳定做法

- 页面级配置写 `definePageMeta`（`layout`、`middleware`、`path`）；路由守卫放 `middleware/`。
- 数据获取：读数据优先 `useFetch` / `useAsyncData`；写操作与命令式场景用 `$fetch`（继承项目拦截器 / 封装）。
- 依赖自动导入：`ref`、`computed`、`useFetch` 等核心 API 不手写 import；跨层模块（`~~/lib`、`~/` 别名）显式 import。
- 渲染模式（SSR / SPA）、插件机制、配置键等以项目现状与官方文档为准，不擅自引入新做法。

## 不确定时

查官方文档 → 看项目现有用法 → 跟随项目；不确定就问，不猜。
