---
name: moomfe-styling
# 维护约定：本 skill 会被复制到多个项目使用 —— description 与正文始终保持项目无关，
# 更新时不要为贴合宿主仓库的描述格式或词汇而改写。
description: 通用样式编写与审查规范（任何项目、任何引擎）。使用时机：写、改或审查模板 class / JSX className / 纯 HTML、<style> 与 CSS/SCSS/@apply、响应式、暗色、状态变体，或判断这次是否需要新写 CSS 时。核心是先确认项目实际样式体系，再复用已有抽象，默认优先 utility，只有更高层抽象或 utility 无法表达时才新增 CSS。适用于 UnoCSS、Tailwind、原生 CSS/SCSS 等。Use when writing, changing, or reviewing styles in any repo or engine.
---

# 通用样式编写规范

一句话：**先探配置，再看邻居，再复用已有抽象，再写 utility；只有更高层抽象或 utility 表达不了时才落 CSS。**

两条前提，先于一切技巧：

- **能写什么，由目标项目的实际配置、依赖版本和构建链决定，不由记忆决定。** 同一个 `md:`、`!`、attribute 写法或 shortcut，在不同项目里可能语义不同，甚至根本不存在。
- **写法以项目既有代码为准，优先于本 skill 的默认偏好，更优先于“通用最佳实践”。** 在陌生仓库里，这条比任何个人经验都值钱。

## 规则强度

为了区分“必须遵守”和“个人口味”，本 skill 使用以下强度：

- **MUST**：必须遵守；除非项目事实明确要求例外。
- **SHOULD**：默认遵守；有明确理由可以偏离。
- **PREFER**：偏好，不是硬规则。
- **AVOID**：通常避免；需要有明确理由才使用。
- **NEVER**：明确禁止。

后文没有显式标签的句子，默认按上下文中的标题强度理解。

## 目录与维护边界

本 skill 故意分成两类内容：

```text
moomfe-styling/
├── SKILL.md                    # 核心规则：跨项目复用
├── references/                 # 共享参考：跨项目复用
└── notes/                      # 项目笔记：仅属于当前宿主项目
```

### `SKILL.md` 与 `references/`

- **MUST**：视为可跨项目复制的共享内容，保持项目无关。
- **MUST NOT**：在执行普通开发任务时，因为当前项目的某个具体实现而直接修改这里的内容。
- 如果发现某条规则与当前项目事实冲突，**先以项目事实和邻居代码为准**，再把项目特有例外记录到 `notes/`。
- 只有用户明确要求“更新通用 moomfe-styling skill / reference”时，才修改这里的共享规范；修改后应确保新内容仍然适用于多个项目。

### `notes/`

- `notes/` 是**宿主项目私有知识区**，不参与跨项目复制。
- **SHOULD**：把当前项目值得长期沉淀、但不适合写入通用 Skill 的内容放这里，例如实际 breakpoint、shortcut、token、第三方组件覆盖方式、历史坑点、特殊例外。
- **MUST NOT**：为了“记录一下”而自动修改 `notes/`；只有当这些信息对后续任务有持续价值时才沉淀。
- 项目迁移或复制 moomfe-styling skill 到新仓库时，可以**整目录排除 `notes/`**。

一句话：**`references/` 记录“通用知识”，`notes/` 记录“这个项目的事实”。**

## 优先级

发生冲突时，按以下顺序判断：

1. **项目已有规范、组件能力与实现模式**
2. **项目 lint / formatter / stylelint / 构建工具的实际约束**
3. **本 skill 的 MUST / NEVER**
4. **本 skill 的 SHOULD / PREFER**
5. **个人审美与习惯**

一句话：**先服从项目事实，再应用个人习惯。**

---

# 第 0 步：探明这个项目的样式体系

**MUST**：动手前先确认当前项目实际能写什么，以及样式应该落在哪里。

建议按这个顺序检查：

| 要确定 | 优先检查 | 决定什么 |
| --- | --- | --- |
| 项目基线 | `AGENTS.md` / README / 项目规范 | 当前项目采用什么样式体系、落点与约定 |
| 依赖与版本 | `package.json` / lockfile | 实际引擎、版本与插件是否存在 |
| 引擎 | `uno.config.*` / `unocss.config.*` / `tailwind.config.*` / CSS 入口 / 构建配置 | 能写哪套 utility |
| preset / plugin | UnoCSS preset、transformer、Tailwind plugin 等实际配置 | utility、variant、directive 的来源 |
| attributify | UnoCSS `presetAttributify(...)` 及相关配置 | 能不能把 utility 写成属性、是否需要前缀 |
| variant group | UnoCSS `transformerVariantGroup()` | 能不能写 `foo-(a b)` / `hover:(...)` |
| 自定义词汇 | UnoCSS `shortcuts` / `rules` / `theme`；Tailwind `@theme` / plugins | 项目已有 shortcut、token、颜色、间距等 |
| 禁用项 | UnoCSS `blocklist` / Tailwind source 配置与项目 lint | 哪些写法明确不允许或不会生成 |
| 断点 | 实际 theme / `screens` / breakpoint 配置 | 档位、方向、宽度、是否有 `max-*` / `lt-*` / `at-*` 等变体 |
| `!` 的位置 | 实际引擎与版本 | 如何覆盖第三方组件默认样式 |
| 第三方 UI 库 | `package.json` + 组件主题文档/现有代码 | 覆盖策略、token、props、slots 与主题能力 |
| CSS 层 | 全局样式入口、组件 `<style>`、CSS Modules、`@apply` / `:deep()` / `:global()` 用法 | 兜底时写在哪、怎么写 |

### 第 0 步的完成判据

完成后，至少能回答：

- 这个项目的样式引擎是什么？具体版本是什么？
- utility 从哪里来？preset / plugin / transformer 有哪些？
- 哪些自定义 token / shortcut / 规则可以复用？
- breakpoint 与状态变体怎么写？
- 当前文件应该把样式写在 template、`class` / `className`、attributify、`<style>` 还是全局 CSS？
- 第三方组件应该优先通过什么方式定制？

### 兜底

**MUST**：配置读不到、版本含糊或存在冲突时，只使用已确认的最小公共子集：引擎官方明确支持的 utility + 项目已有的 `class` / `className` / `<style>` 写法。

**NEVER**：为了“让 utility 生效”顺手给项目引入 UnoCSS、Tailwind、插件、preset 或新的构建能力。引擎选择是项目基线决策，不是一次样式任务顺手完成的工作。

### 项目还没有 utility 引擎

按项目已有样式落点写原生 CSS / SCSS：例如 Vue SFC 的 `<style>`、HTML 的样式表、React 的既有样式方案等。

只记录“项目目前没有 utility 引擎”这一事实，不在本次样式任务里擅自更换技术栈。

---

# 第 1 步：先看邻居

**MUST**：写新样式前先看同目录、同业务域或同组件类型里已经存在的相似 UI。

至少回答：

- 同类 UI 用什么 utility / shortcut / 组件能力？
- class / attribute 怎么组合？
- 是否已经存在可复用 token、变量、语义类、helper 或组件 prop？
- 样式落在模板、组件 `<style>`、全局样式还是别的层？
- 是否存在项目特有的排序、缩写、命名和覆盖方式？

**PREFER**：抄“形状”，不是抄具体数值。已有实现是判断当前项目风格的证据，不是要求所有页面机械复制。

---

# 第 2 步：决定样式落点

**MUST**：不要直接从“我要写 CSS”开始，而要先判断当前需求应该落在哪个抽象层。

按以下顺序判断：

```text
组件已有能力
  ↓ 不足
项目已有 token / utility / shortcut / helper
  ↓ 不足
直接 utility
  ↓ 重复且语义稳定
semantic class / shortcut / 项目级抽象
  ↓ utility 或已有抽象无法表达
CSS / SCSS
```

具体规则：

1. **组件能力能解决** → 用 props / slots / theme API / 组件配置。
2. **已有 token / utility / shortcut 能解决** → 复用，不另造一套。
3. **局部简单样式** → 默认直接写 utility。
4. **视觉模式重复且语义稳定** → 评估 shortcut / semantic class / 组件抽象，而不是把同一长串 utility 复制几十遍。
5. **依赖复杂选择器、伪元素、动画、变量作用域、复杂媒体/容器查询等** → 落 CSS。

**SHOULD**：优先选择当前项目已经存在的抽象层，不为了追求“纯 utility”或“纯 CSS”走极端。

---

# 第 3 步：utility 默认口味

样式表是例外，不是默认。新页面、新组件的局部样式默认优先写在模板 / `className` / attributify 中。

## 书写顺序：由外到内，变体垫底

排序不分载体：`class` 串、attributify 属性、属性值中的片段，都按以下逻辑排序。

| # | 组 | 典型 |
| --- | --- | --- |
| 0 | 命名类垫最前 | 语义类名、图标类（`i-*`） |
| 1 | 尺寸 | `w-full` `h-100` `size-*` `min-h-8` `max-w-120` |
| 2 | 定位与显示 | `relative` `absolute` `sticky` `inset-x-0 top-0` `z-1` `overflow-hidden` `flex` `grid` `inline-flex` |
| 3 | 弹性子项与对齐 | `flex-grow` `flex-none` `items-center` `justify-between` `self-center` `gap-*` |
| 4 | 行高 | `lh-*` `leading-*` |
| 5 | 文字与字体 | `text-sm` `font-medium` `break-words` `truncate` `text-right` |
| 6 | 视觉 | `bg-*` `border` `rounded-*` `shadow-*` |
| 7 | 间距 | `m-*` `p-*` |
| 8 | 交互与动效 | `cursor-pointer` `select-none` `outline-none` `transition-*` `rotate-*` |
| 9 | **变体垫底** | 响应式 → 暗色 → 状态 → 任意选择器 |

示例：

```html
class="w-full flex-(~ col gap-4) lh-tight text-sm mt-10 [&>div]-(flex gap-2)"
```

补充：

- 行高经常参与文本垂直对齐，因此排在文字之前。
- 同一层变体之间：响应式从小到大，暗色在状态之前，结构选择器最后。
- 任意选择器如果已经成为整串的主要表达，可以整串提到最前；覆盖第三方组件时尤其常见。
- 这是**可读性约定**，不是工具必然要求；项目如果存在自动排序规则，则以项目工具输出为准。

---

# Variant group

**PREFER**：同一前缀达到 **≥2 项** 时可以合并。

```html
class="p-(x3 y1.5)"
class="flex-(~ col gap-4)"
class="hover:(bg-blue c-white)"
```

规则：

- 一组 ≤ 5 项；不要为了凑数量硬分组。
- 组内顺序沿用组外顺序。
- `~` 表示“组头本身”时，**永远写在组内第一个**。
- 变体本身也可以成组：`hover:(...)`、`md:(...)`，前提是项目实际启用了对应 transformer。
- `!` 在组内怎么写，以项目实际引擎版本为准。
- **AVOID**：多层嵌套导致一行难以阅读。超过可读阈值时，优先考虑 semantic class / shortcut / 拆组件，而不是继续压缩。

**MUST**：Tailwind 等不支持 variant group 的引擎里，不要照搬这个写法；详见对应 reference。

---

# Attributify

仅在项目实际启用 attributify 时使用。

```html
<div items-center size-full w-full relative>
<div flex="~ items-center gap-3">
<div text="sm slate-5">
```

规则：

- 完整 utility 名称用无值属性：`items-center`、`max-w-3xl`、`text-2xl`。
- 属性值留给需要组合的片段：`p="6 lt-md:4"`、`text="sm gray-500"`。
- 混用时保持分工：**`class` 留给结构选择器、复杂覆盖与必须用 class 表达的内容；attributify 负责元素自身的 utility。**
- 变体写在值里：`hover="bg-gray bg-op-10"`、`bg="#f2f3f5 dark:#3a3a3d"`、`w="70% lt-md:75%"`，前提是项目配置支持这些写法。
- 同一件事只表达一次；不要同时在 attribute 和 `class` 写相同 utility。
- 属性名与真实 props 冲突时，再按项目的 `prefix` / `prefixedOnly` 约定加前缀。
- JSX / TSX 是否能直接写无值 attributify 属性，取决于项目是否配置相应 transformer；默认不要假设能用。

---

# 条件 class

**SHOULD**：保持分支短小、可读、静态可分析。

```html
:class="{ 'mt-4': !isPreview }"
:class="active ? 'bg-blue' : 'bg-gray'"
```

对于多个状态：

- 优先使用静态 class 映射对象。
- 不要直接拼接 utility 名称。
- 分支复杂到无法一眼理解时，考虑抽组件、composable 或 semantic class。

---

# 动态 utility：禁止凭字符串拼接生成 class

**MUST**：不要这样构造 utility：

```ts
`bg-${color}-500`
`mt-${size}`
`text-${level}`
```

优先使用完整、静态可检测的映射：

```ts
const colorClass = {
  primary: 'bg-primary-500',
  danger: 'bg-red-500',
  success: 'bg-green-500',
}
```

原因不是语法问题，而是大多数 utility 引擎依赖构建期静态提取；动态拼接可能导致对应 CSS 根本没有生成。

如果项目确实需要动态组合：

1. 优先改成静态映射；
2. 其次使用项目已有的 safelist / source registration 机制；
3. 最后才考虑真正的 runtime 方案，并遵循项目现有架构。

详见 `references/troubleshooting.md` 与对应引擎 reference。

---

# 任意值

**SHOULD**：把 arbitrary value 当成“局部例外”，而不是 token 系统的替代品。

优先级：

```text
项目 token
  > 已有 utility
  > 已有 shortcut / semantic class
  > CSS variable
  > arbitrary value
  > 新写 CSS declaration
```

例如：

```html
bg-[var(--brand-border)]
w-[437px]
```

都可以有合理用途；但如果相同 arbitrary value 在多个业务区域重复出现，应该重新评估是否应提升为：

- 项目 token
- CSS custom property
- theme token
- shortcut
- semantic class

**AVOID**：为了省事到处写 `13px`、`17px`、`#1a1b1c`、`w-[437px]` 等离散值。

---

# 响应式、暗色、状态

## 响应式

**MUST**：响应式断点、方向与语法以项目实际配置为准，不凭记忆写 `md:` / `lg:`。

**SHOULD**：优先使用引擎已有的 breakpoint variant；只有项目没有对应能力时才落 `@media` / `@container`。

## 暗色

**PREFER**：优先使用第三方组件库自己的主题 API 与项目已有 CSS custom properties。

只对真正缺失的局部样式补 `dark:` 或等价能力。

暗色触发方式（`.dark`、媒体查询、data attribute 等）以项目配置为准。

## 状态

**PREFER**：

- `hover:` / `focus:` / `disabled:` 等状态变体表达单节点状态；
- 父级驱动子级时优先 `group` / 对应父子状态机制；
- 复杂结构状态需要 `:has` / `:nth-child` / `+` / `~` 等时，再考虑 CSS。

**NEVER**：为了表达一个简单伪类状态，在 CSS 中重新写一遍 utility 能直接表达的样式。

---

# 主题与 token

**MUST**：主题中需要运行时切换的值使用 CSS custom properties 或项目等价的 token 机制，不使用仅在编译期存在的 Sass 变量作为运行时主题载体。

根据项目引擎选择对应的 token 层：

- UnoCSS → 项目现有 `theme` / `shortcuts` / CSS custom properties
- Tailwind v4 → 优先使用 `@theme` 等其原生 token 机制，运行时变化仍使用 CSS custom properties
- 纯 CSS / SCSS → `:root` / scope selector + CSS custom properties

变量声明集中在项目约定的位置；组件级变量才放在组件自己的样式块中。

---

# 什么时候才落 CSS

以下情况可以直接成为落 CSS 的理由：

| 触发 | 为什么 utility / 已有抽象可能不够 |
| --- | --- |
| 多跳第三方组件内部结构 | 目标节点不在当前模板控制范围 |
| 有状态的结构选择器 | `:has` / `:not` / `+` / `~` / `:nth-child` / `:empty` 等依赖元素关系 |
| 伪元素 | `::before` / `::after` 需要自己撑出盒子、内容或复杂定位 |
| `@keyframes` | 没有合适的项目 utility 能力 |
| CSS custom properties 的声明 / scope | 变量作用域本身就是 CSS 层的职责 |
| 跨页面复用的稳定语义类 | 同一组样式被大量复用，逐处复制 utility 反而降低维护性 |
| 复杂媒体 / 容器查询 | 引擎现有变体覆盖不到 |
| 组件 / 框架的样式边界机制 | 如 Vue `:deep()`、CSS Modules `:global()` 等 |

**不是理由**：

- 只是需要一个子选择器 → 能用任意选择器 variant 就优先用；
- 只是差一个属性 → utility / `@apply` / 单行 declaration 能解决就不要扩张成复杂 CSS；
- 只是 class 太长 → 先判断是不是应该做 semantic class / shortcut / 拆组件，而不是机械搬进 CSS。

**MUST**：落 CSS 前先阅读 `references/writing-css.md`。

---

# 命名与规则体

项目没有明确约定时，默认：

- 类名：kebab-case
- 组件级语义类：可采用 BEM `block__element` / `block--modifier`
- 框架级 / 领域级样式：按项目已有前缀避免全局撞名
- CSS 嵌套：≤ 3 层
- `&`：主要用于伪类、伪元素、BEM 修饰符与必要的结构组合
- 注释：写在块上方，说明“这块是干什么的”，不写“这是哪个属性”
- 缩进：2 空格

**MUST**：如果项目已有自己的命名、嵌套、缩进或 formatter 规则，以项目规则为准。

---

# 第三方组件库覆盖顺序

**MUST**：按以下顺序寻找覆盖手段：

1. 组件自身 props / slots / theme API；
2. 组件库暴露的 design token / CSS custom properties；
3. utility + `!`（位置由实际引擎版本决定）；
4. 框架支持的深度选择器 / global 选择器；
5. 全局样式表。

**NEVER**：直接修改依赖包、构建产物或上游模板层来解决业务页面的局部样式问题。

---

# 分层项目：不要改上游

如果项目存在 layer / packages / 模板层：

- 业务覆盖写在业务层或项目约定的全局入口；
- **NEVER** 修改会在同步时被覆盖的上游层样式；
- 如果一个缺口实际上属于上游设计系统，应记录并交回对应维护层，而不是在业务层长期打补丁。

---

# 静默失效：写完必须自检

utility 引擎里，“类名写错”常常不是编译错误，而是没有样式。**MUST**：写完至少检查：

1. 每个 utility / attributify 属性都能在第 0 步确认的来源里解析。
2. 没有凭记忆写项目未确认的 breakpoint、variant、shortcut 或 preset-specific abbreviation。
3. utility 排序符合项目规则；没有自动排序器时按本 skill 的顺序。
4. 同前缀达到阈值的 variant group 已合并，但没有为了压缩而牺牲可读性。
5. 没有重复表达同一 utility：attribute 与 `class`、shortcut 与原子 utility 不应无意义叠加。
6. 动态 class 没有使用无法静态检测的字符串拼接，或已经按项目机制处理。
7. arbitrary value 有明确局部理由，没有替代已有 token。
8. 响应式方向与档位和邻居一致。
9. 没有为了一个局部属性无理由新开样式表。
10. 样式落点和邻居一致。
11. 最终在浏览器 / dev server / Playwright 中验证视觉结果；**构建通过不能证明样式真的生效**。

---

# Reference 读取规则

只在确有需要时读取 references，避免每次把整个样式知识库加载进上下文：

| 场景 | 读取 |
| --- | --- |
| 这次真的需要写 CSS / SCSS | `references/writing-css.md` |
| UnoCSS / attributify / variant group / transformer | `references/unocss.md` |
| Tailwind v3 | `references/tailwind-v3.md` |
| Tailwind v4 | `references/tailwind-v4.md` |
| 样式不生效 / 动态 class / 覆盖失败 / @apply 报错 | `references/troubleshooting.md` |

核心 skill 只负责**“怎么判断”**；reference 负责**“这个引擎当前具体怎么写”**。
