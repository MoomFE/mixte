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
  return useRequest(info => axios.post('/api/user/login', info)); // [!code ++]
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
    data.value = (await getUserInfo(form))?.data;
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
const { data, isLoading, execute } = getUserInfo();

async function submit() {
  await execute(form);
  // do something
}
```

大功告成 !
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