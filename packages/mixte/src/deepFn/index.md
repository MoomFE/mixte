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
