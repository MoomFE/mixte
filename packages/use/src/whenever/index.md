## `whenever` {#whenever}

监听值是 `truthy` 时执行回调函数

### 示例

```ts twoslash
import { whenever } from '@mixte/use';
// ---cut-start---
import { nextTick, ref } from 'vue';
// ---cut-end---

const obj = ref(1);

whenever(obj, (val) => {
  console.log(val); // -> 将输出 2
});

obj.value = 0; // -> 不会输出
nextTick(() => {
  obj.value = 2;
});
```

```ts twoslash
// ---cut-start---
import { ref, watch } from 'vue';
import { whenever } from '@mixte/use';
const obj = ref(1);
// ---cut-end---
// 当前写法
whenever(obj, (val) => {
  console.log(val);
});

// 相当于这种写法
watch(obj, (val) => {
  if (val)
    console.log(val);
});
```

## `wheneverImmediate` {#wheneverImmediate}

immediate 默认为 true 的 whenever 方法

### 示例

```ts twoslash
import { wheneverImmediate } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref(1);

wheneverImmediate(obj, (val) => {
  console.log(val); // -> 将依次输出 1, 2
});

obj.value = 2;
```

## `wheneverDeep` {#wheneverDeep}

deep 默认为 true 的 whenever 方法

### 示例

```ts twoslash
import { wheneverDeep } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref({ a: 1 });

wheneverDeep(obj, (val) => {
  console.log(val); // -> 将输出 { a: 2 }
});

obj.value.a = 2;
```

## `wheneverImmediateDeep` {#wheneverImmediateDeep}

immediate 和 deep 默认为 true 的 whenever 方法

### 示例

```ts twoslash
import { wheneverImmediateDeep } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref({ a: 1 });

wheneverImmediateDeep(obj, (val) => {
  console.log(val); // -> 将依次输出 { a: 1 }, { a: 2 }
});

obj.value.a = 2;
```
