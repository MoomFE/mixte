---
description: "Use when 需要了解 Mixte monorepo 的目录结构、各包（mixte / @mixte/use / @mixte/components / @mixte/validator / @mixte/snippets / @mixte/mel-components）的功能模块、路径别名（@ / @@ / alias / testAlias）、常用命令（build / test / docs / lint / udd / release），或新增一个功能模块。"
---

# 项目结构与常用命令

## 仓库概况

- Monorepo，pnpm workspace（`pnpm-workspace.yaml`，包含 `packages/*`、`playground`、`docs`）
- 包管理器：`pnpm@9.15.6`；CI 使用 Node 20
- 所有发布包版本号统一（当前 `3.6.1`），依赖尽量通过 `catalog:` 集中管理
- 文档站点（Vitepress）也位于 `packages/` 下，与源码包共处一个 workspace

## 目录结构

```
packages/                      # workspace 根：既是 Vitepress 站点，也承载各源码包
  mixte/                       # 包: mixte —— 实用工具函数
  use/                         # 包: @mixte/use —— Vue 组合式函数
  components/                  # 包: @mixte/components —— 工具向 Vue 组件
  validator/                   # 包: @mixte/validator —— 常用校验函数
  snippets/                    # 包: @mixte/snippets —— 实验性 / 特定场景片段
  mel-components/              # 包: @mixte/mel-components —— Element Plus 二次封装
  .vitepress/                  # Vitepress 站点配置 / 主题 / 插件
  index.md                     # 站点首页
scripts/                       # 构建与文档生成脚本（build-utils.ts、updateDocsDetails.ts 等）
meta/                          # alias.ts（源码 / 测试别名）、docs.json（由 udd 生成）
```

## 各包功能模块

- `mixte`：`asyncArrayFn` `changeCase` `deepClone` `deepFn` `deepMerge` `defineArgs` `delay` `env` `get` `is` `leastRun` `move` `onceRun` `pick` `random` `toArray` `uniqueKey`
- `@mixte/use`：`createNamedSharedComposable` `deepUnref` `useCountdown` `useDraggableDistance` `useFileReader` `useRequest` `watch` `whenever` `wheneverEffectScope`；另有 `register`（组件 / 指令注册）与 `nuxt`（Nuxt 模块）子路径导出
- `@mixte/components`：`auto-grid`、`grid-table`、`infinite-scroll`；均按子路径导出（如 `@mixte/components/grid-table`），`grid-table` 还导出 `css` / `utils` / `types`
- `@mixte/validator`：`citizenID`、`email`、`mobile`
- `@mixte/snippets`：`ant-design-x`（React 集成）、`getFastestCDN`、`lottery`、`low-code-editor`、`tiptap-editor`、`toggleThemeViewTransition`、`useNaiveForm`；其中 `tiptap-editor` / `lottery` / `ant-design-x` / `low-code-editor` 有子路径导出
- `@mixte/mel-components`：`mel-select`、`utils`

## 路径别名

- `@` → `packages/`（Vitest 中为 `packages` 目录，Vitepress 中为 `packages/`）
- `@@` → 仓库根目录
- `meta/alias.ts` 定义了两套别名：`alias`（指向各包 `src`，开发 / 文档用）与 `testAlias`（指向 `dist`，`test-build` 用）
- 新增子路径导出时，需同步维护：包内 `package.json` 的 `exports`、`build.ts` 的 `defineBuild` 配置、`meta/alias.ts`

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动文档站点（port 1292） |
| `pnpm docs:dev` / `pnpm docs:build` / `pnpm docs:preview` | 文档开发 / 构建 / 预览（会先 `udd`，`docs:build` 还会先 `build`） |
| `pnpm build` | 构建所有包（`pnpm -r --filter=./packages/* run build`） |
| `pnpm test` | Vitest watch + coverage |
| `pnpm test:ui` | 浏览器测试带 UI |
| `pnpm test-tsc` | `vitest --run` + `vue-tsc`（CI 用） |
| `pnpm test-build` | 构建后针对 `dist` 跑测试 |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm udd` | 扫描各模块 `info.ts` / `index.md`，重新生成 `meta/docs.json` |
| `pnpm release` | `test-release` 通过后执行 `bumpp` 发布 |
| `pnpm up` | 升级依赖（taze） |

## 新增一个功能模块

在某个包（如 `mixte`、`use`、`validator`）新增函数 / 组合式函数 / 校验函数时的标准步骤：

1. 创建模块目录 `packages/<pkg>/src/<module>/`
2. 编写实现，命名为 `index.ts` 并导出
3. 在包的 `src/index.ts` 中追加 `export * from './<module>/index';`
4. 创建 `info.ts`，用 `defineDocInfo` 声明 `name`（中文名）等文档元数据
5. 创建 `index.md` 文档页（含示例 / 演示），必要时添加 `demo/`
6. 添加测试 `index.test.ts`（需要浏览器能力的用 `index.browser.test.ts`）
7. 运行 `pnpm udd` 重新生成 `meta/docs.json`，确认侧边栏 / 导航出现该模块
8. 运行 `pnpm lint` 与相关测试（`pnpm test-tsc`）

> 若新增的是「组件 / 需要子路径导出」的模块（如 `components`、`snippets`、`mel-components`），还需同步维护：包内 `package.json` 的 `exports`、`build.ts` 的 `defineBuild` 配置、`meta/alias.ts`，详见 `build.instructions.md`。
