import type { MaybeRefOrGetter, Ref } from 'vue';
import { useRequestReactive, wheneverEffectScopeImmediate } from '@mixte/use';
import { isFunction, isPlainObject, toArray } from 'mixte';
import { computed, toValue, watch } from 'vue';

export type OptionsApiRequest<T> = (...args: any[]) => Promise<
  T[] |
  {
    data: T[] | { data: T[] };
  }
>;

export interface OptionsApiConfig<T> {
  /** 请求选项数据源的方法 */
  api?: OptionsApiRequest<T>;
  /**
   * 请求参数
   *  - 会传入 `api` 方法
   *  - 支持传入一个函数, 返回一个对象
   *  - 当请求参数发生变化时, 会重新发起请求
   */
  params?: MaybeRefOrGetter<Record<string, any> | undefined>;
  /**
   * 是否立即发起请求
   * @default true
   */
  immediate?: boolean;
}

export type OptionsApi<T> = OptionsApiRequest<T> | OptionsApiConfig<T>;

/**
 * 从不同结构的响应中提取数据数组
 */
function extractData<T>(res: any): T[] | undefined {
  if (Array.isArray(res)) return res;

  if (isPlainObject(res)) {
    if (Array.isArray(res.data)) return res.data;

    if (isPlainObject(res.data) && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  }
}

export function useOptionsApi<T>(optionsApi: Ref<OptionsApi<T> | undefined>) {
  const propApi = computed(() => isFunction(optionsApi.value) ? optionsApi.value : optionsApi.value?.api);
  const propImmediate = computed(() => isFunction(optionsApi.value) ? true : (optionsApi.value?.immediate ?? true));
  const propParams = computed(() => toArray(isFunction(optionsApi.value) ? undefined : toValue(optionsApi.value?.params)));

  const api = useRequestReactive<T[] | undefined>(async () => {
    const response = await propApi.value?.(...propParams.value);
    return extractData<T>(response);
  });

  const loading = computed(() => propApi.value && api.isLoading);

  if (propApi.value && propImmediate.value) {
    api.execute();
  }

  wheneverEffectScopeImmediate(propApi, () => {
    watch(() => JSON.stringify(propParams.value), () => {
      api.execute();
    });
  });

  return {
    propApi,

    api,
    loading,
  };
}
