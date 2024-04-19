## `delay` {#delay}

返回一个延迟指定时间的 Promise

### 示例

```ts twoslash
import { delay } from 'mixte';

await delay(1000); // 延迟 1 秒
```

## `wait`

返回一个延迟指定时间的 Promise, [`delay`](#delay-fn) 方法的别名

### 示例

```ts twoslash
import { wait } from 'mixte';

await wait(1000); // 延迟 1 秒
```
