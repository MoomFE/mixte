- 常用的类型判断方法
- 该页面的方法可以打开浏览器的 JavaScript 控制台, 使用 `Mixte.{fn-name}` 的方式使用

## `isString` {#isString}

判断传入参数是否是 String 类型

### 示例

```ts twoslash
import { isString } from 'mixte';

isString('666'); // -> true
isString(666); // -> false
```

## `isBoolean` {#isBoolean}

判断传入参数是否是布尔值

### 示例

```ts twoslash
import { isBoolean } from 'mixte';

isBoolean(true); // -> true
isBoolean(false); // -> true
isBoolean(666); // -> false
```

## `isNumber` {#isNumber}

判断传入参数是否是 Number 类型, 并且不为 NaN

### 示例

```ts twoslash
import { isNumber } from 'mixte';

isNumber(666); // -> true
isNumber('666'); // -> false
isNumber(Number.NaN); // -> false
```

## `isNumericString` {#isNumericString}

判断传入参数是否数字字符串

### 示例

```ts twoslash
import { isNumericString } from 'mixte';

isNumericString('666'); // -> true
isNumericString(666); // -> false
isNumericString(Number.NaN); // -> false
```

## `isNumeric` {#isNumeric}

判断传入参数是否是数字, 支持判断数字字符串

### 示例

```ts twoslash
import { isNumeric } from 'mixte';

isNumeric(666); // -> true
isNumeric('666'); // -> true
isNumeric(Number.NaN); // -> false
```

## `isObject` {#isObject}

判断传入参数是否是 Object 类型, 并且不为 null

### 示例

```ts twoslash
import { isObject } from 'mixte';

isObject({}); // -> true
isObject([]); // -> true
isObject(() => {}); // -> false
isObject(666); // -> false
```

## `isPlainObject` {#isPlainObject}

判断传入参数是否是纯粹的对象

### 示例

```ts twoslash
import { isPlainObject } from 'mixte';

isPlainObject({}); // -> true
isPlainObject(Object.create(null)); // -> true
isPlainObject([]); // -> false
```

## `assertPlainObject` {#assertPlainObject}

判断传入参数是否是纯粹的对象，并进行类型断言

### 示例

```ts twoslash
import { assertPlainObject } from 'mixte';

// 基本使用
assertPlainObject({}); // -> true
assertPlainObject(Object.create(null)); // -> true
assertPlainObject([]); // -> false

// 类型断言使用
interface User {
  name: string;
  age: number;
}

const obj = { name: 'Jack', age: 18 };

if (assertPlainObject<User>(obj)) {
  // 此时 obj 被断言为 User 类型
  console.log(obj.name); // -> 'Jack'
}
```

## `isFunction` {#isFunction}

判断传入参数是否是 Function 类型

### 示例

```ts twoslash
import { isFunction } from 'mixte';

isFunction(() => {}); // -> true
isFunction({}); // -> false
isFunction([]); // -> false
isFunction(666); // -> false
```

## `isNativePromise` {#isNativePromise}

判断传入参数是否是 Promise 对象

### 示例

```ts twoslash
import { isNativePromise } from 'mixte';

isNativePromise(new Promise(() => {})); // -> true
isNativePromise(Promise.resolve()); // -> true
isNativePromise({ then() {}, catch() {} }); // -> false
```

## `isPromise` {#isPromise}

判断传入参数是否是 Promise 对象或是类似于 Promise 的对象

### 示例

```ts twoslash
import { isPromise } from 'mixte';

isPromise(new Promise(() => {})); // -> true
isPromise(Promise.resolve()); // -> true
isPromise({ then() {}, catch() {} }); // -> true
```

## `isReference` {#isReference}

判断传入参数是否是引用类型

### 示例

```ts twoslash
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

## `isPrimitive` {#isPrimitive}

判断传入参数是否是原始类型

### 示例

```ts twoslash
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

## `isEmptyObject` {#isEmptyObject}

判断传入对象是否是一个空对象

### 示例

```ts twoslash
import { isEmptyObject } from 'mixte';

isEmptyObject({}); // -> true
isEmptyObject({ mixte: 6 }); // -> false
```

## `isESModule` {#isESModule}

判断传入参数是否是 ES Module

### 示例

```ts
import { isESModule } from 'mixte';

isESModule(await import('https://unpkg.com/vue')); // -> true
isESModule({}); // -> false
```
