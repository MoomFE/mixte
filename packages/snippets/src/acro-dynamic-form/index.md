---
outline: [1,2]
---

## 基础用法

## API

### `<acro-dynamic-form />` Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 字段配置列表 | [DynamicFormField[]](#类型定义) | - |
| model | 表单数据 | `Record<string, any>` | - |
| showActionButtonArea | 是否显示操作按钮区域 (提交/重置) | `boolean` | `true` |
| showSubmitButton | 是否显示提交按钮 | `boolean` | `true` |
| submitButtonText | 提交按钮文本 | `string` | `'提交'` |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| resetButtonText | 重置按钮文本 | `string` | `'重置'` |

## 类型定义 {#类型定义}

<<< ./src/types.ts#DynamicFormField
