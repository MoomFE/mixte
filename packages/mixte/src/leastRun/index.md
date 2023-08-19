运行函数并且保证最少执行指定 ms 的时间

### 示例

```ts
import { delay, leastRun } from 'mixte';

function fn() {
  await delay(500);
}

await leastRun(fn); // -> 运行了 1000ms
await leastRun(1200, fn); // -> 运行了 1200ms
await leastRun(100, fn); // ->  运行了 500ms
```

### 类型

```ts
/**
 * 运行函数并且保证最少执行指定 ms 的时间
 * @param ms 最少执行的 ms 时间
 * @param fn 要运行的函数
 */
async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(ms: number, fn: F): Promise<R>;

/**
 * 运行函数并且保证最少执行 1000ms 的时间
 * @param fn 要运行的函数
 */
async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(fn: F): Promise<R>;
```