import type { EffectScope, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue';
import { effectScope, watch } from 'vue';

/**
 * 监听传入值为 truthy 时, 创建一个 effect 作用域
 *  - 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
 *  - 当值变为 falsy 时, 将会停止之前创建的 effect 作用域
 *
 * @see https://mixte.moomfe.com/mixte/use/wheneverEffectScope#wheneverEffectScope
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, 和 watch 一致
 * @example
 * const source = ref(false);
 * const value = ref(1);
 * const value2 = ref(0);
 *
 * // 当 `source` 为 truthy 时, 执行的 effect 作用域
 * wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
 *   // 监听 `value`, 同步值至 `value2`
 *   watch(value, val => value2.value = val, {
 *     immediate: true,
 *   });
 * });
 *
 * // 触发监听
 * source.value = true;
 */
export function wheneverEffectScope<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: WatchOptions): WatchStopHandle {
  let scope: EffectScope | void;

  const dispose = () => {
    scope?.stop();
    scope = undefined;
  };

  const unWatch = watch(
    source,
    (value, oldValue, onCleanup) => {
      if (value) {
        scope && dispose();
        scope = effectScope();
        scope.run(() => run(value, oldValue, onCleanup));
      }
      else {
        dispose();
      }
    },
    {
      ...options,
      flush: 'sync',
    },
  );

  return () => {
    dispose();
    unWatch();
  };
}

/**
 * immediate 为 true 的 wheneverEffectScope 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/wheneverEffectScope#wheneverEffectScopeImmediate
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, immediate 为 true, 其他和 watch 一致
 * @example
 * const source = ref(true);
 * const value = ref(1);
 * const value2 = ref(0);
 *
 * // immediate 为 true, 会立即触发监听, 执行的 effect 作用域
 * wheneverEffectScopeImmediate(source, (_value, _oldValue, _onCleanup) => {
 *   // 监听 `value`, 同步值至 `value2`
 *   watch(value, val => value2.value = val);
 * });
 */
export function wheneverEffectScopeImmediate<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>) {
  return wheneverEffectScope(source, run, { ...options, immediate: true });
}

/**
 * deep 为 true 的 wheneverEffectScope 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/wheneverEffectScope#wheneverEffectScopeDeep
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, deep 为 true, 其他和 watch 一致
 * @example
 * const source = ref({ a: 1 });
 * const value = ref(1);
 * const value2 = ref(0);
 *
 * // 当 `source` 为 truthy 时或 `source` 内的值发生改变, 执行的 effect 作用域
 * wheneverEffectScopeDeep(source, (_value, _oldValue, _onCleanup) => {
 *   // 监听 `value`, 同步值至 `value2`
 *   watch(value, val => value2.value = val);
 * });
 *
 * // 触发监听
 * source.value.a = 2;
 */
export function wheneverEffectScopeDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>) {
  return wheneverEffectScope(source, run, { ...options, deep: true });
}

/**
 * immediate 和 deep 为 true 的 wheneverEffectScope 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/wheneverEffectScope#wheneverEffectScopeImmediateDeep
 * @param source 侦听器的源, 和 watch 一致
 * @param run 当 source 为 truthy 时执行的 effect 作用域
 * @param options 选项, immediate 和 deep 为 true, 其他和 watch 一致
 * @example
 * const source = ref({ a: 1 });
 * const value = ref(1);
 * const value2 = ref(0);
 *
 * // immediate 为 true, 会立即触发监听, 执行的 effect 作用域
 * // deep 为 true, 当 `source` 内的值发生改变, 执行的 effect 作用域
 * wheneverEffectScopeImmediateDeep(source, (_value, _oldValue, _onCleanup) => {
 *   // 监听 `value`, 同步值至 `value2`
 *   watch(value, val => value2.value = val);
 * });
 */
export function wheneverEffectScopeImmediateDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate' | 'deep'>) {
  return wheneverEffectScope(source, run, { ...options, immediate: true, deep: true });
}
