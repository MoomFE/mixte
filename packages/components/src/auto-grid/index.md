---
outline: [1,3]
---

- 为组件的子元素统一设定一个最小宽度
- 当一行的剩余宽度不够容纳一个子元素时, 会将剩余宽度平均到每个子元素上

## 演示

### 功能演示

### 传入各种类型的子元素

### 以数组渲染列表

### 以数值渲染列表

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 列表数据 | `any[] \| number \| undefined` | - |
| itemWidth | 子元素最小宽度 (单位: px) | ``` number \| `${number}` ``` | - |
| gap | 横纵间距 (单位: px) | ``` number \| `${number}` ``` | - |
| gapX | 横向间距 (单位: px) | ``` number \| `${number}` ``` | - |
| gapY | 纵向间距 (单位: px) | ``` number \| `${number}` ``` | - |
| collapsed | 是否折叠 | `boolean` | - |
| collapsedRows | 显示行数 | `boolean` | - |
| fluid | 只有一行时, 平铺所有子元素 | `boolean` | - |

### Slots

| 名称 | 描述 |
| --- | --- |
| overflowSuffix | 溢出后缀插槽 |
| default | 默认插槽 |
