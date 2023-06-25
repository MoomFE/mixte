import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi';
import { whenever } from '@vueuse/core';

/**
 * immediate 默认为 true 的 whenever 方法
 */
export function wheneverImmediate<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>) {
  return whenever(source, cb, { ...options, immediate: true });
}

/**
 * deep 默认为 true 的 whenever 方法
 */
export function wheneverDeep<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>) {
  return whenever(source, cb, { ...options, deep: true });
}

/**
 * immediate 和 deep 默认为 true 的 whenever 方法
 */
export function wheneverImmediateDeep<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate' | 'deep'>) {
  return whenever(source, cb, { ...options, immediate: true, deep: true });
}
