## `wheneverEffectScope` {#wheneverEffectScope}

- 监听传入值为 truthy 时, 创建一个 effect 作用域
  - 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
  - 当值变为 falsy 时, 将会停止之前创建的 effect 作用域

### 示例

```ts
import { wheneverEffectScope } from '@mixte/use';

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

### 类型

```ts
/**
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, 和 watch 一致
 */
function wheneverEffectScope<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: WatchOptions): WatchStopHandle;
```

## `wheneverEffectScopeImmediate` {#wheneverEffectScopeImmediate}

immediate 为 true 的 wheneverEffectScope 方法

### 示例

```ts
import { wheneverEffectScopeImmediate } from '@mixte/use';

const source = ref(true);
const value = ref(1);
const value2 = ref(0);

// immediate 为 true, 会立即触发监听, 执行的 effect 作用域
wheneverEffectScopeImmediate(source, (_value, _oldValue, _onCleanup) => {
  // 监听 `value`, 同步值至 `value2`
  watch(value, val => value2.value = val);
});
```

### 类型

```ts
/**
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, immediate 为 true, 其他和 watch 一致
 */
function wheneverEffectScopeImmediate<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
```

## `wheneverEffectScopeDeep` {#wheneverEffectScopeDeep}

deep 为 true 的 wheneverEffectScope 方法

### 示例

```ts
import { wheneverEffectScopeDeep } from '@mixte/use';

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

### 类型

```ts
/**
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, deep 为 true, 其他和 watch 一致
 */
function wheneverEffectScopeDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>): WatchStopHandle;
```

## `wheneverEffectScopeImmediateDeep` {#wheneverEffectScopeImmediateDeep}

immediate 和 deep 为 true 的 wheneverEffectScope 方法

### 示例

```ts
import { wheneverEffectScopeImmediateDeep } from '@mixte/use';

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

### 类型

```ts
/**
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, immediate 和 deep 为 true, 其他和 watch 一致
 */
function wheneverEffectScopeImmediateDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
```
