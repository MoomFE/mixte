---
description: "Use when 编写或修改 mixte 仓库的 TypeScript / Vue 代码，涉及代码风格、注释规范（注释取舍、方法名标题、JSDoc 摆放）、模块目录结构（index.ts / info.ts / index.md / demo）、defineDocInfo 文档元数据、Vue 组件约定、ESLint 规范或 catalog 依赖管理。"
applyTo: "**/*.{ts,tsx,vue}"
---

# 代码规范与约定

## 通用

- TypeScript 优先；Vue 组件一律使用 Composition API + `<script setup lang="ts">`
- ESLint 使用 `@moomfe/eslint-config`，提交前经 lint-staged 自动 `eslint --fix`
- 代码与文档注释使用中文
- 工具函数 / 组合式函数 / 组件均应附带：`index.ts`（实现与入口）、`info.ts`（文档元数据）、`index.md`（文档页）、必要时的 `demo/` 与测试

## 注释

- 文档注释 ( `/** */` ) 不写复述代码的内容；只保留必须存在的注释，例如设计原因、契约、防循环等无法从代码直接看出的信息
- 变量声明上的文档注释 ( `/** */` ) 允许保留，用于说明变量含义
- 行内注释 ( `//` ) 适量允许，用于补充代码意图、边界条件等
- 有注释的方法应带简略的方法名标题（中文）
- 方法注释统一使用 JSDoc：
  - 首行为简略的中文方法名标题，如 `/** 展开所有行 */`
  - 必须的补充信息以 `- xxx` 列表项放在标题下方，标题保持干净
  - 仅当「单行注释且下方没有列表项」时，补充信息才放进标题的括号里，如 `/** 更新集合 ( 不触碰对外模型 ) */`

## 包结构约定

- 每个功能模块一个目录（如 `packages/mixte/src/random/`），通过包的 `src/index.ts` 统一 `export *` 导出
- `info.ts` 使用 `defineDocInfo`（来自 `@/.vitepress/types/info`）定义文档元数据（`name`、`title`、`sidebarTitle` 等）
- `index.md` 为 Vitepress 文档页，标题与侧边栏信息来自 `info.ts`
- 大型模块内部再分 `src/`（如 `grid-table/src/`），并可能提供子路径导出

## Vue 组件约定

- 组件基于 Vue 3 + TypeScript，类型辅助使用 `vue-component-type-helpers`
- 组件样式支持按需引入（`css` 子路径），构建时通过 `copy` 拷贝
- 公开组件需要类型声明与 `d.ts`（构建时用 `vue-tsc` 生成）

## 其他

- 涉及 React 集成的代码（`ant-design-x` 等）通过 `veaury` 与补丁（`patches/`）桥接
- 依赖版本尽量走 `catalog:`（`pnpm-workspace.yaml`），不直接写死版本
