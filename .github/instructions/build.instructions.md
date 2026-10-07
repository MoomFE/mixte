---
description: "Use when 执行或修改构建流程（pnpm build）、配置 defineBuild / build.ts、新增子路径导出（package.json exports、meta/alias.ts）、生成 dist 产物，或执行发布 release 流程。"
applyTo: "**/build.ts,**/package.json,scripts/**,meta/alias.ts"
---

# 构建与发布

## 构建流程

- 根命令：`pnpm build` → 并行执行各包 `build`（`tsx build.ts`）
- 每个包的 `build.ts` 调用 `scripts/build-utils.ts` 的 `defineBuild([...])` 声明构建任务
- `defineBuild` 编排：清空 `dist/` → 需要时用 vue-tsc 预生成 dts → 逐入口调用 `scripts/build-lib.ts`
- 打包器为 tsdown（Rolldown 内核）：每个入口单独构建，产物为 `.mjs`（ESM）/ `.cjs`（CJS）/ `.d.ts`（类型），输出到各包 `dist/`
- JS 构建禁用代码分割（`codeSplitting: false`），保证入口产物独立、不会产生额外 chunk 文件
- 依赖外部化：JS 构建与 `dtsInput` 类型打包使用 `deps.neverBundle`，由源码生成类型使用 `deps.dts.neverBundle`（由 `scripts/build-lib.ts` 自动合并包依赖、peerDependencies、`@mixte/*` 与各入口的 `external` / `dtsExternal`）

## package.json exports

- 构建结束时会自动同步 `package.json` 的 `exports`：按每个入口生成/修正 `.` 与顶层子路径的 `types` / `import` / `require` 三份映射（新增条目插入在 `./*` 透传条目之前）
- 嵌套子路径（如 `./tiptap-editor/*`、`./grid-table/*`）已由手写通配符条目覆盖时不会重复新增；其他手写条目（如 `./*` 资源透传）不会被修改或删除
- 同步仅在内容不一致时写入，一致时为无操作（no-op），运行 `git diff` 不应出现包内 `package.json` 变化

## 类型生成

- 普通入口：由 tsdown 的 `dts` 选项直接从源码打包类型
- Vue 组件及声明了 `vueDtsInput` 的入口：先执行一次 `vue-tsc --declaration --emitDeclarationOnly`（基于 `tsconfig.build.json`）生成到 `dist/dts`，再由 tsdown 以 `dtsInput: true`、`emitDtsOnly: true` 从预生成产物打包出单文件 `.d.ts`，构建完成后移除 `dist/dts`

## defineBuild 配置项

- `entry`：打包入口（一般是 `./src/<module>/index.ts`）
- `outputFileName`：输出文件名（用于子路径导出，如 `grid-table/index`）
- `vueComponent: true`：Vue 组件入口，类型走 vue-tsc 预生成 + `dtsInput` 打包
- `vueDtsInput`：显式指定该入口 dts 打包所用的预生成文件路径（相对于 `dist/dts`，如 `grid-table/src/types.d.ts`）
- `copy`：拷贝静态资源（如 `src/grid-table/src/css` → `dist/grid-table/css`）

## 新增子路径导出需要同步的改动

1. 包内 `build.ts` 的 `defineBuild`（entry / outputFileName）
2. 构建会自动同步 `package.json` 的 `exports`（`types` / `import` / `require` 三份映射）；嵌套子路径若未被通配符覆盖会自动新增显式条目，也可手动维护通配符条目
3. `meta/alias.ts` 的 `alias` 与 `testAlias`
4. 若涉及 `dist` 内子路径引用，检查 `vitest.config.ts` / Vitepress config 的 alias

## 发布

- `pnpm release`：先跑 `test-release`（`test-tsc` + `test-build --run`），通过后由 `bumpp` 统一升版本
- 所有包版本号保持一致；`bumpp` 通过 `-r` 递归更新
- CI：`ci.yml`（lint + test-tsc）、`coverage.yml`、`npm-publish.yml` 负责自动化
