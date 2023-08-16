## `watchImmediate`

immediate 默认为 true 的 watch 方法

### 示例

```ts
import { watchImmediate } from '@mixte/use';

const obj = ref(1);

watchImmediate(obj, (val) => {
  console.log(val); // -> 将依次输出 1, 2
});

obj.value = 2;
```

### 类型

```ts
function watchImmediate<T extends MultiWatchSources>(sources: [...T], cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
function watchImmediate<T extends Readonly<MultiWatchSources>>(source: T, cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
function watchImmediate<T>(source: WatchSource<T>, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
function watchImmediate<T extends object>(source: T, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
```


## `watchDeep`

deep 默认为 true 的 watch 方法

### 示例

```ts
import { watchDeep } from '@mixte/use';

const obj = ref({ a: 1 });

watchDeep(obj, (val) => {
  console.log(val); // -> 将输出 { a: 2 }
});

obj.value.a = 2;
```

### 类型

```ts
export function watchDeep<T extends MultiWatchSources, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
export function watchDeep<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
export function watchDeep<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
export function watchDeep<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
```


## `watchImmediateDeep`

immediate 和 deep 都为 true 的 watch 方法

### 示例

```ts
import { watchImmediateDeep } from '@mixte/use';

const obj = ref({ a: 1 });

watchImmediateDeep(obj, (val) => {
  console.log(val); // -> 将依次输出 { a: 1 }, { a: 2 }
});

obj.value.a = 2;
```

### 类型

```ts
export function watchImmediateDeep<T extends MultiWatchSources>(sources: [...T], cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
export function watchImmediateDeep<T extends Readonly<MultiWatchSources>>(source: T, cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
export function watchImmediateDeep<T>(source: WatchSource<T>, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
export function watchImmediateDeep<T extends object>(source: T, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
```
