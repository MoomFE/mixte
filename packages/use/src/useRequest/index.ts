import type { EventHook } from '@vueuse/core';
import type { Promisable } from 'type-fest';
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';
import { createEventHook } from '@vueuse/core';
import { reactive, ref, shallowRef, toValue } from 'vue';

export interface UseRequestOptions<Response> {
  /**
   * 初始数据
   *  - 传递的数据会使用 `toValue` 进行转换
   * @default undefined
   */
  initialData?: any;
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
  /** 请求成功事件钩子 */
  onSuccess?: Parameters<EventHook<Response>['on']>['0'];
  /** 请求失败事件钩子 */
  onError?: Parameters<EventHook<any>['on']>['0'];
  /** 请求完成事件钩子 */
  onFinally?: Parameters<EventHook['on']>['0'];
}

export interface UseRequestReturn<
  Response,
  Data extends Response extends { data: infer D } ? D : never,
  Args extends any[],
> {
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

  /** 发起请求 */
  execute: (...args: Args) => Promise<Response>;
  /** 重置请求到初始状态 */
  reset: () => void;

  /** 请求成功事件钩子 */
  onSuccess: EventHook<Response>['on'];
  /** 请求失败事件钩子 */
  onError: EventHook<any>['on'];
  /** 请求完成事件钩子 */
  onFinally: EventHook['on'];
}

/**
 * 用户传入的发起请求的函数
 */
export type UseRequestUserExecute<Response, Args extends any[]> = (...args: Args) => Promisable<Response>;

/**
 * 发起请求的组合式函数
 *
 * @see https://mixte.moomfe.com/mixte/use/useRequest#useRequest
 * @param userExecute 用户传入的发起请求的函数
 * @param options 配置项
 */
export function useRequest<
  Response,
  Data extends Response extends { data: infer D } ? D : never = Response extends { data: infer D } ? D : never,
  Args extends any[] = any[],
>(
  userExecute: UseRequestUserExecute<Response, Args>,
  options: UseRequestOptions<Response> = {},
) {
  const {
    initialData,
    immediate = false,
    shallow = false,
  } = options;

  /** 请求成功事件钩子 */
  const successEvent = createEventHook<Response>();
  /** 请求失败事件钩子 */
  const errorEvent = createEventHook<any>();
  /** 请求完成事件钩子 */
  const finallyEvent = createEventHook();

  /** 服务器响应 */
  const response = shallowRef<Response>();
  /** 服务器响应数据 */
  const data = (shallow ? shallowRef : ref)<Data>();
  /** 服务器返回的错误 */
  const error = shallowRef<any>();
  /** 是否发起过请求 */
  const isExecuted = ref(false);
  /** 是否在请求中 */
  const isLoading = ref(false);
  /** 是否已请求完成 */
  const isFinished = ref(false);
  /** 是否已请求成功 */
  const isSuccess = ref(false);

  let executeCount = 0;

  /** 发起请求 */
  async function execute(...args: Args): Promise<Response> {
    const currentExecuteCount = ++executeCount;

    // 标记发起过请求
    isExecuted.value = true;
    // 标记请求中
    isLoading.value = true;
    // 重置状态
    isFinished.value = false;
    isSuccess.value = false;
    // 重置变量
    if (toValue(options.resetOnExecute) ?? true) {
      response.value = undefined;
      data.value = toValue(initialData);
      error.value = undefined;
    }

    try {
      const res = await userExecute(...args);

      if (currentExecuteCount !== executeCount)
        return res;

      response.value = res;
      data.value = (res as { data: Data } | undefined)?.data;
      error.value = undefined;

      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = true;
      successEvent.trigger(res);
      finallyEvent.trigger();
      return res;
    }
    catch (e) {
      if (currentExecuteCount !== executeCount)
        throw e;

      response.value = undefined;
      data.value = toValue(initialData);
      error.value = e;

      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = false;
      errorEvent.trigger(e);
      finallyEvent.trigger();
      throw e;
    }
  }

  /** 重置请求到初始状态 */
  function reset() {
    executeCount++;
    response.value = undefined;
    data.value = toValue(initialData);
    error.value = undefined;
    isExecuted.value = false;
    isLoading.value = false;
    isFinished.value = false;
    isSuccess.value = false;
  }

  options.onSuccess && successEvent.on(options.onSuccess);
  options.onError && errorEvent.on(options.onError);
  options.onFinally && finallyEvent.on(options.onFinally);

  // 初始化数据
  data.value = toValue(initialData);
  // 立即发起请求
  // @ts-expect-error
  immediate && execute();

  const common: UseRequestReturn<Response, Data, Args> = {
    response,
    data,
    error,

    isExecuted,
    isLoading,
    isFinished,
    isSuccess,

    execute,
    reset,

    onSuccess: successEvent.on,
    onError: errorEvent.on,
    onFinally: finallyEvent.on,
  };

  return {
    ...common,
    reactive: reactive(common),
  };
}

/**
 * 发起请求的组合式函数
 *  - 和 `useRequest` 方法一致, 只是返回响应式代理对象
 *
 * @see https://mixte.moomfe.com/mixte/use/useRequest#useRequestReactive
 */
export function useRequestReactive<
  Response,
  Data extends Response extends { data: infer D } ? D : never = Response extends { data: infer D } ? D : never,
  Args extends any[] = any[],
>(
  userExecute: UseRequestUserExecute<Response, Args>,
  options: UseRequestOptions<Response> = {},
) {
  return useRequest<Response, Data, Args>(userExecute, options).reactive;
}
