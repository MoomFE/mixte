# is
类型判断

## isString

> 判断传入参数是否是 String 类型

```ts
import { isString } from 'mixte';

isString('666'); // -> true
isString(666); // -> false
```

## isNumber

> 判断传入参数是否是 Number 类型, 并且不为 NaN

```ts
import { isNumber } from 'mixte';

isNumber(666); // -> true
isNumber('666'); // -> false
isNumber(NaN); // -> false
```

## isNumericString

> 判断传入参数是否数字字符串

```ts
import { isNumericString } from 'mixte';

isNumericString('666'); // -> true
isNumericString(666); // -> false
isNumericString(NaN); // -> false
```

## isNumeric

> 判断传入参数是否是数字, 支持判断数字字符串

```ts
import { isNumeric } from 'mixte';

isNumeric(666); // -> true
isNumeric('666'); // -> true
isNumeric(NaN); // -> false
```

## isObject

> 判断传入参数是否是 Object 类型, 并且不为 null

```ts
import { isObject } from 'mixte';

isObject({}); // -> true
isObject([]); // -> true
isObject(() => {}); // -> false
isObject(666); // -> false
```

## isPlainObject

> 判断传入参数是否是纯粹的对象

```ts
import { isPlainObject } from 'mixte';

isPlainObject({}); // -> true
isPlainObject(Object.create(null)); // -> true
isPlainObject([]); // -> false
```

## isFunction

> 判断传入参数是否是 Function 类型

```ts
import { isFunction } from 'mixte';

isFunction(() => {}); // -> true
isFunction({}); // -> false
isFunction([]); // -> false
isFunction(666); // -> false
```

## isNativePromise

> 判断传入参数是否是 Promise 对象

```ts
import { isNativePromise } from 'mixte';

isNativePromise(new Promise(() => {})); // -> true
isNativePromise(Promise.resolve()); // -> true
isNativePromise({ then() {}, catch() {} }); // -> false
```

## isPromise

> 判断传入参数是否是 Promise 对象或是类似于 Promise 的对象

```ts
import { isPromise } from 'mixte';

isPromise(new Promise(() => {})); // -> true
isPromise(Promise.resolve()); // -> true
isPromise({ then() {}, catch() {} }); // -> true
```

## isReference

> 判断传入参数是否是引用类型

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
isReference(NaN); // -> false
isReference('666'); // -> false
isReference(Symbol('666')); // -> false
isReference(666n); // -> false
```

## isPrimitive

> 判断传入参数是否是原始类型

```ts
import { isPrimitive } from 'mixte';

isPrimitive(undefined); // -> true
isPrimitive(null); // -> true
isPrimitive(true); // -> true
isPrimitive(false); // -> true
isPrimitive(666); // -> true
isPrimitive(NaN); // -> true
isPrimitive('666'); // -> true
isPrimitive(Symbol('666')); // -> true
isPrimitive(666n); // -> true
isPrimitive({}); // -> false
isPrimitive([]); // -> false
isPrimitive(() => {}); // -> false
```

## isEmptyObject

> 判断传入对象是否是一个空对象

```ts
import { isEmptyObject } from 'mixte';

isEmptyObject({}); // -> true
isEmptyObject({ mixte: 6 }); // -> false
```

## isESModule

> 判断传入参数是否是 ES Module

```ts
import { isESModule } from 'mixte';

isESModule(await import('https://unpkg.com/vue')); // -> true
isESModule({}); // -> false
```