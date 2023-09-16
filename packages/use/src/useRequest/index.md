---
outline: [1,4]
---

发起请求的组合式方法
  - 旨在解决请求前中后的状态管理、响应数据存储及提供事件钩子
  - 可与任意请求库搭配使用

### 示例

<br>

#### 基础示例

```ts
import { useRequest } from '@mixte/use';

const {
  response, data, error,
  isExecuted, isLoading, isFinished, isSuccess,
  execute,
  onSuccess, onError, onFinally,
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

```ts
import { getUserInfo, login } from '@/api/auth';

const loginInfo = login();
const userInfo = getUserInfo();

function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.value.name); // 取值是不是很长
  console.log(userInfo.data.value.age); // 往下看, 有解决方案
}
```
:::

#### 使用响应式代理式的返回值

:::info
当使用变量接受所有的返回值时, 会导致调用链很长, 这时候, 可以使用响应式代理式的返回值:

```ts {3,4,10,11}
import { getUserInfo, login } from '@/api/auth';

const loginInfo = login().reactive;
const userInfo = getUserInfo().reactive;

function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.name);
  console.log(userInfo.data.age);
}
```
:::

### 类型

```ts
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
  options?: UseRequestOptions<Data>
): {
  /** 服务器响应 */
  response: ShallowRef<Response | undefined>
  /** 服务器响应数据 */
  data: Ref<Data | undefined>
  /** 服务器返回的错误 */
  error: ShallowRef<any>

  /** 是否发起过请求 */
  isExecuted: Ref<boolean>
  /** 是否在请求中 */
  isLoading: Ref<boolean>
  /** 是否已请求完成 */
  isFinished: Ref<boolean>
  /** 是否已请求成功 */
  isSuccess: Ref<boolean>

  /** 发起请求 */
  execute: (...args: Args) => Promise<Response>

  /** 请求成功事件钩子 */
  onSuccess: EventHookOn<Response>
  /** 请求失败事件钩子 */
  onError: EventHookOn<any>
  /** 请求完成事件钩子 */
  onFinally: EventHookOn<null>

  /** 方法的响应式代理返回值 ( 里面的注释就不写了, 和上面的一样 ) */
  reactive: {
    response: Response | undefined
    data: Data | undefined
    error: any
    isExecuted: boolean
    isLoading: boolean
    isFinished: boolean
    isSuccess: boolean
    execute: (...args: Args) => Promise<Response>
    onSuccess: EventHookOn<Response>
    onError: EventHookOn<any>
    onFinally: EventHookOn<null>
  }
};

interface UseRequestOptions<T = undefined> {
  /**
   * 初始数据
   * @default undefined
   */
  initialData?: MaybeRefOrGetter<T>
  /**
   * 是否立即发起请求
   * @default false
   */
  immediate?: boolean
  /**
   * 是否在发起请求时重置数据
   * @default true
   */
  resetOnExecute?: boolean
  /**
   * 是否使用 shallowRef 代替 ref 包裹 data 数据
   * @default false
   */
  shallow?: boolean
}

/**
 * 用户传入的发起请求的函数
 */
type UseRequestUserExecute<Response, Args extends any[]> = (...args: Args) => Promisable<Response>;
```