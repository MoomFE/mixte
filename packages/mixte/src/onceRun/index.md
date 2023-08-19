---
outline: [1,3]
---

包装传入函数并返回一个新函数, 确保它在同一时间只运行一次, 并返回一个 Promise, 该 Promise 会解析为同一时间第一次运行的结果

### 示例

```ts
import { delay, onceRun } from 'mixte';

let isRun = false;
let runCount = 0;

// 包装传入函数并返回一个新函数
const fn = onceRun(async () => {
  runCount++;
  isRun = true;
  await delay(2400);
  isRun = false;
  return runCount;
});

const res = fn();
const res2 = fn();

// 同一时间只运行一次, 返回同一时间第一次运行时返回的 Promise
console.log(res === res2); // -> true
// 该 Promise 会解析为同一时间第一次运行的结果
console.log(await res); // -> 1
console.log(await res2); // -> 1
```

### 类型

```ts
/**
 * @param fn 要运行的函数
 * @returns 一个函数, 包装原始函数并确保它只运行一次
 */
function onceRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  A extends Parameters<F>,
  R extends AsyncReturnType<F>
>(fn: F): (...args: A) => Promise<R>;
```
