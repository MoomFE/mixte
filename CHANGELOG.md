## [Unreleased]

## [v2.5.0-beta.1]
  - 📅 2024-08-19
  - 🌟 [@mixte/components] 组件 `AutoGrid` 新增 `fluid` 参数
  - 🌟 [@mixte/components] 组件 `AutoGrid` 新增 `columnCount` 变量导出, 标识每行可以渲染的子元素数量
  - 🌟 [@mixte/components] 组件 `AutoGrid` 新增 `isCollapsed` 变量导出, 标识子元素是否折叠

## [v2.4.0], [v2.4.0-beta.3], [v2.4.0-beta.2], [v2.4.0-beta.1]
  - 📅 2024-08-27
  - 🌟 [@mixte/components] 新增 `ListAutoGrid` 组件, 支持 `Vue3`、`Vue2.7`
  - 💄 [@mixte/components] 组件 `AutoGrid` 根节点添加 `mixte-auto-grid` 样式类

## [v2.3.0]
  - 📅 2024-08-20
  - 🌟 [@mixte/use] 方法 `useRequest` 新增 `reset` 方法, 用于重置请求到初始状态

## [v2.2.0]
  - 📅 2024-08-19
  - 🌟 [@mixte/snippets] 方法 `toggleThemeViewTransition` 新增 `reverseSelector` 选项, 用于自定义选择器, 默认 `.dark`
  - 🌟 [@mixte/snippets] 方法 `toggleThemeViewTransition` 新增 `prefersReducedMotion` 选项, 用于自定义是否检测用户偏好是否是减少动画, 默认检测

## [v2.1.0]
  - 📅 2024-08-05
  - 🌟 [@mixte/snippets] 新增 `toggleThemeViewTransition` 方法, 提供切换主题时的视图过渡动画

## [v2.0.3]
  - 📅 2024-08-03
  - 💄 [@mixte/validator] 优化 `citizenID` 和 `email` 的正则
  - 🐞 [@mixte/use] 修复 `@mixte/use/nuxt` 仅导入了类型的问题

## [v2.0.2]
  - 📅 2024-07-30
  - 🌟 [@mixte/use] 新增供 Nuxt 使用的模块 `@mixte/use/nuxt`, 提供自动导入功能

## [v2.0.1]
  - 📅 2024-07-29
  - 💄 [@mixte/use] 内置 `whenever` 方法, 防止项目中 `@vueuse/core` 版本过低不支持 `once` 选项

## [v2.0.0], [v2.0.0-beta.3], [v2.0.0-beta.2], [v2.0.0-beta.1]
  - 📅 2024-07-06
  - [@mixte/use]
    - `useRequest`  方法
      - 💄 优化 `reactive` 返回值实现
      - ⚠️ 移除 `successCount` 参数及 `clearSuccessCount` 方法

  - [@mixte/components]
    - ⚠️ 移除该组件包的默认导出, 请按需导入
    - `AutoGrid` 组件
      - 💄 组件使用 Vue SFC 重构, 提供更好的类型提示
      - 💄 新增 `MixteAutoGridInstance` 导出项
      - ⚠️ 移除 `mixteAutoGridProps` 导出项, 保留 `MixteAutoGridProps` 导出项
      
  - [@mixte/snippets]
    - `AcroDynamicForm` 组件
      - 🌟 字段配置新增 `render` 选项
        - 可传入渲染函数, 渲染自定义组件
        - 可传入插槽名称, 将使用指定名称的插槽来渲染自定义组件
      - 🌟 字段配置新增 `preset` 选项
        - 用于定义需要继承的已配置的预设, 支持继承多个预设
      - 🌟 新增 `actionButtonArea`、`actionButtonPrepend`、`actionButtonAppend` 插槽
        - `actionButtonArea`: 可使用该插槽代替操作按钮区域的渲染
        - `actionButtonPrepend`: 可插入内容到提交按钮前面
        - `actionButtonAppend`: 可插入内容到重置按钮后面
      - 🌟 新增 `actionButtonArea.props`、`submitButton.props`、`resetButton.props`
        - `actionButtonArea.props`: 传递给操作按钮区域 FormItem 组件的参数
        - `submitButton.props`: 传递给提交按钮组件的参数
        - `resetButton.props`: 传递给重置按钮组件的参数
      - 🌟 新增 `actionButtonArea.spaceProps`
        - 传递给操作按钮区域 Space 组件的参数
      - 🌟 新增 `init` 导出方法
      - 🌟 新增对外导出方法 `defineAcroDynamicFormPreset`, 用于定义预设选项
      - 💄 优化传参类型, 整合 Acro 的 Form 表单组件传参
      - ⚠️ 修改 `AcroDynamicForm` 组件参数
        - 由 `showActionButtonArea` 改为 `actionButtonArea` 或 `actionButtonArea.show`
        - 由 `showSubmitButton` 改为 `submitButton` 或 `submitButton.show`
        - 由 `submitButtonText` 改为 `submitButton.text`
        - 由 `showResetButton` 改为 `resetButton` 或 `resetButton.show`
        - 由 `resetButtonText` 改为 `resetButton.text`

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
2. 发布正式版本时
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

[Unreleased]: https://github.com/MoomFE/mixte/compare/v2.5.0-beta.1...HEAD
[v2.5.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v2.5.0-beta.1
[v2.4.0]: https://github.com/MoomFE/mixte/releases/tag/v2.4.0
[v2.4.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v2.4.0-beta.3
[v2.4.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v2.4.0-beta.2
[v2.4.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v2.4.0-beta.1
[v2.3.0]: https://github.com/MoomFE/mixte/releases/tag/v2.3.0
[v2.2.0]: https://github.com/MoomFE/mixte/releases/tag/v2.2.0
[v2.1.0]: https://github.com/MoomFE/mixte/releases/tag/v2.1.0
[v2.0.3]: https://github.com/MoomFE/mixte/releases/tag/v2.0.3
[v2.0.2]: https://github.com/MoomFE/mixte/releases/tag/v2.0.2
[v2.0.1]: https://github.com/MoomFE/mixte/releases/tag/v2.0.1
[v2.0.0]: https://github.com/MoomFE/mixte/releases/tag/v2.0.0
[v2.0.0-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v2.0.0-beta.3
[v2.0.0-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v2.0.0-beta.2
[v2.0.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v2.0.0-beta.1