---
description: "Use when 编写或修改 Vitepress 文档，涉及 index.md / info.ts / demo 目录、子级文档 docs/<group>/<name>、pnpm udd 生成 meta/docs.json、或 packages/.vitepress 站点配置。"
---

# 文档约定（Vitepress）

## 站点结构

- Vitepress 站点源码位于 `packages/`，配置在 `packages/.vitepress/`
- 首页 `packages/index.md`；导航 / 侧边栏由 `packages/.vitepress/config.mts` 根据 `meta/docs.json` 生成
- 站点语言为中文（`lang: zh-CN`），文档内容使用中文书写

## 文档与源码同目录

每个功能模块目录包含：

```
src/<module>/
  index.ts        # 实现 / 入口
  info.ts         # 文档元数据（defineDocInfo）
  index.md        # 文档页
  demo/           # 演示（*.preview.vue 等）
  docs/<group>/<name>/index.md   # 可选的子级文档（分组）
```

- `info.ts` 通过 `defineDocInfo`（`@/.vitepress/types/info`）声明 `name` / `title` / `sidebarTitle` / `hiddenTitle` / `childrenGroupInfo` / `childrenInfo` 等
- 子级文档放在 `docs/<group>/<name>/index.md`，分组由 `info.ts` 的 `childrenGroupInfo` 描述

## 生成元数据

- `pnpm udd`（`scripts/updateDocsDetails.ts`）扫描各包 `src/*/index.md` 与 `info.ts`，重新生成 `meta/docs.json`
- **新增 / 重命名 / 删除模块或调整 `info.ts` 后，必须运行 `pnpm udd`**，否则侧边栏 / 导航不会更新

## 路径重写与代码块

- `config.mts` 的 `rewrites` 将 `src/:fn/index.md` 重写为 `:fn.md`（如 `mixte/src/random/index.md` → `/mixte/random`）
- 代码块启用 `@shikijs/vitepress-twoslash`（支持内联类型提示）
- `packages/.vitepress/plugins/markdownTransform.ts` 等插件负责演示 / 示例的转换；`DemoCard` 等组件承载演示

## 约定

- 文档页面尽量附演示（`demo/`）与完整可运行的示例代码
- 修改文档基础设施（`packages/.vitepress/`）时注意 SSR 兼容（`ssr.noExternal` 已配置常见 UI 库）
