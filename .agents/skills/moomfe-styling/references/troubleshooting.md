<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# 样式问题排查

本文件用于“代码看起来没问题，但样式没有生效 / 覆盖失败 / 构建异常”的场景。

## 1. utility 完全没有效果

按顺序排查：

```text
1. 类名是否拼错？
2. 当前引擎是否真的生成这个 utility？
3. 对应 preset / rule / theme 是否存在？
4. 是否被 blocklist 排除？
5. source extraction 是否看到了这个 class？
6. 项目是否用了错误的 variant 语法？
7. CSS 是否被构建链 / layer / import 顺序丢掉？
8. 浏览器里最终 CSS 是否存在？
```

不要第一时间改成 CSS。先确认 utility 为什么不存在或为什么没命中。

## 2. 动态 class 导致没有样式

典型错误：

```ts
`bg-${color}-500`
```

优先改成静态映射：

```ts
const colorClass = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
}
```

只有当业务确实需要开放集合时，才考虑 safelist / source registration / runtime generation。

## 3. Tailwind v4 的 `@apply` 报错

先检查：

1. 当前文件是不是 Vue / Svelte `<style>` 或 CSS Module？
2. 是否通过 `@reference` 引用了主样式入口？
3. 主样式入口是否真的加载了 `@import "tailwindcss"` 或项目等价入口？
4. 被 `@apply` 引用的 token / utility 是否属于当前 theme？
5. 是否把 v3 config / plugin 写法直接当成 v4 写法？

## 4. UnoCSS 的 `@apply` 不生效

先确认：

```text
uno.config.*
```

是否真的配置了 `transformerDirectives()` 或项目等价能力。

不要因为“项目安装了 unocss”就假设 `@apply` 可用。

## 5. 第三方组件怎么都覆盖不了

优先顺序：

```text
组件 API
↓
theme / design token
↓
utility + !
↓
:deep / :global
↓
全局 CSS
```

如果已经走到深度选择器：

- Vue：检查 `<style scoped>` 与 `:deep(...)`；
- CSS Modules：检查 `:global(...)`；
- React 等无 scoped 样式：确认类名作用域是否足够窄。

还要检查：

- CSS layer 顺序；
- specificity；
- inline style；
- `!important`；
- 组件是否通过 CSS variable / style attribute 计算最终值。

## 6. responsive 不生效

不要直接把 `md:` 换成另一个档位试错。

先确认：

1. 当前项目 breakpoint 定义；
2. variant 是 min、max 还是 range；
3. 当前 viewport / container size 是否真的进入目标范围；
4. 后写规则或同 specificity 规则是否覆盖了它；
5. 项目是否通过自定义 preset / transformer 改写了 variant 行为。

## 7. dark 不生效

确认项目实际暗色触发方式：

```text
.dark
@media (prefers-color-scheme: dark)
[data-theme="dark"]
其它自定义 selector
```

然后检查：

- trigger 是否真的存在；
- variant 是否绑定到正确 selector；
- 组件库自身 theme 是否覆盖了项目补丁；
- CSS custom property 是否真的在暗色 scope 被重新赋值。

## 8. arbitrary value 变多

这不是单纯的“代码风格”问题，可能表示 token 层缺失。

如果多个地方重复：

```text
same color
same spacing
same radius
same width
same shadow
```

重新评估是否应该提升为 token / variable / shortcut / semantic class。

## 9. 最后一步：看浏览器，而不是只看构建

构建通过只能说明语法 / pipeline 大致通过，不能证明最终视觉正确。

最终至少确认：

- DevTools 里最终 class 存在；
- 目标 CSS rule 存在；
- computed style 是预期值；
- 是否被更高优先级 / 更晚 layer / inline style 覆盖；
- 实际 viewport / container 尺寸是否命中了预期 variant。
