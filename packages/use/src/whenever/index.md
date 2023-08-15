## `whenever`

监听值是 `truthy` 时执行回调函数, 是直接导出 `@vueuse/core` 的 [whenever](https://vueuse.org/shared/whenever)

### 类型

```ts
function whenever<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WatchOptions): WatchStopHandle;
```

### 示例

```ts
import { whenever } from '@mixte/use';

const obj = ref(1);

whenever(obj, (val) => {
  console.log(val); // -> 将输出 2
});

obj.value = 0; // -> 不会输出
nextTick(() => {
  obj.value = 2;
});
```

```ts
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


## `wheneverImmediate`

immediate 默认为 true 的 whenever 方法

### 类型

```ts
function wheneverImmediate<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
```

### 示例

```ts
import { wheneverImmediate } from '@mixte/use';

const obj = ref(1);

wheneverImmediate(obj, (val) => {
  console.log(val); // -> 将依次输出 1, 2
});

obj.value = 2;
```


## `wheneverDeep`

deep 默认为 true 的 whenever 方法

### 类型

```ts
function wheneverDeep<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>): WatchStopHandle;
```

### 示例

```ts
import { wheneverDeep } from '@mixte/use';

const obj = ref({ a: 1 });

wheneverDeep(obj, (val) => {
  console.log(val); // -> 将输出 { a: 2 }
});

obj.value.a = 2;
```


## `wheneverImmediateDeep`

immediate 和 deep 默认为 true 的 whenever 方法

### 类型

```ts
function wheneverImmediateDeep<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
```

### 示例

```ts
import { wheneverImmediateDeep } from '@mixte/use';

const obj = ref({ a: 1 });

wheneverImmediateDeep(obj, (val) => {
  console.log(val); // -> 将依次输出 { a: 1 }, { a: 2 }
});

obj.value.a = 2;
```
