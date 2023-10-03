import type { AsyncReturnType } from 'type-fest';
import type { EffectScope } from 'vue-demi';
import { effectScope } from 'vue-demi';
import { tryOnScopeDispose } from '@vueuse/core';

export function createNamedSharedComposable<Fn extends (...args: any[]) => any>(composable: Fn) {
  const cache: Record<string, {
    subscribers: number
    state?: ReturnType<Fn>
    scope?: EffectScope
  }> = {};

  return function (name: string, ...args: Parameters<Fn>): AsyncReturnType<Fn> {
    const result = cache[name] || (cache[name] = {
      subscribers: 0,
      state: undefined,
      scope: undefined,
    });

    result.subscribers++;

    if (!result.scope)
      result.state = (result.scope = effectScope()).run(() => composable(...args));

    tryOnScopeDispose(() => {
      result.subscribers--;
      if (result.scope && result.subscribers <= 0) {
        result.scope.stop();
        delete cache[name];
      }
    });

    return result.state!;
  };
}
