import type { AsyncReturnType } from 'type-fest';
import { delay, isFunction } from 'mixte';

/**
 * 运行函数并且保证最少执行指定时间 ( 毫秒 )
 *
 * @see https://mixte.moomfe.com/mixte/leastRun
 * @param ms 最少执行的时间 ( 毫秒 )
 * @param fn 要运行的函数
 * @example
 * async function fn() {
 *   await delay(500);
 * }
 *
 * await leastRun(fn); // -> 运行了 1000ms
 * await leastRun(1200, fn); // -> 运行了 1200ms
 * await leastRun(100, fn); // ->  运行了 500ms
 */
export async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(ms: number, fn: F): Promise<R>;
/**
 * 运行函数并且保证最少执行 1000ms 的时间
 *
 * @see https://mixte.moomfe.com/mixte/leastRun
 * @param fn 要运行的函数
 * @example
 * async function fn() {
 *   await delay(500);
 * }
 *
 * await leastRun(fn); // -> 运行了 1000ms
 * await leastRun(1200, fn); // -> 运行了 1200ms
 * await leastRun(100, fn); // ->  运行了 500ms
 */
export async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(fn: F): Promise<R>;
/**
 * 运行函数并且保证最少执行 1000ms 的时间
 *
 * @see https://mixte.moomfe.com/mixte/leastRun
 * @param ms 最少执行的时间 ( 毫秒 )
 * @example
 * async function fn() {
 *   await delay(500);
 * }
 *
 * await leastRun(fn); // -> 运行了 1000ms
 * await leastRun(1200, fn); // -> 运行了 1200ms
 * await leastRun(100, fn); // ->  运行了 500ms
 */
export async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(ms: number): Promise<R>;

export async function leastRun<
  F extends ((...args: any[]) => any) | ((...args: any[]) => Promise<any>),
  R extends AsyncReturnType<F>,
>(msOrFn: number | F, maybeFn?: F): Promise<R> {
  const start = Date.now();
  let ms = msOrFn as number;
  let fn = maybeFn || (() => {});

  if (isFunction(msOrFn)) {
    ms = 1000;
    fn = msOrFn;
  }

  const result = await fn();

  // 保证函数至少执行了 ms 毫秒
  await delay(Math.max(0, ms - (Date.now() - start)));

  return result;
}
