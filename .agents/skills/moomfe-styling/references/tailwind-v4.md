<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# Tailwind CSS v4 参考

本文件只在项目确认使用 Tailwind CSS v4 时读取。

## 1. CSS-first 主题与配置

Tailwind v4 的 theme / token 主要可以在 CSS 中通过 `@theme` 定义：

```css
@theme {
  --color-brand-500: oklch(...);
  --breakpoint-3xl: 120rem;
}
```

项目如果同时保留 v3 的 `tailwind.config.*`，先确认项目是否处于兼容 / 渐进迁移状态，不要假设所有配置都等价。

## 2. `!important` modifier

Tailwind v4 推荐把 `!` 放在 utility 尾部：

```html
class="mt-0!"
```

旧的前缀方式可能仍能兼容，但新代码遵循项目实际版本与既有代码。

## 3. 响应式

Tailwind v4 默认使用 mobile-first breakpoint 变体，并支持 `max-*` 限定范围，例如：

```html
md:max-xl:flex
```

也支持 `min-[...]` / `max-[...]` 这类 arbitrary breakpoint，以及 container query 相关 variant。

**MUST**：具体 breakpoint 名称和项目 token 仍以当前项目 `@theme` / 实际配置为准。

## 4. `@apply` 与 `@reference`

在 Vue / Svelte 组件的 `<style>`、CSS Modules 等独立 stylesheet context 中，如果使用 `@apply` / `@variant`，需要让当前 stylesheet 能访问主题变量、custom utilities 与 custom variants。

项目常见方式：

```vue
<style scoped>
@reference "../../app.css";

.wrapper {
  @apply flex items-center;
}
</style>
```

如果只使用 Tailwind 默认 theme，也可以 reference `tailwindcss`。

**MUST**：引用哪个文件，以项目主样式入口为准。

## 5. `@utility`

Tailwind v4 可以用 `@utility` 定义可参与 variants 的自定义 utility：

```css
@utility tab-4 {
  tab-size: 4;
}
```

是否应该定义新的 utility，不由语法能力决定，而由项目抽象策略决定：

- 一次性局部样式 → 不要创建 custom utility；
- 稳定、语义清晰、可复用的 utility 行为 → 可以评估；
- 属于组件视觉，而非 utility → 更适合 component / semantic class。

## 6. 动态 class

Tailwind v4 仍然依赖构建期 source detection。不要直接拼接 utility token：

```js
`bg-${color}-600`
```

优先把完整 class 写进静态映射中。

需要额外 source / safelist 行为时，按 v4 的 `@source` 机制与项目现有入口处理。

## 7. `@theme` 与运行时主题

`@theme` 适合定义参与 Tailwind utility 生成的 design token；运行时明暗主题等动态值仍可以通过 CSS custom properties 覆盖。

不要为了运行时切换而把所有主题值硬编码成仅编译期存在的 Sass 变量。
