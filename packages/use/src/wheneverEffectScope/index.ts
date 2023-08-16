import type { EffectScope, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi';
import { effectScope, watch } from 'vue-demi';

/**
 * 监听传入值为 truthy 时, 创建一个 effect 作用域
 *  - 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
 *  - 当值变为 falsy 时, 将会停止之前创建的 effect 作用域
 * @example
 * const source = ref(false);
 * const value = ref(1);
 * const value2 = ref(0);
 *
 * wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
 *   watchImmediate(value, (v) => {
 *     value2.value = v;
 *   });
 * });
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
    options,
  );

  return () => {
    dispose();
    unWatch();
  };
}

/**
 * immediate 默认为 true 的 wheneverEffectScope 方法
 */
export function wheneverEffectScopeImmediate<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>) {
  return wheneverEffectScope(source, run, { ...options, immediate: true });
}

/**
 * deep 默认为 true 的 wheneverEffectScope 方法
 */
export function wheneverEffectScopeDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>) {
  return wheneverEffectScope(source, run, { ...options, deep: true });
}

/**
 * immediate 和 deep 默认为 true 的 wheneverEffectScope 方法
 */
export function wheneverEffectScopeImmediateDeep<T>(source: WatchSource<T | false | null | undefined>, run: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate' | 'deep'>) {
  return wheneverEffectScope(source, run, { ...options, immediate: true, deep: true });
}
