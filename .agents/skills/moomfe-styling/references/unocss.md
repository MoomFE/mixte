<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# UnoCSS 参考

本文件只在当前项目确认使用 UnoCSS 时读取。

## 1. 先确认 preset / transformer

不要把“UnoCSS 支持什么”理解成“当前项目一定能写什么”。实际能力取决于项目装载的 preset、transformer、theme、shortcuts、rules、blocklist、safelist 和 extractor。

重点检查：

```text
uno.config.*
package.json
```

尤其确认：

- `presetWind3` / `presetWind4` 等实际 preset；
- `presetAttributify()`；
- `transformerVariantGroup()`；
- `transformerDirectives()`；
- 自定义 `shortcuts` / `rules` / `theme`；
- `blocklist` / `safelist`；
- 项目是否使用额外 extractor。

## 2. Variant group

只有项目配置 `transformerVariantGroup()` 后才使用：

```html
<div class="hover:(bg-gray-400 font-medium)" />
```

```html
<div class="font-(light mono)" />
```

项目如果没有该 transformer，不要凭记忆启用这一写法。

## 3. Attributify

只有项目启用 `presetAttributify()` 时才使用。

无值形式：

```html
<div text-center text-5xl />
```

值形式：

```html
<div text="sm slate-5" />
<div flex="~ items-center gap-3" />
```

具体 prefix / prefixedOnly / blocklist 以项目配置为准。

### JSX / TSX

JSX / TSX 的无值 attributify 不是天然可用的；需要项目配置 `transformerAttributifyJsx()` 等相应能力。

没有该 transformer 时，JSX 会把无值属性按布尔属性处理，不要直接照搬 Vue / HTML 写法。

## 4. `@apply`

UnoCSS 使用 `@apply` 需要项目启用 `transformerDirectives()`（或项目等价配置）。

```css
.custom-div {
  @apply text-center my-0 font-medium;
}
```

不要因为“项目用了 UnoCSS”就假设 `@apply` 一定可用。

## 5. 动态 utility

UnoCSS 默认构建期提取，动态字符串可能无法被提取：

```ts
`p-${size}`
```

优先静态映射：

```ts
const classes = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
}
```

确实无法静态表达时，再考虑项目已有 `safelist` 或其它明确的生成机制。

## 6. preset 差异

简写能力不是“UnoCSS 这个名字”本身保证的，而是 preset / 规则的结果。

例如：

- 不要因为过去在某个 Wind preset 里见过 `r-*`，就假设另一个 preset 也有；
- 不要因为某个项目允许 `b-*`，就假设所有 UnoCSS 项目都允许；
- 不要因为 IDE 自动补全能出现某个 utility，就认定构建链一定会生成它。

最终以当前项目实际 preset / config / build result 为准。

## 7. blocklist / safelist

### blocklist

如果项目把某些别名或写法列入 blocklist，不要换一种写法绕过项目约定。

### safelist

如果确实需要构建期未直接出现在 source 中的 utility，按项目现有 safelist 机制处理。

不要为一次性的动态 class 随意扩大 safelist 范围。
