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

### `<acro-dynamic-form />` Methods

<!-- <InfoTooltip content="field: string" /> -->

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| validate | 校验全部表单数据 | <InfoTooltip content="callback?: ((errors: undefined \| Record<string, ValidatedError>) => void)" /> | <InfoTooltip content="Promise<undefined \| Record<string, ValidatedError>>" /> |
| validateField | 校验部分表单数据 | <InfoTooltip content="field: string \| string[], callback?: ((errors: undefined \| Record<string, ValidatedError>) => void) \| undefined" /> | <InfoTooltip content="Promise<undefined \| Record<string, ValidatedError>>" /> |
| resetFields | 重置表单数据 | <InfoTooltip content="field?: string \| string[] \| undefined" /> | - |
| reset | `resetFields` 方法的别名 | <InfoTooltip content="field?: string \| string[] \| undefined" /> | - |
| clearValidate | 清除校验状态 | <InfoTooltip content="field?: string \| string[] \| undefined" /> | - |
| setFields | 设置表单项的值和状态 | <InfoTooltip content="data: Record<string, FieldData>" /> | - |
| scrollToField | 滚动到指定表单项 | <InfoTooltip content="field: string" /> | - |

## 类型定义 {#类型定义}

<<< ./src/types.ts#AcroDynamicFormField
