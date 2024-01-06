import type { Promisable } from 'type-fest';

/**
 * 异步地遍历数组, 并对每个元素执行回调函数
 *
 * @see https://mixte.moomfe.com/mixte/asyncArrayFn
 * @param array 要遍历的数组
 * @param callback 对每个元素执行的回调函数, 它接受三个参数: `value`, `index` 和 `array`, 回调函数可以是异步的, 可以返回一个 Promise 或一个值
 * @example
 * const array = [1, 2, 3, 4, 5];
 *
 * await asyncForEach(array, async (value, index, array) => {
 *   console.log(`正在处理索引为 ${index} 的元素 ${value}`);
 *   await someAsyncOperation(value);
 *   console.log(`元素 ${value} 处理完毕`);
 * });
 *
 * console.log('所有元素已处理完毕');
 */
export async function asyncForEach<T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promisable<any>,
) {
  for (let index = 0; index < array.length; index++)
    await callback(array[index], index, array);
}
