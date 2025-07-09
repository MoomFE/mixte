---
outline: [2,3]
---

## 演示

### `使用 options 传递数据源`

### `使用 optionsApi 传递请求数据源的方法`

### `使用 optionsApi 传递请求数据源的参数`

### `自定义渲染选项: 使用 options 传递 render`

### `自定义渲染选项: 使用 option 插槽`

### `自定义渲染选项内容: 使用 option-label 插槽`

### `自定义渲染选项内容和标签: 使用 all-label 插槽`

### 组件上的方法

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据源 | `MelSelectOption[]` | - |
| optionsApi | 请求数据源的方法 | `() => Promise<MelSelectOption[]> \| { api?: () => Promise<MelSelectOption[]>; immediate?: boolean }` | - |
