import type { Promisable } from 'type-fest';
import type { MaybeRefOrGetter } from 'vue-demi';
import { createEventHook, toReactive, toValue } from '@vueuse/core';
import { computed, ref, shallowRef } from 'vue-demi';

export interface UseRequestOptions<T = undefined> {
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
export type UseRequestUserExecute<Response, Args extends any[]> = (...args: Args) => Promisable<Response>;

/**
 * 发起请求的组合式方法
 * @param userExecute 用户传入的发起请求的函数
 * @param options 配置项
 */
export function useRequest<
  Response,
  Data extends Response extends { data: infer D } ? D : never = Response extends { data: infer D } ? D : never,
  Args extends any[] = any[],
>(
  userExecute: UseRequestUserExecute<Response, Args>,
  options: UseRequestOptions<Data> = {},
) {
  const {
    initialData,
    immediate = false,
    resetOnExecute = true,
    shallow = false,
  } = options;

  /** 请求成功事件钩子 */
  const successEvent = createEventHook<Response>();
  /** 请求失败事件钩子 */
  const errorEvent = createEventHook<any>();
  /** 请求完成事件钩子 */
  const finallyEvent = createEventHook<null>();

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

  /** 发起请求 */
  async function execute(...args: Args): Promise<Response> {
    // 标记发起过请求
    isExecuted.value = true;
    // 标记请求中
    isLoading.value = true;
    // 重置状态
    isFinished.value = false;
    isSuccess.value = false;
    // 重置变量
    if (resetOnExecute) {
      response.value = undefined;
      data.value = toValue(initialData);
      error.value = undefined;
    }

    try {
      const res = await userExecute(...args);
      const resData = (res as { data: Data } | undefined)?.data;

      response.value = res;
      data.value = resData;

      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = true;
      successEvent.trigger(res);
      finallyEvent.trigger(null);
      return res;
    }
    catch (e) {
      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = false;
      error.value = e;
      errorEvent.trigger(e);
      finallyEvent.trigger(null);
      throw e;
    }
  }

  // 初始化数据
  data.value = toValue(initialData);
  // 立即发起请求
  // @ts-expect-error
  immediate && execute();

  const onSuccess = successEvent.on;
  const onError = errorEvent.on;
  const onFinally = finallyEvent.on;

  return {
    /** 服务器响应 */
    response,
    /** 服务器响应数据 */
    data,
    /** 服务器返回的错误 */
    error,

    /** 是否发起过请求 */
    isExecuted,
    /** 是否在请求中 */
    isLoading,
    /** 是否已请求完成 */
    isFinished,
    /** 是否已请求成功 */
    isSuccess,

    execute,

    /** 请求成功事件钩子 */
    onSuccess,
    /** 请求失败事件钩子 */
    onError,
    /** 请求完成事件钩子 */
    onFinally,

    reactive: toReactive(
      computed(() => ({
        /** 服务器响应 */
        response: computed(() => shallowRef(response.value)) as unknown as typeof response,
        /** 服务器响应数据 */
        data: computed(() => shallowRef(data.value)) as unknown as typeof data,
        /** 服务器返回的错误 */
        error: computed(() => shallowRef(error.value)) as typeof error,

        /** 是否发起过请求 */
        isExecuted,
        /** 是否在请求中 */
        isLoading,
        /** 是否已请求完成 */
        isFinished,
        /** 是否已请求成功 */
        isSuccess,

        execute,

        /** 请求成功事件钩子 */
        onSuccess,
        /** 请求失败事件钩子 */
        onError,
        /** 请求完成事件钩子 */
        onFinally,
      })),
    ),
  };
}
