import { tryOnScopeDispose } from '@vueuse/core';

export function createNamedSharedComposable<Fn extends (...args: any[]) => any>(composable: Fn) {
  const cache: Record<string, ReturnType<Fn>> = {};

  return function (name: string, ...args: Parameters<Fn>) {
    let result = cache[name];

    if (!result) {
      result = cache[name] = composable(...args);
      tryOnScopeDispose(() => {
        delete cache[name];
      });
    }

    return result;
  };
}
