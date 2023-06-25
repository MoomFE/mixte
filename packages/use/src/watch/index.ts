import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi';
import { watch } from 'vue-demi';

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

type WatchOptionsNoImmediate = Omit<WatchOptions, 'immediate'>;

export function watchImmediate<T extends MultiWatchSources>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>,
  options?: WatchOptionsNoImmediate
): WatchStopHandle;

export function watchImmediate<T extends Readonly<MultiWatchSources>>(
  source: T,
  cb: WatchCallback<MapSources<T, true>, MapSources<T, true>>,
  options?: WatchOptionsNoImmediate
): WatchStopHandle;

export function watchImmediate<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T, true>,
  options?: WatchOptionsNoImmediate
): WatchStopHandle;

export function watchImmediate<T extends object>(
  source: T,
  cb: WatchCallback<T, true>,
  options?: WatchOptionsNoImmediate
): WatchStopHandle;

/**
 * immediate 默认为 true 的 watch 方法
 */
export function watchImmediate<T = any>(source: T, cb: any, options?: WatchOptionsNoImmediate) {
  return watch(source as any, cb, { ...options, immediate: true });
}
