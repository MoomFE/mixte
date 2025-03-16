- 嵌套结构数据处理方法

## deepFind {#deepFind}

在嵌套结构数据中深度查找满足条件的第一个元素, 如果没有找到则返回 undefined

### 示例

```ts twoslash
import { deepFind } from 'mixte';

const data = [
  {
    id: 1
  },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] }
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] }
    ]
  }
];

deepFind(data, item => item.id === 5); // -> { id: 5 }
deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
```

## deepSome {#deepSome}

在嵌套结构数据中深度检查是否存在满足条件的元素, 如果存在返回 true, 否则返回 false

### 示例

```ts twoslash
import { deepSome } from 'mixte';

const data = [
  {
    id: 1
  },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] }
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] }
    ]
  }
];

deepSome(data, item => item.id === 5); // -> true
deepSome(data, 'children', item => item.id === 5); // -> true
deepSome(data, 'items', item => item.id === 8); // -> true
deepSome(data, item => item.id === 10); // -> false
```

## deepForEach {#deepForEach}

在嵌套结构数据中深度遍历所有元素，并为每个元素执行回调函数

### 示例

```ts twoslash
import { deepForEach } from 'mixte';

const data = [
  {
    id: 1
  },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4, children: [{ id: 5 }] }
    ],
    items: [
      { id: 6 },
      { id: 7, items: [{ id: 8 }] }
    ]
  }
];

deepForEach(data, item => console.log(id)); // -> 1, 2, 3, 4, 5
deepForEach(data, 'children', item => console.log(id)); // -> 1, 2, 3, 4, 5
deepForEach(data, 'items', item => console.log(id)); // -> 6, 7, 8
```
