## [Unreleased]
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `options` 插槽以实现自定义渲染
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 支持传入 `option-label` 插槽以实现仅替换选项内容部分

## [v3.3.0-beta.2]
  - 📅 2025-02-27
  - 🌟 [@mixte/mel-components] 组件 `MelSelect` 的 `options` 支持传入 `render` 函数以实现自定义渲染
  - 🌟 [@mixte/components] 组件 `InfiniteScroll` 新增 `isEmpty` 导出 *

## [v3.3.0-beta.1]
  - 📅 2025-02-26
  - 🌟 [@mixte/components] 新增 `InfiniteScroll` 组件

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

[Unreleased]: https://github.com/MoomFE/mixte/compare/v3.3.0-beta.2...HEAD
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