## [Unreleased]
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 支持不同的渲染模式
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 新增 `options` 导出变量

## [v3.5.0-beta.13]
  - 📅 2025-08-12
  - 🐞 [@mixte/components] 修复 `GridTable` 列配置 `colSpan` 和 `rowSpan` 传入参数错误的问题 *

## [v3.5.0-beta.12]
  - 📅 2025-08-12
  - 💄 [@mixte/components] 组件 `GridTable` 新增鼠标悬停行背景变色 *
  - 💄 [@mixte/components] 组件 `GridTable` 的列配置新增 `colSpan` 和 `rowSpan` 参数, 用于行列合并功能 *
  - 💄 [@mixte/components] 组件 `GridTable` 新增 `bordered` 控制是否展示外边框和列边框 *
  - 💄 [@mixte/components] 优化 `GridTable` 判断是否显示展开按钮的逻辑, 避免重复遍历树数据 *
  - 🐞 [@mixte/components] 修复 `GridTable` 在 SSR 环境下使用 CSS.supports 可能报错的问题 *

## [v3.5.0-beta.11]
  - 📅 2025-08-07
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 的 `optionsApi.params`, 返回数组不会认为是 iterator, 而是直接传入 *
  - 💄 [@mixte/components] 组件 `GridTable` 的列配置新增 `visible` 和 `hidden` 参数, 支持动态控制列的显示和隐藏 *
  - 💄 [@mixte/components] 组件 `GridTable` 表头插槽和表头渲染函数传入 `title` 参数

## [v3.5.0-beta.10]
  - 📅 2025-08-06
  - 💄 [@mixte/components] 优化 `GridTable` 加载中蒙版层级实现逻辑 *
  - 💄 [@mixte/components] 优化 `GridTable` 表格字段单元格插槽传入的 record 参数类型, 变得更为宽松 *
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 的 `optionsApi` 新增 `params`, 会传入 `api` 方法, 发生改变后会触发重新请求

## [v3.5.0-beta.9]
  - 📅 2025-08-04
  - 💄 [@mixte/components] 优化 `GridTable` 表格列配置类型, 支持当显式指定泛型参数时, 类型更宽松 *
  - 💄 [@mixte/components] 优化 `GridTable` 无数据层高度, 最大跟随父组件高度, 最低 `150px` *
  - 🐞 [@mixte/components] 修复 `GridTable` 加载中蒙版层级过低未遮挡固定列的问题 *
  - 🐞 [@mixte/components] 修复 `GridTable` 加载中蒙版和图标会随着横向滚动一起移动的问题 *
  - 🐞 [@mixte/components] 修复 `GridTable` 无数据层会随着横向滚动一起移动的问题 *

## [v3.5.0-beta.8]
  - 📅 2025-08-02
  - 💄 [@mixte/components] 组件 `GridTable` Props 新增单元格样式类参数 *
  - 💄 [@mixte/components] 组件 `GridTable` 的第一列和最后一列添加 `mixte-gt-cell-{first|last}` 样式类 *
  - 🐞 [@mixte/components] 修复 `GridTable` 空数据时最后一列的表头分割线依然显示的问题 *

## [v3.5.0-beta.7]
  - 📅 2025-08-01
  - 💄 [@mixte/components] 优化 `GridTable` 组件插槽类型, 支持不在类型定义中的字段名显示类型提示 *
  - 💄 [@mixte/components] 优化 `GridTable` 组件固定列堆叠逻辑, 使 `...-fix-*-active` 样式类只在列被真实固定时被应用 *
  - 💄 [@mixte/components] 组件 `GridTable` 的左右已固定列中的最后一列, 增加 `...-fix-*-active-last` 样式类 *
  - 💄 [@mixte/components] 组件 `GridTable` 新增表头分割线 *
  - 🐞 [@mixte/components] 修复 `GridTable` 超过 2 个固定列时, 后续的固定列无法固定的问题 *

## [v3.5.0-beta.6]
  - 📅 2025-07-25
  - 🌟 [mixte] 新增 `get`, `set` 工具方法
  - 💄 [@mixte/components] 组件 `GridTable` 通过 `expandedRowKeys` 绑定了非树形数据的 `keys` 时, 会自动移除掉 *
  - 💄 [@mixte/components] 组件 `GridTable` 字段配置的字段名 `field` 支持传入字段路径 *
  - 💄 [@mixte/components] 组件 `GridTable` 字段配置的表头名称 `title` 支持函数形式传参 *
  - 💄 [@mixte/components] 组件 `GridTable` 字段配置的列宽度 `width` 支持函数形式传参 *
  - 🐞 [@mixte/components] 修复 `GridTable` 启用虚拟列表并且无预渲染的行数时, 渲染的数据行缺失的问题 *

## [v3.5.0-beta.5]
  - 📅 2025-07-15
  - 💄 [@mixte/components] 组件 `GridTable` 表头及表体单元格新增 `data-*` 自定义属性 *
  - 💄 [@mixte/components] 组件 `GridTable` 对树形数据展开/收起状态时应用不同的 `class` *
  - 💄 [@mixte/components] 组件 `GridTable` 新增 `expandedIndent` 属性以自定义树形数据缩进宽度 *
  - 💄 [@mixte/components] 组件 `GridTable` 内置 css 导入 *
  - 💄 [@mixte/components] 组件 `GridTable` 新增展开/折叠行方法 *

## [v3.5.0-beta.4]
  - 📅 2025-07-01
  - 💄 [@mixte/components] 组件 `GridTable` 支持展开树形数据功能 *
  - 💄 [@mixte/components] 优化 `GridTable` 组件虚拟列表的动态高度计算相关逻辑 *
  - 💄 [@mixte/use] 优化 `useRequest` 的 `UseRequestOptions` 类型定义 *
  - 💄 [@mixte/components] 组件 `GridTable` 默认导出新增 `defineTableColumns` 方法导出 *
  - 💄 [@mixte/components] 组件 `GridTable` 列配置新增单元格样式类参数 *

## [v3.5.0-beta.3]
  - 📅 2025-06-19
  - 🌟 [@mixte/use] 为 `useRequest`, `useRequestReactive` 新增 `onSuccess` `onError` `onFinally` 配置项
  - 💄 [@mixte/components] 组件 `GridTable` 表格列支持通过 `headerRender` 渲染表头 *
  - 💄 [@mixte/components] 组件 `GridTable` 新增支持通过插槽渲染单元格及表头单元格 *
  - 💄 [@mixte/components] 组件 `GridTable` 新增对虚拟列表的支持 *
  - 💄 [@mixte/use] 优化 `useRequest`, `useRequestReactive` 类型定义

## [v3.5.0-beta.2]
  - 📅 2025-06-03
  - 🐞 [@mixte/components] 修复 `GridTable` 组件样式未导出的问题 *

## [v3.5.0-beta.1]
  - 📅 2025-06-03
  - 🌟 [@mixte/components] 新增 `GridTable` 组件

## [v3.4.1]
  - 📅 2025-05-12
  - 🌟 [mixte] 新增 `deepFind`、`deepSome`、`deepForEach` 函数选项，支持嵌套数组结构的深度查找
  - 💄 [@mixte/snippets] 优化 `toggleThemeViewTransition` 在主题切换时鼠标样式为 `pointer`

## [v3.4.0], [-beta.10][v3.4.0-beta.10], [-beta.9][v3.4.0-beta.9], [-beta.8][v3.4.0-beta.8], [-beta.7][v3.4.0-beta.7], [-beta.6][v3.4.0-beta.6], [-beta.5][v3.4.0-beta.5], [-beta.4][v3.4.0-beta.4], [-beta.3][v3.4.0-beta.3], [-beta.2][v3.4.0-beta.2], [-beta.1][v3.4.0-beta.1]
  - 📅 2025-05-05
  - 🌟 [@mixte/snippets] 新增 `LowCodeEditor` 相关组件 ( 开发中 )
  - 🌟 [@mixte/snippets] 新增 `Ant Design X` 相关组件 ( 开发中 )
  - 🌟 [mixte] 新增 `pick` 和 `omit` 函数, 支持从对象中选择或排除指定属性
  - 🌟 [mixte] 新增 `deepFind` 函数, 用于在嵌套数据结构中深度查找满足条件的第一个元素
  - 🌟 [mixte] 新增 `deepSome` 函数, 用于在嵌套数据结构中深度检查是否存在满足条件的元素
  - 🌟 [mixte] 新增 `deepForEach` 函数, 用于在嵌套结构数据中深度遍历所有元素, 并为每个元素执行回调函数
  - 🌟 [mixte] 新增 `transformKeys` 函数, 用于转换传入对象的所有键名
  - 🌟 [mixte] 新增 `assertPlainObject` 函数, 用于判断传入参数是否是纯粹的对象, 并进行类型断言
  - 💄 [@mixte/mel-components] 优化组件 `MelSelect` 的 `MelSelectOption` 类型


## [v3.3.0], [-beta.2][v3.3.0-beta.2], [-beta.1][v3.3.0-beta.1]
  - 📅 2025-03-03
  - 🌟 [@mixte/components] 新增 `InfiniteScroll` 组件
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 的 `options` 支持传入 `render` 函数以实现自定义渲染选项
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `options` 插槽以实现自定义渲染选项
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `option-label` 插槽以实现自定义渲染选项内容
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `all-label` 插槽以实现自定义渲染选项内容和标签
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 支持更深层次的数据返回, 更新 `useOptionsApi` 以处理不同结构的响应

## [v3.2.0], [-beta.8][v3.2.0-beta.8], [-beta.7][v3.2.0-beta.7], [-beta.6][v3.2.0-beta.6], [-beta.5][v3.2.0-beta.5], [-beta.4][v3.2.0-beta.4], [-beta.3][v3.2.0-beta.3], [-beta.2][v3.2.0-beta.2], [-beta.1][v3.2.0-beta.1]
  - 📅 2025-02-05
  - 🌟 [@mixte/snippets] 新增 `Tiptap` 编辑器组件 ( 开发中 )
  - 🌟 [@mixte/snippets] 新增 `Lottery` 年会抽奖组件 ( 开发中 )

## [v3.1.0], [-beta.1][v3.1.0-beta.1]
  - 📅 2024-12-22
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 新增 `optionsApi` 参数
  - 🐞 [@mixte/components] 修复 v3 版本以来 组件 `AutoGrid` 丢失 `AutoGridInstance` 类型导出的问题

## [v3.0.0], [-beta.3][v3.0.0-beta.3], [-beta.2][v3.0.0-beta.2], [-beta.1][v3.0.0-beta.1]
  - 📅 2024-12-05
  - 🌟 新增 `@mixte/mel-components` 组件包
  - 🌟 [@mixte/mel-components] 新增 `MelSelect` 组件
  - 💄 [@mixte/components] 组件 `AutoGrid` 新增 `list` 参数
  - ⚠️ [@mixte/use] 调整 `wheneverEffectScope` 的 `watch` 触发时机为同步触发
  - ⚠️ [@mixte/components] 删除 `ListAutoGrid` 组件, 传递列表数据渲染的功能已合并至 `AutoGrid` 组件中
  - ⚠️ [@mixte/snippets] 删除 `AcroDynamicForm` 组件
  - ⚠️ [@mixte/use], [@mixte/components], [@mixte/snippets] 取消对 Vue 2 的支持


## [../v2](https://mixte-v2.moomfe.com)
  - [更新日志](https://mixte-v2.moomfe.com/changelog)

## [../v1](https://mixte-v1.moomfe.com)
  - [更新日志](https://mixte-v1.moomfe.com/changelog)

<br>
<hr>
<br>

版本规范

1. 主版本号: 破坏性更新和新特性
2. 次版本号: 向下兼容的功能新增、功能更改、功能优化
3. 修订版本号: 向下兼容的问题修正、一般功能优化

beta 版本规范

1. 修复当前版本的 beta 版中的 BUG, 使用 `*` 在结尾标注
2. 在当前版本新增的功能的基础上新增/更改功能, 使用 `*` 在结尾标注
3. 发布正式版本时
  - 整合所有 beta 版更新内容到正式版本中, 删除所有 beta 版的更新内容
  - 删除结尾标注 `*` 的更新内容, Github 的 releases 有记录

<br>
<hr>
<br>

CHANGELOG 图标规范

- 🌟: 功能新增<br>
- 💄: 功能更改、功能优化<br>
- ⚠️: 与上一版本可能不兼容的功能更改<br>
- 🐞: 问题修正<br>
- 📅: 版本发布日期

<br>
<hr>
<br>

[Unreleased]: https://github.com/MoomFE/mixte/compare/v3.5.0-beta.13...HEAD
[v3.5.0-beta.13]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.13
[v3.5.0-beta.12]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.12
[v3.5.0-beta.11]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.11
[v3.5.0-beta.10]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.10
[v3.5.0-beta.9]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.9
[v3.5.0-beta.8]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.8
[v3.5.0-beta.7]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.7
[v3.5.0-beta.6]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.6
[v3.5.0-beta.5]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.5
[v3.5.0-beta.4]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.4
[v3.5.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.3
[v3.5.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.2
[v3.5.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.5.0-beta.1
[v3.4.1]: https://github.com/MoomFE/mixte/releases/tag/v3.4.1
[v3.4.0]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0
[v3.4.0-beta.10]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.10
[v3.4.0-beta.9]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.9
[v3.4.0-beta.8]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.8
[v3.4.0-beta.7]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.7
[v3.4.0-beta.6]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.6
[v3.4.0-beta.5]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.5
[v3.4.0-beta.4]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.4
[v3.4.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.3
[v3.4.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.2
[v3.4.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.4.0-beta.1
[v3.3.0]: https://github.com/MoomFE/mixte/releases/tag/v3.3.0
[v3.3.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v3.3.0-beta.2
[v3.3.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.3.0-beta.1
[v3.2.0]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0
[v3.2.0-beta.8]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.8
[v3.2.0-beta.7]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.7
[v3.2.0-beta.6]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.6
[v3.2.0-beta.5]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.5
[v3.2.0-beta.4]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.4
[v3.2.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.3
[v3.2.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.2
[v3.2.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.2.0-beta.1
[v3.1.0]: https://github.com/MoomFE/mixte/releases/tag/v3.1.0
[v3.1.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.1.0-beta.1
[v3.0.0]: https://github.com/MoomFE/mixte/releases/tag/v3.0.0
[v3.0.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v3.0.0-beta.3
[v3.0.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v3.0.0-beta.2
[v3.0.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v3.0.0-beta.1