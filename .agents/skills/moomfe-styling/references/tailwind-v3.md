<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# Tailwind CSS v3 参考

本文件只在项目确认使用 Tailwind CSS v3 时读取。

## 1. 不要把 v4 写法带回 v3

Tailwind v3 主要通过 JavaScript 配置与现有 v3 约定组织 theme、screens、plugins 等能力。

典型入口：

```text
tailwind.config.js / tailwind.config.cjs
```

项目如果同时存在迁移中的 v4 配置，必须以实际构建链与邻居代码为准。

## 2. `!important` modifier

Tailwind v3 中常见写法：

```html
class="!mt-0"
```

不要把 Tailwind v4 的后缀写法直接搬进 v3 项目。

如果在 Sass + `@apply` 中表达 `!important`，还要注意 Sass 对 Tailwind v3 语法的特殊处理；优先查看项目现有写法。

## 3. 响应式

Tailwind v3 默认采用 mobile-first breakpoint 体系。具体 breakpoint 数值与 `screens` 仍以当前项目配置为准。

不要看到 `md:` 就假设它等于某个固定像素值。

## 4. 动态 class

Tailwind v3 扫描 source 中可以静态识别的 class token。不要构造：

```js
`bg-${color}-600`
```

优先：

```js
const variants = {
  blue: 'bg-blue-600 hover:bg-blue-500',
  red: 'bg-red-600 hover:bg-red-500',
}
```

具体 safelist / content 配置以项目版本与构建链为准。
