---
outline: [2,4]
---

## `pick` {#pick}

从对象中选择指定属性

### 示例

```ts twoslash
import { pick } from 'mixte';

const obj = { a: 1, b: 2, c: 3 };

pick(obj, ['a', 'c']); // -> { a: 1, c: 3 }
pick(obj, 'a'); // -> { a: 1 }
```

## `omit` {#omit}

从对象中排除指定属性

### 示例

```ts twoslash
import { omit } from 'mixte';

const obj = { a: 1, b: 2, c: 3 };

omit(obj, ['a', 'c']); // -> { b: 2 }
omit(obj, 'a'); // -> { b: 2, c: 3 }
```
