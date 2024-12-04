import type { EffectScope } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { effectScope } from 'vue';

/**
 * 可命名的共享函数/组合式函数
 *   - 对传入的函数进行包装, 返回一个新的函数
 *     - 调用该函数并传入命名及参数, 会将参数传入原函数并执行, 并将结果返回
 *     - 再次调用时, 如果是相同的命名, 则会直接返回上次的结果, 不会再次执行原函数
 *   - 在 Vue 实例 / effect 作用域中使用时
 *     - 当引用该函数的所有 Vue 实例 / effect 作用域销毁时, 会自动清除缓存
 *
 * @see https://mixte.moomfe.com/mixte/use/createNamedSharedComposable
 * @param composable 要共享的函数/组合式函数
 * @returns 包装后的新函数
 * @example
 * import { createNamedSharedComposable } from '@mixte/use';
 *
 * function getUserInfo(tenantId: string, id: string) {
 *   return axios.get(`/api/${tenantId}/user/${id}`);
 * }
 *
 * const getSharedUserInfo = createNamedSharedComposable(getUserInfo);
 *
 * // CompA.vue
 * //  - 第一个参数是命名, 后面的参数会全部传递给 getUserInfo 方法并执行
 * console.log(getSharedUserInfo('xxx/1', 'xxx', '1'));
 *
 * // CompB.vue
 * //  - 相同的命名, 会复用第一次调用时的缓存
 * console.log(getSharedUserInfo('xxx/1', 'xxx', '1'));
 * //  - 使用不同的命名, 会使用新命名创建缓存并执行 getUserInfo 方法
 * console.log(getSharedUserInfo('xxx/2', 'xxx', '2'));
 *
 * // 如果你十分确定之前执行过, 也可以只传入命名不传参数
 * // console.log(getSharedUserInfo('xxx/1'))
 */
export function createNamedSharedComposable<Fn extends (...args: any[]) => any>(composable: Fn) {
  const cache: Record<string, {
    subscribers: number;
    state?: ReturnType<Fn>;
    scope?: EffectScope;
  }> = {};

  function clear(name?: string) {
    const names = ([] as string[]).concat(name ?? Object.keys(cache));

    for (const name of names) {
      cache[name]?.scope?.stop();
      delete cache[name];
    }
  }

  return Object.assign(
    (name: string, ...args: Parameters<Fn>): ReturnType<Fn> => {
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
    },
    { clear },
  );
}
