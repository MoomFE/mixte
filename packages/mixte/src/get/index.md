---
outline: [2,4]
---

## `get` {#get}

根据路径获取对象属性值, 若路径不存在则返回默认值

### 示例

```ts twoslash
import { get } from 'mixte';

const obj = {
  a: {
    b: [{ c: 3 }]
  },
  d: { e: 5 }
};

get(obj, 'd.e'); // -> 5
get(obj, 'a.b[0].c'); // -> 3
get(obj, 'a.b[1].c', 'default'); // -> 'default'
```

---

## `set` {#set}

根据路径设置对象属性值, 若路径不存在则自动创建

### 示例

```ts twoslash
import { set } from 'mixte';

const obj1 = {};
set(obj1, 'a.b', 5);
// obj1 => { a: { b: 5 } }

const obj2 = {};
set(obj2, 'x.y[2].z', 'hello');
// obj2 => { x: { y: [undefined, undefined, { z: 'hello' }] } }

const obj3 = { a: { b: [{ c: 1 }] } };
set(obj3, 'a.b[0].d.e', true);
// obj3 => { a: { b: [ { c: 1, d: { e: true } } ] } }
```
