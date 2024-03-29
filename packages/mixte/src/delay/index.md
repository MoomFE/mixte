## `delay` {#delay}

返回一个延迟指定时间的 Promise

### 示例

```ts
import { delay } from 'mixte';

await delay(1000); // 延迟 1 秒
```

### 类型

```ts
/**
 * @param ms 延迟时间 ( default: 1000 )
 */
function delay(ms?: number): Promise<unknown>;
```

## `wait`

返回一个延迟指定时间的 Promise, [`delay`](#delay-fn) 方法的别名

### 示例

```ts
import { wait } from 'mixte';

await wait(1000); // 延迟 1 秒
```

### 类型

```ts
/**
 * @param ms 延迟时间 ( default: 1000 )
 */
function wait(ms?: number): Promise<unknown>;
```
