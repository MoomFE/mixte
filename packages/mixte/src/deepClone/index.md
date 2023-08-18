---
outline: [1,4]
---

创建传入值的深拷贝
  - 只会深拷贝普通对象和数组, 其他类型的值会直接被继承

### 示例

<br>

#### 深拷贝对象

```ts
import { deepClone } from 'mixte';

const obj = {
  a: { b: 2 }
};

const cloneObj = deepClone(obj);

console.log(obj === cloneObj); // -> false
console.log(obj.a === cloneObj.a); // -> false
```

#### 深拷贝数组

```ts
import { deepClone } from 'mixte';

const arr = [{ a: 1 }, { b: 2 }];

const cloneArr = deepClone(arr);

console.log(arr === cloneArr); // -> false
console.log(arr[0] === cloneArr[0]); // -> false
console.log(arr[1] === cloneArr[1]); // -> false
```

#### 支持防御循环引用

```js
const obj = {};
obj.obj = obj;

const cloneObj = deepClone(obj);

console.log(obj.obj === obj); // -> true
console.log(cloneObj.obj === cloneObj); // -> true

console.log(obj === cloneObj); // -> false
console.log(obj.obj === cloneObj.obj); // -> false
```

### 类型

```ts
function deepClone<T>(value: T): T;
```
