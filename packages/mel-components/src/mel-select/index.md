---
outline: [1,3]
---

## 演示

### `使用 options 传递数据源`

### `使用 optionsApi 传递请求数据源的方法`

### `使用 optionsApi 传递请求数据源的参数`

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据源 | `MelSelectOption[]` | - |
| optionsApi | 请求数据源的方法 | `() => Promise<MelSelectOption[]> \| { api?: () => Promise<MelSelectOption[]>; immediate?: boolean }` | - |
