<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# JSX 渲染片段

> 触发条件：需要在弹窗、消息框、表格单元格、分页器等场景**动态 / 命令式地生成渲染片段**，且项目支持 JSX（`.tsx` 文件或 `<script lang="tsx">`）。
> 非强制模式：能用 SFC + 插槽清晰表达时，用 SFC 也可以；JSX 是"这类场景更顺手"的选择，不是全局偏好。

## 适用场景

- 确认框 / 提示框内容需要编程式构造：`ElMessageBox.alert(() => (<div>...</div>), {...})`。
- composable 需要返回"渲染能力"，而不是逼调用方重复写模板（如分页器、批量结果弹窗）。
- 表格列 `renderCell`、自定义插槽内容需要内联组合组件与表达式。

## 写法约定

- composable 内定义 `const RenderXxx: FunctionalComponent<Props> = (props) => (<...>)`，随返回值一起导出；命名一律 `Render*` 前缀。
- 需要接收数据时给 `FunctionalComponent` 加泛型 props；从 props 读取数据，避免闭包取外部可变状态。
- JSX 中的插槽用对象字面量：`{{ default: () => ..., footer: () => ..., ...ctx.slots }}`。
- 在 `.vue` 内使用 JSX 时 script 块写 `lang="tsx"`；纯函数式组件放 `.tsx` 文件。
- SFC 组件可直接在 JSX 中 import 使用，无需特殊处理。
- 需要转发外部传入的 attrs / slots 时显式透传（`{...ctx.attrs}`、`...ctx.slots`），保持与 SFC 组件的组合语义一致。

## 边界

- 项目必须已启用 Vue JSX 支持；未配置的项目里不要引入（先确认项目现状）。
- 模板能直接表达的静态 UI 留在 SFC，不要为 JSX 而 JSX。
