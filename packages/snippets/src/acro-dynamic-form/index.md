---
outline: [1,3]
---

基于 [Arco Design Vue](https://arco.design/vue) 封装的动态表单组件

::: warning 注意
  - 依赖于 [@arco-design/web-vue](https://www.npmjs.com/package/@arco-design/web-vue) 组件库
  - 该组件仅支持 `Vue 3`
:::

## 演示

### 基础用法

### 组件插槽&表单项插槽

### 操作按钮区域插槽

### 渲染自定义组件

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 字段配置列表 | [`DynamicFormField[]`](#AcroDynamicFormField) | - |
| model | 表单数据 | `Record<string, any>` | - |
| actionButtonArea | 操作按钮区域配置 | [`ActionButtonAreaOptions`](#ActionButtonAreaOptions) \| `boolean` | `true` |
| submitButton | 提交按钮配置 | [`SubmitButtonOptions`](#SubmitButtonOptions) \| `boolean` | `true` |
| resetButton | 重置按钮配置 | [`ResetButtonOptions`](#ResetButtonOptions) \| `boolean` | `true` |

### Methods

::: tip <div flex="~ items-center gap-2" pl-6><i-material-symbols-arrow-cool-down-rounded class="size-4" /> 鼠标悬停查看方法类型定义</div>
```ts twoslash
// ---cut-start---
import type { AcroDynamicFormInstance } from '@mixte/snippets/acro-dynamic-form';
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

### Events

| 事件名 | 描述 | 回调参数 |
| --- | --- | --- |
| submit | 点击了提交按钮的事件 | `model: Record<string, any>` |
| reset | 点击了重置按钮的事件 | - |

### Slots

| 名称 | 描述 |
| --- | --- |
| actionButtonArea | 操作按钮区域插槽, 可使用该插槽代替操作按钮区域的渲染 |
| actionButtonPrepend | 操作按钮前置插槽, 可插入内容到提交按钮前面 |
| actionButtonAppend | 操作按钮后置插槽, 可插入内容到重置按钮后面 |

### 对外导出工具方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| defineAcroDynamicFormField | 定义单个字段配置 | `field: DynamicFormField` | [`DynamicFormField`](#AcroDynamicFormField) |
| defineAcroDynamicFormFields | 定义字段配置列表 | `fields: DynamicFormField[]` | [`DynamicFormField[]`](#AcroDynamicFormField) |

## 类型定义

### 字段配置 {#AcroDynamicFormField}
<<< ./src/types.ts#AcroDynamicFormField

### 操作按钮区域配置 {#ActionButtonAreaOptions}
<<< ./src/types.ts#ActionButtonAreaOptions

### 提交按钮配置 {#SubmitButtonOptions}
<<< ./src/types.ts#SubmitButtonOptions

### 重置按钮配置 {#ResetButtonOptions}
<<< ./src/types.ts#ResetButtonOptions
