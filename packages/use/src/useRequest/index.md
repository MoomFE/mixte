---
outline: [1,3]
---

发起请求的组合式方法

### 示例

```ts
import { useRequest } from '@mixte/use';

const {
  response, data, error,
  isExecuted, isLoading, isFinished, isSuccess,
  execute,
  onSuccess, onError, onFinally,
} = useRequest(() => {
  return fetch('https://api.github.com/users/mixte');
});

onMounted(() => {
  execute();
});
```

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