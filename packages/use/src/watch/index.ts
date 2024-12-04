import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue';
import { watch } from 'vue';

// @vue/runtime-core/dist/runtime-core.d.ts
type MultiWatchSources = (WatchSource<unknown> | object)[];
type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
      ? Immediate extends true
        ? T[K] | undefined
        : T[K]
      : never;
};

// ------------------ watchImmediate ------------------ //

/**
 * immediate 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediate
 */
export function watchImmediate<T extends MultiWatchSources>(sources: [...T], cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
/**
 * immediate 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediate
 */
export function watchImmediate<T extends Readonly<MultiWatchSources>>(source: T, cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
/**
 * immediate 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediate
 */
export function watchImmediate<T>(source: WatchSource<T>, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;
/**
 * immediate 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediate
 */
export function watchImmediate<T extends object>(source: T, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate'>): WatchStopHandle;

export function watchImmediate<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'immediate'>) {
  return watch(source as any, cb, { ...options, immediate: true });
}

// ------------------ watchDeep ------------------ //

/**
 * deep 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchDeep
 */
export function watchDeep<T extends MultiWatchSources, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
/**
 * deep 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchDeep
 */
export function watchDeep<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
/**
 * deep 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchDeep
 */
export function watchDeep<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;
/**
 * deep 默认为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchDeep
 */
export function watchDeep<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: Omit<WatchOptions<Immediate>, 'deep'>): WatchStopHandle;

export function watchDeep<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'deep'>) {
  return watch(source as any, cb, { ...options, deep: true });
}

// ------------------ watchImmediateDeep ------------------ //

/**
 * immediate 和 deep 都为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediateDeep
 */
export function watchImmediateDeep<T extends MultiWatchSources>(sources: [...T], cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
/**
 * immediate 和 deep 都为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediateDeep
 */
export function watchImmediateDeep<T extends Readonly<MultiWatchSources>>(source: T, cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
/**
 * immediate 和 deep 都为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediateDeep
 */
export function watchImmediateDeep<T>(source: WatchSource<T>, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;
/**
 * immediate 和 deep 都为 true 的 watch 方法
 *
 * @see https://mixte.moomfe.com/mixte/use/watch#watchImmediateDeep
 */
export function watchImmediateDeep<T extends object>(source: T, cb: WatchCallback<T, true>, options?: Omit<WatchOptions, 'immediate' | 'deep'>): WatchStopHandle;

export function watchImmediateDeep<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'immediate' | 'deep'>) {
  return watch(source as any, cb, { ...options, immediate: true, deep: true });
}
