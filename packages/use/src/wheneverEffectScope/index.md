---
outline: [1,3]
---

- 监听传入值为 truthy 时, 创建一个 effect 作用域
  - 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
  - 当值变为 falsy 时, 将会停止之前创建的 effect 作用域

### 示例

```ts
import { watchImmediate, wheneverEffectScope } from '@mixte/use';

const source = ref(false);
const value = ref(1);
const value2 = ref(0);

wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
  watchImmediate(value, (v) => {
    value2.value = v;
  });
});
```

### 类型

```ts
function wheneverEffectScope<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: WatchOptions): WatchStopHandle;
```
