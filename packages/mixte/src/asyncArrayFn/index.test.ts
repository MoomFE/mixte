import { asyncForEach, delay } from 'mixte';

describe('asyncForEach', () => {
  test('方法返回一个 Promise', () => {
    expect(asyncForEach([], () => {})).toBeInstanceOf(Promise);
  });

  test('遍历空数组', async () => {
    const callback = vi.fn();
    await asyncForEach([], callback);
    expect(callback).not.toHaveBeenCalled();
  });

  test('遍历非空数组', async () => {
    const array = [1, 2, 3, 4, 5];
    const callback = vi.fn();

    await asyncForEach(array, callback);

    expect(callback).toHaveBeenCalledTimes(array.length);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0, array);
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1, array);
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2, array);
    expect(callback).toHaveBeenNthCalledWith(4, 4, 3, array);
    expect(callback).toHaveBeenNthCalledWith(5, 5, 4, array);
  });

  test('回调函数可以是异步的, 可以返回一个 Promise', async () => {
    const array = [1, 2, 3, 4, 5];
    const callback = vi.fn(() => delay(10));

    await asyncForEach(array, callback);

    expect(callback).toHaveBeenCalledTimes(array.length);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0, array);
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1, array);
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2, array);
    expect(callback).toHaveBeenNthCalledWith(4, 4, 3, array);
    expect(callback).toHaveBeenNthCalledWith(5, 5, 4, array);
  });

  test('方法返回的 Promise 在所有回调函数执行完毕后才会被 resolve', async () => {
    const array = [1, 2, 3, 4, 5];
    const callback = vi.fn(async () => {
      await delay(10);
    });

    const promise = asyncForEach(array, callback);

    expect(callback).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalledTimes(array.length);
    await promise;
    expect(callback).toHaveBeenCalledTimes(array.length);
  });
});
