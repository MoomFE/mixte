<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# 落 CSS 时怎么写

本文件只在“这次真的要写 CSS / SCSS”时读取。

## 1. 什么时候值得写

优先满足 `SKILL.md` 的抽象决策链。确认 utility / shortcut / component API 不够，再进入 CSS。

| 触发 | 为什么 utility / 已有抽象不够 |
| --- | --- |
| 多跳第三方组件内部结构 | 目标节点在组件库内部，模板层不直接控制 |
| 有状态的结构选择器 | `:has` / `:not` / `+` / `~` / `:nth-child` / `:empty` 等依赖关系 |
| 伪元素 | `::before` / `::after` 需要内容、定尺寸或复杂定位 |
| `@keyframes` | 需要声明动画帧 |
| CSS variable 的声明与 scope | 变量的作用域本身属于 CSS 层 |
| 稳定、跨页面复用的语义类 | 多处重复 utility 已明显损害可读性和维护性 |
| 复杂 media / container query | 引擎现有 variant 无法表达 |
| framework style boundary | Vue `:deep()`、CSS Modules `:global()` 等 |

**不是理由**：

- 只是一个子选择器：能用项目已启用的 arbitrary selector / variant 就先用；
- 只是一个属性：utility / `@apply` / 单行 declaration 可以表达时不要扩大范围；
- 只是 class 很长：先判断应该做 semantic class / shortcut / 拆组件。

---

## 2. 规则体默认保持最小化

默认目标不是“把 utility 搬进 CSS”，而是只把**确实属于 CSS 层的东西**留在 CSS。

### 普通 declaration

只覆盖一个或少量属性时，可以直接写：

```css
.some-item {
  border-bottom-color: var(--brand-border);
}
```

### `@apply`

如果项目引擎支持 `@apply`：

- **PREFER**：用它表达一个稳定语义类与已有 utility 的关系；
- **AVOID**：为了让 HTML 少几个 class 就把大串 utility 搬进 CSS；
- **AVOID**：一个语义不稳定的局部样式也硬抽成 `@apply`；
- 一旦只剩一个局部声明，直接写 CSS declaration 往往更清楚。

例如：

```scss
.some-wrapper {
  @apply h-9 absolute top--9 right-0 flex items-center;
}
```

但如果这个组合只使用一次，且没有稳定语义，优先回到模板 utility。

### Tailwind v4 组件级 `<style>`

在 Vue / Svelte 组件的 `<style>`、CSS Modules 等独立 stylesheet context 中使用 `@apply` / `@variant` 时，确认项目是否需要通过 `@reference` 引入主样式上下文。不要假设组件级 `<style>` 自动拥有 theme / custom utility / custom variant。

示例：

```vue
<style scoped>
@reference "../../app.css";

.wrapper {
  @apply flex items-center;
}
</style>
```

如果项目只使用 Tailwind 默认 theme，Tailwind v4 也支持直接 reference `tailwindcss`；最终以项目入口与构建方式为准。

---

## 3. 主题用 CSS custom properties

运行时主题值不要依赖 Sass 变量。

```css
:root {
  --brand-border: #d0d5dd;
}

html.dark {
  --brand-border: #344054;
}
```

原则：

- 运行时可切换的值 → CSS custom properties；
- 需要参与 utility 生成的 design token → 使用项目引擎自己的 theme/token mechanism；
- 变量声明集中在项目规定的入口；
- 组件局部变量才放组件样式块。

---

## 4. 复用级别

判断重复样式时，不按“出现次数”机械决定，而看语义稳定程度：

```text
单次局部例外
→ 直接 CSS / utility

局部重复，但语义不稳定
→ 保持局部，不急着抽象

多处重复，视觉语义稳定
→ semantic class / shortcut / component

跨页面、跨领域、属于设计系统
→ token / design-system abstraction
```

**NEVER**：为了抽象而抽象。

---

## 5. 命名与嵌套

项目没有约定时：

- 类名 kebab-case；
- 组件级可采用 BEM `block__element` / `block--modifier`；
- 框架 / 领域样式加前缀避免全局撞名；
- 嵌套 ≤ 3 层；
- `&` 主要用于伪类、伪元素、BEM modifier 与必要的结构组合；
- 注释写“为什么 / 这块负责什么”，不写“这是 margin”；
- 2 空格缩进。

项目 formatter / stylelint / 既有文件优先。

---

## 6. 第三方组件覆盖

按以下顺序：

1. props / slots / theme API；
2. design token / CSS custom properties；
3. utility + `!`；
4. 深度 / global selector；
5. 全局样式。

不要直接修改依赖包或构建产物。

---

## 7. Vue / CSS Modules 的边界

### Vue SFC

根据项目实际使用：

- `<style scoped>`；
- `:deep(...)`；
- `:global(...)`；
- `lang="scss"`；
- 全局 `<style>`。

不要凭经验把某一套方式硬套到陌生项目。

### CSS Modules

全局第三方类需要显式进入 global scope；局部业务类保持 module scope。

---

## 8. 分层项目

如果项目存在：

```text
上游模板 / shared package
        ↓
业务层 / app layer
        ↓
页面 / 组件
```

业务覆盖写在业务层或项目规定的 override layer。

如果某个问题本质上是 design-system / upstream 的缺陷，记录问题并交回正确维护层，而不是长期堆业务补丁。
