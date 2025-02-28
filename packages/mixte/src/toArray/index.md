---
outline: [2,3]
---

转换传入参数为数组

### 示例

```ts twoslash
import { toArray } from 'mixte';

toArray(); // -> []
toArray(null); // -> []
toArray(undefined); // -> []
toArray(666); // -> [666]
toArray([666]); // -> [666]
```
