import { createEventHook, toReactive, toValue } from '@vueuse/core';
import { computed, ref, shallowRef } from 'vue-demi';
import type { MaybeRefOrGetter } from 'vue-demi';

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
}

/**
 *
 */
export function useRequest(userExecute: () => Promise<any>, options: UseRequestOptions<number> = {}) {
  const {
    initialData,
    immediate = false,
  } = options;

  /** 请求成功事件钩子 */
  const successEvent = createEventHook();
  /** 请求失败事件钩子 */
  const errorEvent = createEventHook();
  /** 请求完成事件钩子 */
  const finallyEvent = createEventHook<null>();

  /** 服务器响应 */
  const response = shallowRef();
  /** 服务器响应数据 */
  const data = ref(toValue(initialData));
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
  async function execute() {
    // 标记发起过请求
    isExecuted.value = true;
    // 标记请求中
    isLoading.value = true;
    // 重置参数及状态
    response.value = undefined;
    data.value = toValue(initialData);
    error.value = undefined;
    isFinished.value = false;
    isSuccess.value = false;

    try {
      const res = await userExecute();
      const resData = res?.data;

      response.value = res;
      data.value = resData;

      isLoading.value = false;
      isFinished.value = true;
      isSuccess.value = true;
      successEvent.trigger(res);
      finallyEvent.trigger(null);
    }
    catch (e) {
      isLoading.value = false;
      isFinished.value = true;
      error.value = e;
      errorEvent.trigger(e);
      finallyEvent.trigger(null);
      throw e;
    }
  }

  // 立即发起请求
  immediate && execute();

  return toReactive(
    computed(() => ({
      response,
      data,
      error,

      isExecuted,
      isLoading,
      isFinished,
      isSuccess,

      execute,

      onSuccess: successEvent.on,
      onError: errorEvent.on,
      onFinally: finallyEvent.on,
    })),
  );
}
