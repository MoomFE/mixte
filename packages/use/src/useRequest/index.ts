import type { Promisable } from 'type-fest';
import type { MaybeRefOrGetter } from 'vue-demi';
import { createEventHook, toReactive, toValue } from '@vueuse/core';
import { computed, isVue2, ref, shallowRef } from 'vue-demi';

export interface UseRequestOptions {
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
  options: UseRequestOptions = {},
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

      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = false;
      error.value = e;
      errorEvent.trigger(e);
      finallyEvent.trigger();
      throw e;
    }
  }

  // 初始化数据
  data.value = toValue(initialData);
  // 立即发起请求
  // @ts-expect-error
  immediate && execute();

  const common = {
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

    /** 发起请求 */
    execute,

    /** 请求成功事件钩子 */
    onSuccess: successEvent.on,
    /** 请求失败事件钩子 */
    onError: errorEvent.on,
    /** 请求完成事件钩子 */
    onFinally: finallyEvent.on,
  };

  const reactive = toReactive(
    computed(() => ({
      ...common,
      /** 服务器响应 */
      response: (isVue2 ? shallowRef(response.value) : computed(() => shallowRef(response.value))) as unknown as typeof response,
      /** 服务器响应数据 */
      data: (isVue2 ? shallowRef(data.value) : computed(() => shallowRef(data.value))) as unknown as typeof data,
      /** 服务器返回的错误 */
      error: (isVue2 ? shallowRef(error.value) : computed(() => shallowRef(error.value))) as typeof error,
    })),
  );

  return {
    ...common,
    /** 方法的响应式代理返回值 */
    reactive,
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
  options: UseRequestOptions = {},
) {
  return useRequest<Response, Data, Args>(userExecute, options).reactive;
}
