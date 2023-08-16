---
outline: [1,3]
---

- 转换传入参数为数组

### 示例

```ts
import { toArray } from 'mixte';

toArray(); // -> []
toArray(null); // -> []
toArray(undefined); // -> []
toArray(666); // -> [666]
toArray([666]); // -> [666]
```

### 类型

```ts
/**
 * @param value 需要转换的参数
 */
function toArray<T>(value?: T | T[]): T[];
```
