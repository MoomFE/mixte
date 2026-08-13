---
description: "Use when 执行或修改构建流程（pnpm build）、配置 defineBuild / build.ts、新增子路径导出（package.json exports、meta/alias.ts）、生成 dist 产物，或执行发布 release 流程。"
applyTo: "**/build.ts,**/package.json,scripts/**,meta/alias.ts"
---

# 构建与发布

## 构建流程

- 根命令：`pnpm build` → 并行执行各包 `build`（`tsx build.ts`）
- 每个包的 `build.ts` 调用 `scripts/build-utils.ts` 的 `defineBuild([...])` 声明构建任务
- 产物输出到各包 `dist/`，格式为 `.mjs`（ESM）/ `.cjs`（CJS）/ `.d.ts`（类型）

## defineBuild 配置项

- `entry`：打包入口（一般是 `./src/<module>/index.ts`）
- `outputFileName`：输出文件名（用于子路径导出，如 `grid-table/index`）
- `vueComponent: true`：Vue 组件包，会先执行 `vue-tsc --declaration --emitDeclarationOnly`（基于 `tsconfig.build.json`）生成类型
- `vueDtsInput`：Vue 组件额外 dts 入口（如 `grid-table/types`）
- `copy`：拷贝静态资源（如 `src/grid-table/src/css` → `dist/grid-table/css`）

## 新增子路径导出需要同步的改动

1. 包内 `package.json` 的 `exports`（types / import / require 三份映射）
2. 包内 `build.ts` 的 `defineBuild`（entry / outputFileName）
3. `meta/alias.ts` 的 `alias` 与 `testAlias`
4. 若涉及 `dist` 内子路径引用，检查 `vitest.config.ts` / Vitepress config 的 alias

## 发布

- `pnpm release`：先跑 `test-release`（`test-tsc` + `test-build --run`），通过后由 `bumpp` 统一升版本
- 所有包版本号保持一致；`bumpp` 通过 `-r` 递归更新
- CI：`ci.yml`（lint + test-tsc）、`coverage.yml`、`npm-publish.yml` 负责自动化
