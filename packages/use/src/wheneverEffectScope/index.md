## `wheneverEffectScope` {#wheneverEffectScope}

- 监听传入值为 truthy 时, 创建一个 effect 作用域
  - 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
  - 当值变为 falsy 时, 将会停止之前创建的 effect 作用域

### 示例

```ts twoslash
import { wheneverEffectScope } from '@mixte/use';
// ---cut-start---
import { ref, watch } from 'vue';
// ---cut-end---

const source = ref(false);
const value = ref(1);
const value2 = ref(0);

// 当 `source` 为 truthy 时, 执行的 effect 作用域
wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
  // 监听 `value`, 同步值至 `value2`
  watch(value, val => value2.value = val, {
    immediate: true,
  });
});

// 触发监听
source.value = true;
```

## `wheneverEffectScopeImmediate` {#wheneverEffectScopeImmediate}

immediate 为 true 的 wheneverEffectScope 方法

### 示例

```ts twoslash
import { wheneverEffectScopeImmediate } from '@mixte/use';
// ---cut-start---
import { ref, watch } from 'vue';
// ---cut-end---

const source = ref(true);
const value = ref(1);
const value2 = ref(0);

// immediate 为 true, 会立即触发监听, 执行的 effect 作用域
wheneverEffectScopeImmediate(source, (_value, _oldValue, _onCleanup) => {
  // 监听 `value`, 同步值至 `value2`
  watch(value, val => value2.value = val);
});
```

## `wheneverEffectScopeDeep` {#wheneverEffectScopeDeep}

deep 为 true 的 wheneverEffectScope 方法

### 示例

```ts twoslash
import { wheneverEffectScopeDeep } from '@mixte/use';
// ---cut-start---
import { ref, watch } from 'vue';
// ---cut-end---

const source = ref({ a: 1 });
const value = ref(1);
const value2 = ref(0);

// 当 `source` 为 truthy 时或 `source` 内的值发生改变, 执行的 effect 作用域
wheneverEffectScopeDeep(source, (_value, _oldValue, _onCleanup) => {
  // 监听 `value`, 同步值至 `value2`
  watch(value, val => value2.value = val);
});

// 触发监听
source.value.a = 2;
```

## `wheneverEffectScopeImmediateDeep` {#wheneverEffectScopeImmediateDeep}

immediate 和 deep 为 true 的 wheneverEffectScope 方法

### 示例

```ts twoslash
import { wheneverEffectScopeImmediateDeep } from '@mixte/use';
// ---cut-start---
import { ref, watch } from 'vue';
// ---cut-end---

const source = ref({ a: 1 });
const value = ref(1);
const value2 = ref(0);

// immediate 为 true, 会立即触发监听, 执行的 effect 作用域
// deep 为 true, 当 `source` 内的值发生改变, 执行的 effect 作用域
wheneverEffectScopeImmediateDeep(source, (_value, _oldValue, _onCleanup) => {
  // 监听 `value`, 同步值至 `value2`
  watch(value, val => value2.value = val);
});
```
