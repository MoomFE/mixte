---
outline: [1,3]
---

对传入方法进行参数定义, 返回一个新方法

### 示例

```ts
import { defineArgs } from 'mixte';

const timeout = defineArgs(setTimeout, {
  0: 1000,
});

timeout(() => { /* ... */ }); // -> 1000ms 后执行
timeout(() => { /* ... */ }); // -> 1000ms 后执行
```

### 类型

```ts
/**
 * @param func 需要进行参数定义的方法
 * @param oArgs 参数定义
 */
function defineArgs<T>(func: (...args: any[]) => T, oArgs: Record<number, any>): (...userArgs: any[]) => T;
```
