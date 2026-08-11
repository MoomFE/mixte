# Mixte 项目指令

> 本文件是本仓库 Copilot 的总入口：先阅读「项目概览」建立整体认知，再通过下方「分类 instruction 导航」定位需要按需加载的子指令文件。

## 项目概览

Mixte 是一个「前端工具合集」monorepo，使用 pnpm workspace 管理，同时托管一套基于 Vitepress 的中文文档站点（https://mixte.moomfe.com/）。

| 包 | 说明 |
| --- | --- |
| `mixte` | 实用工具函数 |
| `@mixte/use` | Vue 组合式函数（可与 VueUse 搭配使用） |
| `@mixte/components` | 工具向 Vue 组件库，按子路径导出 |
| `@mixte/validator` | 常用校验函数 |
| `@mixte/snippets` | 实验性 / 面向特定场景的代码片段与组件 |
| `@mixte/mel-components` | 对 Element Plus 组件库的二次封装 |

代码与文档同目录存放：每个功能模块目录内含 `index.ts`（实现/入口）、`info.ts`（文档元数据）、`index.md`（文档页）、`demo/`（演示）与测试文件。

## 分类 instruction 导航

以下规则已经拆分为独立 instruction，命中对应场景时应优先遵循：

- `project.instructions.md`
	- 用于了解 Mixte monorepo 的目录结构、各包（mixte / @mixte/use / @mixte/components / @mixte/validator / @mixte/snippets / @mixte/mel-components）的功能模块、路径别名与常用命令，以及新增一个功能模块的完整流程
- `code-conventions.instructions.md`
	- 用于编写或修改 TypeScript / Vue 代码时的代码风格、注释规范（注释取舍、方法名标题、JSDoc 摆放）、模块目录结构（index.ts / info.ts / index.md / demo）、defineDocInfo 文档元数据、Vue 组件约定与 ESLint 规范
- `build.instructions.md`
	- 用于执行或修改构建流程、defineBuild / build.ts 配置、新增子路径导出（package.json exports、meta/alias.ts）、生成 dist 产物与发布 release
- `testing.instructions.md`
	- 用于编写或运行测试，涉及 Vitest 配置、单元测试（index.test.ts）与浏览器测试（index.browser.test.ts）、test-tsc / test-build 与覆盖率
- `docs.instructions.md`
	- 用于编写或修改 Vitepress 文档，涉及 index.md / info.ts / demo、子级文档、pnpm udd 生成 meta/docs.json 与 packages/.vitepress 站点配置
- `instruction-governance.instructions.md`
	- 用于新增、修改、重组或审查 instruction 时的治理规则、作用域与影响分析；也涵盖本仓库禁止写入 `/memories/` 的边界

## Agent skills

### Issue tracker

Issue 以本地 markdown 文件存放于 `.github/.scratch/<feature>/` 下。详见 `.github/docs/agents/issue-tracker.md`。

### Triage labels

五个标准 triage 角色标签：`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`。详见 `.github/docs/agents/triage-labels.md`。

### Domain docs

单上下文：`.github/CONTEXT.md` + `.github/docs/adr/`。详见 `.github/docs/agents/domain.md`。
