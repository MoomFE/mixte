---
name: mixte-commit-changelog
description: Mixte 仓库的提交信息与 CHANGELOG.md 书写规范。使用时机：在本仓库编写或审查 git 提交标题 / 正文、更新 CHANGELOG.md（Unreleased 条目、beta 与正式版章节、图标、`*` 条目、链接引用）、准备发布 release 或判断版本号时。Use when writing or reviewing commit messages, updating CHANGELOG.md, or preparing releases in the Mixte repository.
---

# Mixte 提交信息与 CHANGELOG 规范

一句话：**用户可见的改动，在同一提交里用 `[作用域] 中文描述` 作标题，并同步在 CHANGELOG.md 的 `Unreleased` 添加一条带图标与包名的条目；发布时按 beta / 正式版规则整理章节。**

## 提交信息

### 标题

- 变更标题写成 `[作用域] 中文描述`（新增 / 修复 / 优化 / 重构 / 移除等），不用 `feat:`、`fix:` 这类前缀：
  - `[mixte] 新增 \`pickDeep\` 函数, 支持从对象中选择指定的深层属性`
  - `[components] 组件 \`GridTable\` 新增 \`hover\` 参数以控制鼠标悬浮时的高亮模式`
- 作用域取包名：`[mixte]`、`[use]`、`[components]`、`[snippets]`、`[mel-components]`、`[validator]`；多包共同时写作 `[use, components, snippets]`；文档改动用 `[docs]`。跨包改动或仓库基建可省略作用域。描述中的标识符用反引号。
- 一条提交包含多个要点时用 `; ` 分隔，如 `重构 xxx, 补充相关测试; 更新 instructions`。
- beta 期间，在当前版本新功能基础上做的修复 / 增改，标题末尾加 ` *`（规则见下文「`*` 条目」）。

### 正文

简单改动可只写标题；复杂改动在标题后空一行写中文正文，说明动机、实现方案、兼容 / 适配点与验证方式（如「构建与文档站验证通过」），多段之间空行分隔。

## CHANGELOG.md

### 写一条条目

用户可见的改动要在**同一个提交**里更新 CHANGELOG.md；纯内部改动（依赖、CI、文档、测试基建）不加条目。漏写时用只改 CHANGELOG.md 的提交补上（历史中的 `Update CHANGELOG.md` 即此类）。

条目写在顶部 `## [Unreleased]` 下：

```md
## [Unreleased]
  - 🌟 [mixte] 新增 `isSymbol` 函数
  - 💄 [@mixte/components] 重构 `GridTable` 树形数据展开行状态管理, 补充相关测试
  - 🐞 [@mixte/components] 修复组件 `GridTable` 的表头分割线在某些情况下宽度不统一或不显示的问题
  - ⚠️ 构建由 `rollup` 迁移至 `tsdown`
```

- 缩进两个空格再写 `- `；图标按变更性质选择：🌟 功能新增、💄 功能更改 / 优化、🐞 问题修正、⚠️ 可能与上一版本不兼容的更改；`📅` 只出现在版本日期行。
- 包名用完整名：`[@mixte/components]`、`[@mixte/use]`、`[@mixte/snippets]`、`[@mixte/mel-components]`；`mixte` 包写作 `[mixte]`；跨包条目可省略包名。
- 描述与提交标题是同一句，只换作用域写法；面向使用者陈述价值，不写测试 / 文档细节；同类改动可以合并成一条。
- 同章节内按 🌟 → 💄 → 🐞 → ⚠️ 分组排序。

```md
标题: [components] 修复组件 `GridTable` 的外部容器仅设置 `max-height` 时表格高度不对的问题

CHANGELOG.md:
  - 🐞 [@mixte/components] 修复组件 `GridTable` 的外部容器仅设置 `max-height` 时表格高度不对的问题
```

### 发布

发布前先改好 CHANGELOG.md，发布提交（由 `pnpm release` / bumpp 生成）会连它一起提交：

1. **发 beta**：把 `Unreleased` 的条目移入新的 `## [vX.Y.Z-beta.N]` 章节，标题下加 `  - 📅 YYYY-MM-DD`；文件底部链接引用区添加 `[vX.Y.Z-beta.N]: https://github.com/MoomFE/mixte/releases/tag/vX.Y.Z-beta.N`，并把 `[Unreleased]` 基线更新为 `...compare/vX.Y.Z-beta.N...HEAD`；`Unreleased` 清空但保留标题。
2. **发正式版**：把该版本的全部 beta 章节合并成一个 `## [vX.Y.Z], [-beta.N][vX.Y.Z-beta.N], ...`，日期改为正式发布日；删除全部 `*` 条目；去重、合并同类条目；添加 `[vX.Y.Z]` 链接、更新 `Unreleased` 基线。

### `*` 条目

beta 期间两类改动要在提交标题与 CHANGELOG 条目末尾都加 ` *`：

1. 修复当前版本 beta 版中的 BUG；
2. 在当前版本新增的功能基础上做的功能新增 / 更改。

正式版发布时整体删除（记录保留在 GitHub releases 中）——它们只是给 beta 使用者的临时说明。

### 版本号

破坏性更新和新特性进主版本号，向下兼容的功能新增 / 更改 / 优化进次版本号，问题修正 / 一般优化进修订号，预发布用 `-beta.N`。完整定义以 CHANGELOG.md 底部的「版本规范 / beta 版本规范 / CHANGELOG 图标规范」为准（保持原样，除非明确要求更新规范）。

## 检查清单

- 标题是 `[作用域] 中文描述`，需要时带 ` *`。
- 用户可见改动：同一提交已在 `Unreleased` 写好条目（图标 + 完整包名 + 与标题一致的描述），排序正确。
- 发布改动：章节拆分 / 合并、日期行、`*` 条目删除、底部链接引用与 `Unreleased` 基线都已处理，并与版本号提升在同一个发布提交里。
