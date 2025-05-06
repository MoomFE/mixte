- 嵌套结构数据处理方法

## deepFind {#deepFind}

在嵌套结构数据中深度查找满足条件的第一个元素, 如果没有找到则返回 undefined

### 示例

```ts
import { deepFind } from 'mixte';

const data = [
  // 嵌套数据结构
  { id: 1 },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] },
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] },
    ],
  },
  // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
  [
    { id: 9 },
    [
      {
        id: 10,
        children: [{ id: 11 }],
        items: [{ id: 12 }],
      },
    ],
  ],
];

// 嵌套数据结构
deepFind(data, item => item.id === 5); // -> { id: 5 }
deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
// 嵌套数组结构
deepFind(data, item => item.id === 9, { nestedArray: true }); // -> { id: 9 }
deepFind(data, 'children', item => item.id === 11, { nestedArray: true }); // -> { id: 11 }
deepFind(data, 'items', item => item.id === 12, { nestedArray: true }); // -> { id: 12 }
```

## deepSome {#deepSome}

在嵌套结构数据中深度检查是否存在满足条件的元素, 如果存在返回 true, 否则返回 false

### 示例

```ts
import { deepSome } from 'mixte';

const data = [
  // 嵌套数据结构
  { id: 1 },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] },
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] },
    ],
  },
  // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
  [
    { id: 9 },
    [
      {
        id: 10,
        children: [{ id: 11 }],
        items: [{ id: 12 }],
      },
    ],
  ],
];

// 嵌套数据结构
deepSome(data, item => item.id === 5); // -> true
deepSome(data, 'children', item => item.id === 5); // -> true
deepSome(data, 'items', item => item.id === 8); // -> true
deepSome(data, item => item.id === 8); // -> false
// 嵌套数组结构
deepSome(data, item => item.id === 9, { nestedArray: true }); // -> true
deepSome(data, 'children', item => item.id === 11, { nestedArray: true }); // -> true
deepSome(data, 'items', item => item.id === 12, { nestedArray: true }); // -> true
deepSome(data, item => item.id === 12, { nestedArray: true }); // -> false
```

## deepForEach {#deepForEach}

在嵌套结构数据中深度遍历所有元素，并为每个元素执行回调函数

### 示例

```ts
import { deepForEach } from 'mixte';

const data = [
  // 嵌套数据结构
  { id: 1 },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] },
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] },
    ],
  },
  // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
  [
    { id: 9 },
    [
      {
        id: 10,
        children: [{ id: 11 }],
        items: [{ id: 12 }],
      },
    ],
  ],
];

// 嵌套数据结构
deepForEach(data, item => console.log(item.id)); // -> 1, 2, 3, 4, 5
deepForEach(data, 'children', item => console.log(item.id)); // -> 1, 2, 3, 4, 5
deepForEach(data, 'items', item => console.log(item.id)); // -> 1, 2, 6, 7, 8
// 嵌套数组结构
deepForEach(data, item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
deepForEach(data, 'children', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
deepForEach(data, 'items', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 6, 7, 8, 9, 10, 12
```
