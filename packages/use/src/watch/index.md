## `watchImmediate` {#watchImmediate}

immediate 默认为 true 的 watch 方法

### 示例

```ts twoslash
import { watchImmediate } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref(1);

watchImmediate(obj, (val) => {
  console.log(val); // -> 将依次输出 1, 2
});

obj.value = 2;
```

```ts twoslash
// ---cut-start---
import { watchImmediate } from '@mixte/use';
import { ref, watch } from 'vue';
const obj = ref(1);
// ---cut-end---
// 当前写法
watchImmediate(obj, (val) => {
  console.log(val);
});

// 相当于这种写法
watch(obj, (val) => {
  console.log(val);
}, {
  immediate: true
});
```

## `watchDeep` {#watchDeep}

deep 默认为 true 的 watch 方法

### 示例

```ts twoslash
import { watchDeep } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref({ a: 1 });

watchDeep(obj, (val) => {
  console.log(val); // -> 将输出 { a: 2 }
});

obj.value.a = 2;
```

```ts twoslash
// ---cut-start---
import { watchDeep } from '@mixte/use';
import { ref, watch } from 'vue';
const obj = ref(1);
// ---cut-end---
// 当前写法
watchDeep(obj, (val) => {
  console.log(val);
});

// 相当于这种写法
watch(obj, (val) => {
  console.log(val);
}, {
  deep: true
});
```

## `watchImmediateDeep` {#watchImmediateDeep}

immediate 和 deep 都为 true 的 watch 方法

### 示例

```ts twoslash
import { watchImmediateDeep } from '@mixte/use';
// ---cut-start---
import { ref } from 'vue';
// ---cut-end---

const obj = ref({ a: 1 });

watchImmediateDeep(obj, (val) => {
  console.log(val); // -> 将依次输出 { a: 1 }, { a: 2 }
});

obj.value.a = 2;
```

```ts twoslash
// ---cut-start---
import { watchImmediateDeep } from '@mixte/use';
import { ref, watch } from 'vue';
const obj = ref(1);
// ---cut-end---
// 当前写法
watchImmediateDeep(obj, (val) => {
  console.log(val);
});

// 相当于这种写法
watch(obj, (val) => {
  console.log(val);
}, {
  immediate: true,
  deep: true
});
```
