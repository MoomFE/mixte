---
outline: [2,4]
---

## `useRequest` {#useRequest}

发起请求的组合式方法
  - 旨在解决请求前中后的状态管理、响应数据存储及提供事件钩子
  - 可与任意请求库搭配使用

### 示例

<br>

#### 基础示例

```ts
import { useRequest } from '@mixte/use';

const {
  response,
  data,
  error,
  isExecuted,
  isLoading,
  isFinished,
  isSuccess,
  execute,
  onSuccess,
  onError,
  onFinally,
  reactive,
} = useRequest(() => {
  return axios.get('https://httpbin.org/uuid');
});
```

#### 在现有项目中使用

:::info 修改步骤
1. 把现有定义接口的方式, 改为使用 `useRequest` 的方式:

```ts
function login(info) { // [!code --]
  return axios.post('/api/user/login', info); // [!code --]
} // [!code --]

function login() { // [!code ++]
  return useRequest((info) => { // [!code ++]
    return axios.post('/api/user/login', info); // [!code ++]
  }); // [!code ++]
} // [!code ++]
```

2. 在调用端, 从:

```ts
const form = reactive({ username: '', password: '' });
const data = ref();
const loading = ref(false);

async function submit() {
  loading.value = true;

  try {
    data.value = (await login(form))?.data;
    // do something
  }
  finally {
    loading.value = false;
  }
}
```

改为:

```ts
const form = reactive({ username: '', password: '' });
const { data, isLoading, execute } = login();

async function submit() {
  await execute(form);
  // do something
}
```

大功告成 !
:::

#### 同时定义多个请求

:::info
通常, 在页面或组件中都会发起多次请求, 这时候, 可以使用一个变量接受所有的返回值:

```ts {3,4,10,11}
import { getUserInfo, login } from '@/api/auth';

const loginInfo = login();
const userInfo = getUserInfo();

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.value.name);
  console.log(userInfo.data.value.age);
}
```

::: tip
因为 `data`、`isLoading`、`...` 是一个 `ref` 变量, 所以需要加 `.value` 取值, 导致调用链很长

往下看, 下面就有解决方案
:::

#### 使用响应式代理式的返回值

:::info
当使用变量接受所有的返回值时, 会导致调用链很长, 这时候, 可以使用响应式代理式的返回值:

```ts {3,4,10,11}
import { getUserInfo, login } from '@/api/auth';

const loginInfo = login().reactive;
const userInfo = getUserInfo().reactive;

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.name);
  console.log(userInfo.data.age);
}
```
:::

#### 统一在请求完成后数据处理

```ts {6,7,8,14,20}
import { getUserInfo, login } from '@/api/auth';

const loginInfo = login().reactive;
const userInfo = getUserInfo().reactive;

userInfo.onSuccess(() => {
  userInfo.data.name = 'Mixte';
});

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.name); // -> Mixte
}

async function otherLogic() {
  await userInfo.execute();

  console.log(userInfo.data.name); // -> Mixte
}
```

#### 配置项

:::info
在定义接口处配置:

```ts {4}
function login() {
  return useRequest(
    info => axios.post('/api/user/login', info),
    { immediate: true }
  );
}

const loginInfo = login();
```

也可以在定义接口处接收相关配置选项, 在调用端根据需求自行配置:

```ts {3,6,10,11,12,13}
import type { UseRequestOptions } from '@mixte/use';

function login(options?: UseRequestOptions) {
  return useRequest(
    info => axios.post('/api/user/login', info),
    options
  );
}

const loginInfo = login({
  immediate: true,
  resetOnExecute: false,
});
```
:::

### 类型

```ts
interface UseRequestOptions {
  /**
   * 初始数据
   *  - 传递的数据会使用 `toValue` 进行转换
   * @default undefined
   */
  initialData?: MaybeRefOrGetter<any>;
  /**
   * 是否立即发起请求
   * @default false
   */
  immediate?: boolean;
  /**
   * 是否在发起请求时重置数据
   * @default true
   */
  resetOnExecute?: MaybeRefOrGetter<boolean>;
  /**
   * 是否使用 shallowRef 代替 ref 包裹 data 数据
   * @default false
   */
  shallow?: boolean;
}

/**
 * 用户传入的发起请求的函数
 */
type UseRequestUserExecute<Response, Args extends any[]> = (...args: Args) => Promisable<Response>;

/**
 * @param userExecute 用户传入的发起请求的函数
 * @param options 配置项
 */
function useRequest<
  Response,
  Data extends Response extends { data: infer D } ? D : never = Response extends { data: infer D } ? D : never,
  Args extends any[] = any[],
>(
  userExecute: UseRequestUserExecute<Response, Args>,
  options?: UseRequestOptions
): {
  /** 服务器响应 */
  response: ShallowRef<Response | undefined>;
  /** 服务器响应数据 */
  data: Ref<Data | undefined>;
  /** 服务器返回的错误 */
  error: ShallowRef<any>;

  /** 是否发起过请求 */
  isExecuted: Ref<boolean>;
  /** 是否在请求中 */
  isLoading: Ref<boolean>;
  /** 是否已请求完成 */
  isFinished: Ref<boolean>;
  /** 是否已请求成功 */
  isSuccess: Ref<boolean>;

  /** 请求成功次数 */
  successCount: Ref<number>;
  /** 清除请求成功次数 */
  clearSuccessCount: () => void;

  /** 发起请求 */
  execute: (...args: Args) => Promise<Response>;

  /** 请求成功事件钩子 */
  onSuccess: EventHookOn<Response>;
  /** 请求失败事件钩子 */
  onError: EventHookOn<any>;
  /** 请求完成事件钩子 */
  onFinally: EventHookOn<null>;

  /** 方法的响应式代理返回值 ( 里面的注释就不写了, 和上面的一样 ) */
  reactive: {
    response: Response | undefined;
    data: Data | undefined;
    error: any;
    isExecuted: boolean;
    isLoading: boolean;
    isFinished: boolean;
    isSuccess: boolean;
    successCount: number;
    clearSuccessCount: () => void;
    execute: (...args: Args) => Promise<Response>;
    onSuccess: EventHookOn<Response>;
    onError: EventHookOn<any>;
    onFinally: EventHookOn<null>;
  };
};
```

## `useRequestReactive` {#useRequestReactive}

发起请求的组合式方法
  - 和 `useRequest` 方法一致, 只是返回响应式代理对象

### 示例

<br>

#### 从 `useRequest` 改为使用 `useRequestReactive`

:::info 修改步骤
1. 原有使用 `useRequest` 时:

```ts {1,5,6,7}
const uuid = useRequest(() => {
  return axios.get('https://httpbin.org/uuid');
});

console.log(uuid.response.value); // 需要使用 `.value` 获取值
console.log(uuid.data.value); // 需要使用 `.value` 获取值
console.log(uuid.error.value); // 需要使用 `.value` 获取值
```

2. 修改方法为 `useRequestReactive` 后:

```ts {1,5,6,7}
const uuid = useRequestReactive(() => {
  return axios.get('https://httpbin.org/uuid');
});

console.log(uuid.response); // 不用再使用 `.value` 了
console.log(uuid.data); // 不用再使用 `.value` 了
console.log(uuid.error); // 不用再使用 `.value` 了
```
:::
