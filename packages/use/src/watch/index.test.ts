import { nextTick, ref, watch } from 'vue-demi';
import { watchImmediate } from './index';

describe('watchImmediate', () => {
  test('immediate 默认为 true 的 watch 方法', async () => {
    const a = ref(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    watch(a, watchFns.fn1);
    watch(a, watchFns.fn2, { immediate: true });
    watchImmediate(a, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toEqual([1, undefined]);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn3.mock.calls[0].slice(0, 2)).toEqual([1, undefined]);
    fn1.mockClear();
    fn2.mockClear();
    fn3.mockClear();

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1.mock.calls[0].slice(0, 2)).toEqual([2, 1]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toEqual([2, 1]);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn3.mock.calls[0].slice(0, 2)).toEqual([2, 1]);
  });

  test('重新传入 immediate 选项是无效的', async () => {
    const a = ref(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    watchImmediate(a, watchFns.fn1);
    watchImmediate(a, watchFns.fn2, { immediate: false } as any);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1.mock.calls[0].slice(0, 2)).toEqual([1, undefined]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toEqual([1, undefined]);
    fn1.mockClear();
    fn2.mockClear();

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1.mock.calls[0].slice(0, 2)).toEqual([2, 1]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toEqual([2, 1]);
  });
});
