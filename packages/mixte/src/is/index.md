- 常用的类型判断方法
- 该页面的方法可以打开浏览器的 JavaScript 控制台, 使用 `Mixte.{fn-name}` 的方式使用


## `isString` {#isString}

判断传入参数是否是 String 类型

### 示例

```ts
import { isString } from 'mixte';

isString('666'); // -> true
isString(666); // -> false
```

### 类型

```ts
function isString(value: unknown): value is string;
```


## `isBoolean` {#isBoolean}

判断传入参数是否是布尔值

### 示例

```ts
import { isBoolean } from 'mixte';

isBoolean(true); // -> true
isBoolean(false); // -> true
isBoolean(666); // -> false
```

### 类型

```ts
function isBoolean(value: unknown): value is boolean;
```


## `isNumber` {#isNumber}

判断传入参数是否是 Number 类型, 并且不为 NaN

### 示例

```ts
import { isNumber } from 'mixte';

isNumber(666); // -> true
isNumber('666'); // -> false
isNumber(Number.NaN); // -> false
```

### 类型

```ts
function isNumber(value: unknown): value is number;
```


## `isNumericString` {#isNumericString}

判断传入参数是否数字字符串

### 示例

```ts
import { isNumericString } from 'mixte';

isNumericString('666'); // -> true
isNumericString(666); // -> false
isNumericString(Number.NaN); // -> false
```

### 类型

```ts
function isNumericString(value: unknown): value is `${number}`;
```


## `isNumeric` {#isNumeric}

判断传入参数是否是数字, 支持判断数字字符串

### 示例

```ts
import { isNumeric } from 'mixte';

isNumeric(666); // -> true
isNumeric('666'); // -> true
isNumeric(Number.NaN); // -> false
```

### 类型

```ts
function isNumeric(value: unknown): value is number | `${number}`;
```


## `isObject` {#isObject}

判断传入参数是否是 Object 类型, 并且不为 null

### 示例

```ts
import { isObject } from 'mixte';

isObject({}); // -> true
isObject([]); // -> true
isObject(() => {}); // -> false
isObject(666); // -> false
```

### 类型

```ts
function isObject(value: unknown): value is object;
```


## `isPlainObject` {#isPlainObject}

判断传入参数是否是纯粹的对象

### 示例

```ts
import { isPlainObject } from 'mixte';

isPlainObject({}); // -> true
isPlainObject(Object.create(null)); // -> true
isPlainObject([]); // -> false
```

### 类型

```ts
function isPlainObject<Value = unknown>(value: unknown): value is Record<PropertyKey, Value>;
```


## `isFunction` {#isFunction}

判断传入参数是否是 Function 类型

### 示例

```ts
import { isFunction } from 'mixte';

isFunction(() => {}); // -> true
isFunction({}); // -> false
isFunction([]); // -> false
isFunction(666); // -> false
```

### 类型

```ts
function isFunction(value: unknown): value is Function;
```


## `isNativePromise` {#isNativePromise}

判断传入参数是否是 Promise 对象

### 示例

```ts
import { isNativePromise } from 'mixte';

isNativePromise(new Promise(() => {})); // -> true
isNativePromise(Promise.resolve()); // -> true
isNativePromise({ then() {}, catch() {} }); // -> false
```

### 类型

```ts
function isNativePromise<T = unknown>(value: unknown): value is Promise<T>;
```


## `isPromise` {#isPromise}

判断传入参数是否是 Promise 对象或是类似于 Promise 的对象

### 示例

```ts
import { isPromise } from 'mixte';

isPromise(new Promise(() => {})); // -> true
isPromise(Promise.resolve()); // -> true
isPromise({ then() {}, catch() {} }); // -> true
```

### 类型

```ts
function isPromise<T = unknown>(value: unknown): value is Promise<T>;
```


## `isReference` {#isReference}

判断传入参数是否是引用类型

### 示例

```ts
import { isReference } from 'mixte';

isReference({}); // -> true
isReference([]); // -> true
isReference(() => {}); // -> true
isReference(undefined); // -> false
isReference(null); // -> false
isReference(true); // -> false
isReference(false); // -> false
isReference(666); // -> false
isReference(Number.NaN); // -> false
isReference('666'); // -> false
isReference(Symbol('666')); // -> false
isReference(666n); // -> false
```

### 类型

```ts
function isReference(value: unknown): value is object | Function;
```


## `isPrimitive` {#isPrimitive}

判断传入参数是否是原始类型

### 示例

```ts
import { isPrimitive } from 'mixte';

isPrimitive(undefined); // -> true
isPrimitive(null); // -> true
isPrimitive(true); // -> true
isPrimitive(false); // -> true
isPrimitive(666); // -> true
isPrimitive(Number.NaN); // -> true
isPrimitive('666'); // -> true
isPrimitive(Symbol('666')); // -> true
isPrimitive(666n); // -> true
isPrimitive({}); // -> false
isPrimitive([]); // -> false
isPrimitive(() => {}); // -> false
```

### 类型

```ts
function isPrimitive(value: unknown): boolean;
```


## `isEmptyObject` {#isEmptyObject}

判断传入对象是否是一个空对象

### 示例

```ts
import { isEmptyObject } from 'mixte';

isEmptyObject({}); // -> true
isEmptyObject({ mixte: 6 }); // -> false
```

### 类型

```ts
function isEmptyObject(value: any): value is EmptyObject;
```


## `isESModule` {#isESModule}

判断传入参数是否是 ES Module

### 示例

```ts
import { isESModule } from 'mixte';

isESModule(await import('https://unpkg.com/vue')); // -> true
isESModule({}); // -> false
```

### 类型

```ts
function isESModule<T = any>(module: any): module is { default: T };
```
