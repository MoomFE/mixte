## [Unreleased]
  - 🌟 [@mixte/snippets] 组件 `AcroDynamicForm` 字段配置新增 `render` 选项
    - 可传入渲染函数, 渲染自定义组件
    - 可传入插槽名称, 将使用指定名称的插槽来渲染自定义组件
  - 🌟 [@mixte/snippets] 组件 `AcroDynamicForm` 新增 `actionButtonArea`、`actionButtonPrepend`、`actionButtonAppend` 插槽
    - `actionButtonArea`: 可使用该插槽代替操作按钮区域的渲染
    - `actionButtonPrepend`: 可插入内容到提交按钮前面
    - `actionButtonAppend`: 可插入内容到重置按钮后面
  - 🌟 [@mixte/snippets] 组件 `AcroDynamicForm` 新增 `actionButtonArea.props`、`submitButton.props`、`resetButton.props`
    - `actionButtonArea.props`: 传递给操作按钮区域 FormItem 组件的参数
    - `submitButton.props`: 传递给提交按钮组件的参数
    - `resetButton.props`: 传递给重置按钮组件的参数
  - 💄 [@mixte/snippets] 组件 `AcroDynamicForm` 优化传参类型, 整合 Acro 的 Form 表单组件传参
  - ⚠️ [@mixte/snippets] 修改 `AcroDynamicForm` 组件参数
    - 由 `showActionButtonArea` 改为 `actionButtonArea` 或 `actionButtonArea.show`
    - 由 `showSubmitButton` 改为 `submitButton` 或 `submitButton.show`
    - 由 `submitButtonText` 改为 `submitButton.text`
    - 由 `showResetButton` 改为 `resetButton` 或 `resetButton.show`
    - 由 `resetButtonText` 改为 `resetButton.text`
  - ⚠️ [@mixte/use] 移除 `useRequest` 方法的 `successCount` 参数及 `clearSuccessCount` 方法
  - ⚠️ [@mixte/components] 移除该组件包的默认导出, 请按需导入

## [../v1](https://mixte-v1.moomfe.com)
  - [更新日志](https://mixte-v1.moomfe.com/changelog)

<br>
<hr>
<br>

版本规范

1. 主版本号: 破坏性更新和新特性
2. 次版本号: 向下兼容的功能新增、功能更改、功能优化
3. 修订版本号: 向下兼容的问题修正、一般功能优化

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

[Unreleased]: https://github.com/MoomFE/mixte/compare/v1.13.2...HEAD