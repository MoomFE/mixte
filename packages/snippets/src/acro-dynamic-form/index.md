---
outline: [1,2]
---

基于 [Arco Design Vue](https://arco.design/vue) 封装的动态表单组件

::: warning 注意
该组件仅支持 `Vue 3`
:::

## 基础用法

## 组件插槽&表单项插槽

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

::: tip <div flex="~ items-center gap-2" pl-6><i-material-symbols-arrow-cool-down-rounded class="size-4" /> 鼠标悬停查看方法类型定义</div>
```ts twoslash
// ---cut-start---
import type { AcroDynamicFormInstance } from '@mixte/snippets/src/acro-dynamic-form/index';
const { validate, validateField, resetFields, reset, clearValidate, setFields, scrollToField } = {} as AcroDynamicFormInstance;
// ---cut-end---
validate; // 校验全部表单数据
validateField; // 校验部分表单数据
resetFields; // 重置表单数据
clearValidate; // 清除校验状态
setFields; // 设置表单项的值和状态
scrollToField; // 滚动到指定表单项

reset; // 重置表单数据, 是 `resetFields` 方法的别名
```
:::

### `<acro-dynamic-form />` Data

| 参数名 | 描述 | 类型 |
| --- | --- | --- |
| data | 表单数据 | `Record<string, any>` |

### `<acro-dynamic-form />` Events

| 事件名 | 描述 | 回调参数 |
| --- | --- | --- |
| submit | 点击了提交按钮的事件 | `model: Record<string, any>` |
| reset | 点击了重置按钮的事件 | - |

### 对外导出工具方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| defineAcroDynamicFormField | 定义单个字段配置 | `field: DynamicFormField` | [DynamicFormField](#类型定义) |
| defineAcroDynamicFormFields | 定义字段配置列表 | `fields: DynamicFormField[]` | [DynamicFormField[]](#类型定义) |

## 类型定义 {#类型定义}

<<< ./src/types.ts#AcroDynamicFormField
