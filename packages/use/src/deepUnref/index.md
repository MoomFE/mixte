---
outline: [1,3]
---

- 方法 `unref` 的加强版本
  - 如果传入的是普通对象和数组, 会不断向下查找然后解包并返回传入对象的副本, 否则直接返回传入值的 `unref` 结果

### 示例

```ts
import { deepUnref } from '@mixte/use';

const source = {
  a: ref(1),
  b: computed(() => [
    ref(2),
    computed(() => 3),
  ]),
  c: 4,
};

console.log(deepUnref(source)); // -> { a: 1, b: [ 2, 3 ], c: 4 }
```

### 类型

```ts
function deepUnref<T>(maybeRef: MaybeRef<T>): UnwrapNestedRefs<T>;
```