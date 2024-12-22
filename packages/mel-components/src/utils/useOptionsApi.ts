import type { Ref } from 'vue';
import { useRequestReactive } from '@mixte/use';
import { isFunction } from 'mixte';
import { computed } from 'vue';

export type OptionsApiRequest<T> = () => Promise<T[]>;

export interface OptionsApiConfig<T> {
  /** 请求选项数据源的方法 */
  api?: OptionsApiRequest<T>;
  /**
   * 是否立即发起请求
   * @default true
   */
  immediate?: boolean;
}

export type OptionsApi<T> = OptionsApiRequest<T> | OptionsApiConfig<T>;

export function useOptionsApi<T>(optionsApi: Ref<OptionsApi<T> | undefined>) {
  const propApi = computed(() => isFunction(optionsApi.value) ? optionsApi.value : optionsApi.value?.api);
  const propImmediate = computed(() => isFunction(optionsApi.value) ? true : (optionsApi.value?.immediate ?? true));

  const api = useRequestReactive<T[] | undefined>(() => propApi.value?.());

  const loading = computed(() => propApi.value && api.isLoading);

  if (propApi.value && propImmediate.value) {
    api.execute();
  }

  return {
    propApi,

    api,
    loading,
  };
}
