---
name: moomfe-vue
# 维护约定：本 skill 会被复制到多个项目使用 —— description 与正文保持项目无关；
# 宿主项目特有的事实、例外、历史包袱放 notes/，不要写进这里。
description: 个人 Vue 开发习惯与实现规范（Vue 3 Composition API / `<script setup>`）。使用时机：创建、修改、重构或审查 .vue 组件、composables、响应式逻辑（ref/computed/watch）、props/emits/v-model、模板结构、异步状态，或判断是否需要抽取组合式函数时。核心：先跟项目既有模式；ref 优先；避免无意义 watch；优先复用已有组合式工具与成熟抽象。
---

# 个人 Vue 开发习惯

一句话：**先看项目里已有的写法与可用工具，再按这些习惯写；与项目一致永远优先于本 skill 的默认偏好。**

本 skill 是个人跨项目习惯，不是 Vue 教程。每条规则都应该改变你的实现选择。

## 规则强度

- **MUST**：必须遵守；除非项目事实明确要求例外。
- **SHOULD**：默认遵守；有明确理由可以偏离。
- **PREFER**：偏好，不是硬规则。
- **AVOID**：通常避免。
- **NEVER**：明确禁止。

## 第 0 步：先看邻居、再看工具箱（MUST）

动手前必须完成两件事：

1. **看邻居**：找出 1~3 个最相近的既有实现 —— 同业务域页面、同类型组件、同层 composable。
2. **看工具箱**：确认项目实际装了什么 —— `@mixte/use`（个人自研，跨项目优先使用：whenever 族、useRequest、createNamedSharedComposable）、`vueuse` / `@vueuse/nuxt`、项目自己的 `composables/`、UI 库自带的组合式能力。

完成判据：

- 能说出新代码每一部分分别对应哪个既有模式（props 风格、目录落点、命名方式）；
- 能用现成工具覆盖的逻辑，没有计划自写实现；
- 没有在既有模式之外发明新的目录、命名或写法。

**兜底**：确实找不到可参照的实现时，按本 skill 的默认写，并在交付说明中注明“无先例可循”。

## 核心决策规则

### 响应式（ref 优先）

- **SHOULD**：状态默认用 `ref`（对象/数组也可以一样使用，复杂类型写 `ref<T>()`）。不要为了统一风格机械改写已有的 `reactive`。
- **SHOULD**：对象状态在这些场景使用 `reactive` 是合理的：
  - 表单模型或多字段编辑状态；
  - 需要自然的对象字段读写；
  - 包装第三方组合式返回值（如 `reactive(useClipboard(...))`）；
  - 动态键的字典/参数（如 `reactive<Record<string, any>>({})`）；
  - 需要保持对象引用稳定的一次性配置对象。
- **SHOULD**：所有派生值用 `computed` 计算 —— 可见性、标题、请求参数、格式化结果。不额外维护一份可以算出来的状态。
- **AVOID**：把 `reactive` 当作普通状态容器；无实测理由的性能微调 API（如 `shallowRef`）。

### watch（不写裸 watch，用语义化工具替代）

少写 watch 的真实原因是：**它几乎总能被更准确的工具替代。**

- **AVOID**：用 `watch` / `watchEffect` 维护可以直接计算得到的状态（这是 `computed` 的事）。
- **SHOULD**：优先使用项目已有的语义化监听工具，避免手写 `watch + if` / `watch + options` 样板。个人项目中默认检查 `@mixte/use`、vueuse 的等价能力；项目实际装了什么就用什么：
  - 值 truthy 时执行副作用 → `whenever` / `wheneverImmediate`；
  - 条件成立期间注册一组带生命周期的副作用（事件监听、子 watch、定时器）→ `wheneverEffectScope` / `wheneverEffectScopeImmediate`（失效自动清理、重建自动重建）；
  - 需要 immediate / deep 预设 → `watchImmediate` / `watchDeep` / `watchImmediateDeep`；
  - 请求类副作用 → 请求封装（`useRequest` / `useRequestReactive` 或项目等价物）。
- **SHOULD**：上述语义化工具不可用时，裸 `watch` 只留给无法避免的命令式副作用（分页变化→重新请求、参数变化→刷新），并尽量下沉进 composable。
- **NEVER**：watch + 第二份状态做双向同步。
- 具体选择规则与 `whenever` 族的个人用法见 `references/reactivity-patterns.md`。

### composable（少封装，先复用）

这是最容易被 AI 写坏的地方，默认姿态是**克制**：

- **MUST**：不要因为文件结构漂亮、组件看起来“更整洁”就创建 composable。一次性业务逻辑默认留在页面/组件内。
- **MUST**：新的 `useXxx` 必须同时满足「有明确职责」+「有真实复用价值」+「语义明确」，否则不提取。
- **SHOULD**：写新的 `useXxx` 前，先确认 vueuse / `@mixte/use`、项目工具库、既有 composables 都覆盖不了。**尽可能少封装，尽可能复用现成工具**。
- **SHOULD**：确认要封装时，先读 `references/composable-design.md`（从自研代表作 @mixte/use 提炼的方法论：语义化命名、自动清理、输入兼容 ref/getter、类型推导优先）。
- **SHOULD**：共享 composable 返回普通对象（状态 + 方法的集合），放项目的 `composables/`；组件树内共享用 `createInjectionState` 生成 `[useProvideXxx, useXxx]` 对——不手写 provide/inject，`createInjectionState` 的类型推导更好；组件私有逻辑放组件目录的 `composables/` 子目录。
- **AVOID**：为单个小函数、小状态写 `useXxx`；为了“整洁”把组件拆成一堆薄 composable。

### 状态落点

```text
组件内 ref / computed
  ↓ 需要跨组件/跨页面共享
composable / 模块级 ref（简单全局值可用 useLocalStorage 等）
  ↓ 真正的全局域状态（登录态、全局配置）
Pinia store
```

- **SHOULD**：按此顺序升级，从最低一层开始；不要为新功能先建 store。
- **SHOULD**：简单全局值（token、主题、设置项）用模块级 `ref` / `useLocalStorage` 即可，不必绕 Pinia。
- **PREFER**：Pinia store 用 setup 语法（`defineStore('name', () => {...})`），内部逻辑遵守以上所有规则。

### 组件 API 与通信

- **MUST**：`<script setup lang="ts">` + Composition API。
- **MUST**：`defineProps<T>()`、`defineEmits<T>()` 用类型参数写法；类型抽到组件目录的 `types.ts`（或 `type.ts`，跟邻居）。
- **SHOULD**：有泛型需求的组件用泛型 SFC（`<script setup generic="T extends ...">` + `defineProps<Props<T>>()` + `defineSlots<Slots<T>>()`），把类型推导交给调用方。
- **SHOULD**：双向绑定组件用 `defineModel<T>()`（可带 `{ default: ... }`），不手写 `props.modelValue` + `update:modelValue`。
- **SHOULD**：需要父级命令式调用的能力（刷新、校验、提交）用 `defineExpose` 暴露方法，父级通过模板 ref 调用。这种“ref 命令式调用”比复杂事件协议更常用。
- **SHOULD**：props 少而语义化；复杂配置聚合成对象 props（如把一组请求、工具栏配置分别聚合），不平铺十几个 props。
- **AVOID**：未经确认的 `$attrs` 透传与新的事件协议设计 —— 先看项目里同类组件怎么通信。

### 模板与块顺序

- **MUST**：SFC 块顺序默认保持 **`<template>` 在前、`<script setup>` 在后**。如果宿主项目已经存在统一且明确的相反约定，再跟随项目事实。
- **SHOULD**：模板保持声明式、表达式简短；稍复杂就提为 `computed` 或命名函数；事件优先绑定方法名。
- **SHOULD**：重型 UI 配置（表格列、表单字段、校验规则）抽到独立文件（如 `columns.ts`），用 `createXxx()` 工厂函数导出，页面只组合。

### 页面与文件组织

- **SHOULD**：页面 = 组合层；只被当前页面使用的子组件与页面同级放 `components/`（co-locate）；出现第二个使用方后再升级为共享组件。
- **SHOULD**：共享组件用 PascalCase 目录 + `index.vue`，类型文件在同目录。
- **SHOULD**：HTTP 请求的 URL 与参数组装收敛在专门模块（`apis/`、`server/api`、请求 composable），组件/页面不散落 URL 字符串。

### API 与异步状态

- **SHOULD**：任何请求都要显式管理 loading/busy 与错误，并在 `finally` 复位；错误要么反馈给用户，要么至少 `console.error`。
- **SHOULD**：先复用项目请求链路（`useAsyncData` / `useFetch` / 项目的 `useRequest*` 封装 / 拦截器）；没有现成封装时，手写 `ref + try/finally` 的稳定模式也可以，不要为一次请求引入新库。
- **AVOID**：裸 `fetch`、绕过项目请求层的直连。

### Vue 类型与导入

- **SHOULD**：`defineProps` / `defineEmits` / `defineModel` 的泛型用明确类型；确实宽泛处（动态配置、第三方透传）用 `Record<string, any>` 这类显式宽松类型，而不是无标注。
- **SHOULD**：依赖项目自动导入 —— `ref` / `computed` 等核心 API 不手写 import；只有自动导入覆盖不到的 API 才显式 import（没有自动导入的项目则全部显式 import）。
- **PREFER**：局部类型就近声明（页面内 interface）；会被多处引用的抽到 `types.ts`。

### 命名

- **SHOULD**：事件处理与动作函数用业务动词命名（`onSubmit`、`refreshTableData`、`openAssignWarehouse`、`runJsonFormat`）。

## 反模式

- ❌ 用 watch 同步可派生状态（同一事实存两份）
- ❌ 手写 `watch(src, v => { if (v) ... })` / `watch(src, cb, { immediate: true })` 样板——应优先使用已有的 whenever 族 / watch 预设族；没有工具时再用原生 watch。
- ❌ 自写 `useToggle` / `useXxx` 去实现 vueuse / @mixte/use 已有的能力
- ❌ 为只有一处使用的逻辑抽共享 composable
- ❌ 把普通状态机械写成 `reactive` 大对象
- ❌ 组件里裸写 URL、绕过项目请求层
- ❌ 小页面强行拆组件/拆 composable“显得专业”
- ❌ `props.modelValue` + `update:modelValue` 手写 v-model
- ❌ 在 Nuxt 项目里手写 vue 核心 API 的 import（项目自动导入开启时）

## 自检清单

提交前逐条过：

1. 与相邻 1~3 个既有实现核对过模式，没有新发明？
2. 没有 watch 维护可派生状态，也没有手写 `watch + if` / `watch + options` 样板（条件副作用优先走 whenever 族）？
3. 没有自写 vueuse / @mixte/use / 项目工具库已能覆盖的 composable？
4. 状态落点符合 组件 → composable / 模块级 → Pinia 的升级顺序？
5. 宏用类型参数写法、v-model 用 `defineModel`？
6. 请求有 loading/error 处理且 `finally` 复位？
7. SFC 块顺序、目录落点与项目/本 skill 一致？

## 参考

- 涉及 `ref` / `reactive` / `computed` / `watch` / `whenever` 选择时：读 `references/reactivity-patterns.md`。
- 要封装新的组合式函数、设计组件或确定组件 API 与结构时：读 `references/composable-design.md`（从 @mixte/use、@mixte/components 提炼的封装方法论）。
- 当前项目使用 Nuxt 时（存在 `nuxt.config.ts`）：读 `references/nuxt.md`（definePageMeta、自动导入、数据获取、SSR 注意）。
- 需要命令式/动态渲染片段（弹窗内容、消息框、表格单元格）且项目支持 JSX 时：读 `references/jsx-render-fragments.md`。
- 当前宿主项目的 Vue 事实与例外：`notes/README.md`（项目私有，不随 skill 复制）。
