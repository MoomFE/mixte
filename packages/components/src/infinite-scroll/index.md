---
outline: [2,3]
---

::: warning
🚧 现在没空, 单元测试还没写, 不过至少演示的这些例子的场景看上去没啥问题
:::

## 演示

### 基础

### 稍微复杂的例子

## API

### Props

`<T extends any[]>`

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | <div><div mb-1>双向绑定的数据源, 当传入后, 将会影响以下行为</div><div>1. 将在执行 reset 时自动清空</div><div>2. 前置内容/后置内容插槽将会接收到 isEmpty 属性</div></div> | `T` | - |
| load | 加载数据方法 | `(pageNum: number, pageSize: number) => Awaitable<undefined \| T>` | - |
| distance | 触发加载的距离阈值 | `number` | `0` |
| direction | 监听滚动的方向 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| interval | 加载更多之间的间隔时间 ( 以避免过多的调用 ). 单位：毫秒 | `number` | `100` |
| canLoad | 用于判断是否可以加载更多内容的函数 | `() => boolean` | - |

### Slots

| 名称 | 参数 | 描述 |
| --- | --- | --- |
| prepend | `(props: SlotProps)` | 前置内容 |
| append | `(props: SlotProps)` | 后置内容 |
| default | - | 默认插槽 |

```ts
interface SlotProps {
  /** 是否正在加载数据 */
  isLoading: boolean;
  /** 是否数据源为空 ( 仅在组件传入 data 时有值 ) */
  isEmpty?: boolean;
  /** 是否已经加载完所有数据 */
  isFinished: boolean;
  /** 加载失败时的错误信息 */
  error: any;
}
```

### Expose

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| isLoading | `boolean` | 是否正在加载数据 |
| isEmpty | `boolean \| undefined` | 是否数据源为空（仅在组件传入 data 时有值） |
| isFinished | `boolean` | 是否已经加载完所有数据 |
| error | `any` | 加载失败时的错误信息 |
| reset | `() => void` | 重置加载状态，包括页码、是否加载完成的状态信息，如果传入了 data 属性，也会清空数据源 |
