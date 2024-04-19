---
outline: [1,3]
---

对传入方法进行参数定义, 返回一个新方法

### 示例

```ts twoslash
import { defineArgs } from 'mixte';

const timeout = defineArgs(setTimeout, {
  0: 1000,
});

timeout(() => { /* ... */ }); // -> 1000ms 后执行
timeout(() => { /* ... */ }); // -> 1000ms 后执行
```
