---
outline: [2,3]
---

使用 [CSS Grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid) 实现的表格组件

## 演示

### 基础用法

简单的表格, 最后一列是各种操作

### 固定表头

方便一页内展示大量数据, 只要给表格设置一个高度即可

### 固定列

对于列数很多的数据, 可以固定前后的列, 横向滚动查看其它数据

### 堆叠固定列

混合固定列，滚动到一定距离进行堆叠

### 虚拟列表

通过 `virtual` 开启虚拟滚动

### 树形数据

表格支持树形数据的展示, 当数据中有 `children` 字段时会自动展示为树形表格, 如果不需要或配置为其他字段可以用 `expandColumnKey` 进行配置。

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rowKey | 表格行主键 | ``` string \| (() => string) ``` | `'id'` |
| data | 数据源 | `Record<string, any>[]` | - |
| columns | 列配置 | [`GridTableColumn[]`](#GridTableColumn) | - |
| loading | 是否加载中 | `boolean` | - |
| virtual | 是否启用虚拟列表<br>&nbsp;- <small>需要为表格设置一个高度</small> | `boolean` | - |
| overscan | 启用虚拟列表时预渲染的行数<br>&nbsp;- <small>可减少快速滚动时的白屏</small> | ``` number \| `${number}` ``` | `5` |
| estimatedRowHeight | 启用虚拟列表时的预估行高度 | ``` number \| `${number}` ``` | `50` |
| childrenKey | 树形数据子节点字段名 | `string` | `'children'` |
| expandColumnKey | 显示展开按钮的列主键<br>&nbsp;- <small>如果不设置, 则使用第一列作为展开列</small> | `string` | - |
| expandedRowKeys | 树形数据展开的行主键列表<br>&nbsp;- <small>支持通过 `v-model:expandedRowKeys="xxx"` 进行双向绑定</small> | `string[]` | - |
| expandedIndent | 展示树形数据时, 每层缩进的宽度, 以 px 为单位 | ``` number \| `${number}` ``` | `15` |

### Expose

| 方法名 | 描述 | 类型 |
| --- | --- | --- |
| expandAllRows | 展开所有行 | `() => void` |
| collapseAllRows | 折叠所有行 | `() => void` |
| expandRows | 展开指定行 | `(rowKeys: string[]) => void` |
| collapseRows | 折叠指定行 | `(rowKeys: string[]) => void` |

### Slots

| 名称 | 描述 |
| --- | --- |
| header | 通用表头单元格插槽 |
| header-$\{field\} | 指定字段表头单元格插槽 |
| cell | 通用字段单元格插槽 |
| cell-$\{field\} | 指定字段单元格插槽 |

## 类型定义

### GridTableColumn{#GridTableColumn}

<<< ./src/types.ts#GridTableColumn
