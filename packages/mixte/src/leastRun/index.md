---
outline: [1,3]
---

运行函数并且保证最少执行指定 ms 的时间

### 示例

```ts twoslash
import { delay, leastRun } from 'mixte';

async function fn() {
  await delay(500);
}

await leastRun(fn); // -> 运行了 1000ms
await leastRun(1200, fn); // -> 运行了 1200ms
await leastRun(100, fn); // ->  运行了 500ms
```
