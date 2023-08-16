---
outline: [1,4]
---

- 深拷贝合并一个或多个来源对象 `sources` 的属性到目标对象 `target`
  - 来源对象从左到右进行深拷贝, 后续的来源对象会覆盖之前拷贝的属性
  - 来源对象中值为 `undefined` 的属性会被跳过
  - 来源对象中普通对象将会递归合并, 数组会被深拷贝后继承, 其他对象将会直接继承
  - 目标对象或来源对象的类型为数组时, 也遵循以上规则

### 示例

<br>

#### 深拷贝合并对象

```ts
import { deepMerge } from 'mixte';

const target = { a: { b: 1, c: 2 } };
const source = { a: { c: 3 }, d: 4 };

deepMerge(target, source);

console.log(target); // -> { a: { b: 1, c: 3 }, d: 4 }
```

#### 深拷贝合并数组

```ts
import { deepMerge } from 'mixte';

const target = [{ a: 1, b: 2 }];
const source = [{ b: 3 }, { c: 4 }];

deepMerge(target, source);

console.log(target); // -> [{ a: 1, b: 3 }, { c: 4 }]
```

#### 支持防御循环引用 ( 第一种方式 )

```ts
import { deepMerge } from 'mixte';

const target = {};
const source = { target };

console.log(deepMerge(target, source)); // -> { target: { target: [Circular] } }
```

#### 支持防御循环引用 ( 第二种方式 )

```ts
import { deepMerge } from 'mixte';

const target = {};
const source = {};

target.source = source;
source.target = target;

console.log(deepMerge(target, source)); // -> { source: { target: [Circular] }, target: { source: [Circular], target: [Circular] } }
```

### 类型

```ts
function deepMerge<T>(target: T): T;
function deepMerge<T, S1>(target: T, source: S1): Merge<T, S1>;
function deepMerge<T, S1, S2>(target: T, source: S1, source2: S2): Merge<Merge<T, S1>, S2>;
function deepMerge<T, S1, S2, S3>(target: T, source: S1, source2: S2, source3: S3): Merge<Merge<Merge<T, S1>, S2>, S3>;
function deepMerge<T, S1, S2, S3, S4>(target: T, source: S1, source2: S2, source3: S3, source4: S4): Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>;
function deepMerge<T, S1, S2, S3, S4, S5>(target: T, source: S1, source2: S2, source3: S3, source4: S4, source5: S5): Merge<Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>, S5>;
function deepMerge<T, S1, S2, S3, S4, S5, S6>(target: T, source: S1, source2: S2, source3: S3, source4: S4, source5: S5, source6: S6): Merge<Merge<Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>, S5>, S6>;
```
