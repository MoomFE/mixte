import type { MaybeRefOrGetter } from '@vueuse/core';
import { wheneverImmediate } from '@mixte/use';
import { toValue, tryOnScopeDispose } from '@vueuse/core';
import { ref, shallowRef } from 'vue';

const ReadAs = {
  DataURL: 'readAsDataURL',
  Text: 'readAsText',
  ArrayBuffer: 'readAsArrayBuffer',
} as const;

/**
 * 读取文件内容
 *
 * @see https://mixte.moomfe.com/mixte/use/useFileReader
 * @param file 文件
 * @param readAs 读取方式
 */
export function useFileReader<
  RA extends 'DataURL' | 'Text' | 'ArrayBuffer' = 'DataURL',
  R extends string | ArrayBuffer = RA extends 'ArrayBuffer' ? ArrayBuffer : string,
>(
  file: MaybeRefOrGetter<Blob | null | undefined>,
  readAs?: RA,
) {
  const reader = new FileReader();
  const result = ref<R | null | undefined>();
  const error = shallowRef<any>();
  const isReading = ref(false);

  reader.onload = (e) => {
    result.value = e.target?.result as any;
    isReading.value = false;
  };

  reader.onerror = (e) => {
    error.value = e;
    isReading.value = false;
  };

  wheneverImmediate(() => toValue(file), (file) => {
    reader.abort();
    result.value = undefined;
    error.value = undefined;
    isReading.value = true;

    try {
      reader[(readAs && ReadAs[readAs]) || 'readAsDataURL'](file);
    }
    catch (e) {
      error.value = e;
      isReading.value = false;
    }
  });

  tryOnScopeDispose(() => {
    reader.abort();
  });

  return {
    result,
    error,
    isReading,
  };
}
