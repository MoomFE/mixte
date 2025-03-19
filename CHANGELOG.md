## [Unreleased]
  - 🌟 [@mixte/snippets] 新增 `Ant Design X` 的 `Welcome` 组件 *
  - 🌟 [@mixte/snippets] 新增 `Ant Design X` 的 `XProvider` 组件 *
  - 🌟 [@mixte/snippets] 新增 `Ant Design X` 的 `Bubble` 组件 *
  - 🌟 [mixte] 新增 `transformKeys` 函数, 用于转换传入对象的所有键名
  - 💄 [mixte] 优化 `pick` 和 `omit` 函数类型 *

## [v3.4.0-beta.2]
  - 📅 2025-03-16
  - 🌟 [mixte] 新增 `pick` 和 `omit` 函数, 支持从对象中选择或排除指定属性
  - 🌟 [mixte] 新增 `deepFind` 函数, 用于在嵌套数据结构中深度查找满足条件的第一个元素
  - 🌟 [mixte] 新增 `deepSome` 函数, 用于在嵌套数据结构中深度检查是否存在满足条件的元素
  - 🌟 [mixte] 新增 `deepForEach` 函数, 用于在嵌套结构数据中深度遍历所有元素，并为每个元素执行回调函数
  - 💄 [@mixte/mel-components] 优化组件 `MelSelect` 的 `MelSelectOption` 类型
  - 💄 [@mixte/snippets] 完善 `Ant Design X` 的 `Sender` 组件 *
  - ⚠️ [@mixte/snippets] 修改 `Ant Design X` 的 `init-veaury` 更名为 `patch-for-react-19` *
  - ⚠️ [@mixte/snippets] 不再为 `Ant Design X` 内置 `@ant-design/x` 类库, 需自行安装 *

## [v3.4.0-beta.1]
  - 📅 2025-03-12
  - 🌟 [@mixte/snippets] 新增 `LowCodeEditor` 相关组件 ( 开发中 )
  - 🌟 [@mixte/snippets] 新增 `Ant Design X` 相关组件 ( 开发中 )

## [v3.3.0], [v3.3.0-beta.2], [v3.3.0-beta.1]
  - 📅 2025-03-03
  - 🌟 [@mixte/components] 新增 `InfiniteScroll` 组件
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 的 `options` 支持传入 `render` 函数以实现自定义渲染选项
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `options` 插槽以实现自定义渲染选项
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `option-label` 插槽以实现自定义渲染选项内容
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `all-label` 插槽以实现自定义渲染选项内容和标签
  - 💄 [@mixte/mel-components] 组件 `MelSelect` 支持更深层次的数据返回, 更新 `useOptionsApi` 以处理不同结构的响应

## [v3.2.0], [v3.2.0-beta.8], [v3.2.0-beta.7], [v3.2.0-beta.6], [v3.2.0-beta.5], [v3.2.0-beta.4], [v3.2.0-beta.3], [v3.2.0-beta.2], [v3.2.0-beta.1]
  - 📅 2025-02-05
  - 🌟 [@mixte/snippets] 新增 `Tiptap` 编辑器组件 ( 开发中 )
  - 🌟 [@mixte/snippets] 新增 `Lottery` 年会抽奖组件 ( 开发中 )

## [v3.1.0], [v3.1.0-beta.1]
  - 📅 2024-12-22
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 新增 `optionsApi` 参数
  - 🐞 [@mixte/components] 修复 v3 版本以来 组件 `AutoGrid` 丢失 `AutoGridInstance` 类型导出的问题

## [v3.0.0], [v3.0.0-beta.3], [v3.0.0-beta.2], [v3.0.0-beta.1]
  - 📅 2024-12-05
  - 🌟 新增 `@mixte/mel-components` 组件包
  - 🌟 [@mixte/mel-components] 新增 `mel-select` 组件
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

[Unreleased]: https://github.com/MoomFE/mixte/compare/v3.4.0-beta.2...HEAD
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