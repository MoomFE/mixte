---
description: "Use when 编写或运行 mixte 仓库的测试，涉及 Vitest 配置、单元测试（index.test.ts）与浏览器测试（index.browser.test.ts）、test-tsc / test-build / test:ui、或覆盖率。"
applyTo: "packages/**/*.{test,spec}.{ts,tsx}"
---

# 测试约定

## 测试框架

- Vitest（`vitest.config.ts`），`globals: true` —— 直接使用 `describe` / `it` / `expect`，无需导入
- 两个 project：
  - `test`：jsdom 环境，匹配 `**/*.{test,spec}.{ts,tsx}`（排除 `*.browser.*`）
  - `browser`：Playwright Chromium，匹配 `**/*.browser.{test,spec}.{ts,tsx}`
- 覆盖率使用 v8 provider，默认开启

## 文件命名与位置

- 单元测试与被测模块同目录，命名 `index.test.ts`（或模块同名）
- 浏览器端测试命名为 `index.browser.test.ts`（如 `components/src/grid-table/index.browser.test.ts`）
- 组件测试可用 `.tsx`（如 `grid-table/index.test.tsx`），搭配 `@vue/test-utils`

## 常用命令

- `pnpm test`：watch + coverage；`pnpm test:ui`：浏览器测试带 UI（`Browser_UI=true`）
- `pnpm test-coverage`：单次运行全部测试
- `pnpm test-tsc`：`vitest --run` + `vue-tsc --noEmit`（CI 校验）
- `pnpm test-build`：先 `build`，再以 `testAlias`（指向 dist）与 `__TEST_BUILD__` 标志运行，验证发布产物

## 注意

- 新增模块时应同时补充对应测试（单元 + 必要时的浏览器测试）
- 涉及外部请求的测试（如 `getFastestCDN`）在 CI 中会被覆盖率排除，注意按现有方式处理
