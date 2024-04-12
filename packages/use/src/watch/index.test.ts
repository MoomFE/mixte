import { nextTick, ref, watch } from 'vue-demi';
import { watchDeep, watchImmediate, watchImmediateDeep } from '@mixte/use';

describe('watchImmediate', () => {
  it('immediate 默认为 true 的 watch 方法', async () => {
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
    expect(fn2.mock.calls[0].slice(0, 2)).toStrictEqual([1, undefined]);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn3.mock.calls[0].slice(0, 2)).toStrictEqual([1, undefined]);
    fn1.mockClear();
    fn2.mockClear();
    fn3.mockClear();

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1.mock.calls[0].slice(0, 2)).toStrictEqual([2, 1]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toStrictEqual([2, 1]);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn3.mock.calls[0].slice(0, 2)).toStrictEqual([2, 1]);
  });

  it('重新传入 immediate 选项是无效的', async () => {
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
    expect(fn1.mock.calls[0].slice(0, 2)).toStrictEqual([1, undefined]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toStrictEqual([1, undefined]);
    fn1.mockClear();
    fn2.mockClear();

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1.mock.calls[0].slice(0, 2)).toStrictEqual([2, 1]);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2.mock.calls[0].slice(0, 2)).toStrictEqual([2, 1]);
  });
});

describe('watchDeep', () => {
  it('deep 默认为 true 的 watch 方法', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    watch(a, watchFns.fn1);
    watch(a, watchFns.fn2, { deep: true });
    watchDeep(a, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
    expect(fn3).not.toHaveBeenCalled();

    a.value.b = 2;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    a.value.b = 3;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);
  });

  it('重新传入 deep 选项是无效的', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    watchDeep(a, watchFns.fn1);
    watchDeep(a, watchFns.fn2, { deep: false } as any);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    a.value.b = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    a.value.b = 3;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });
});

describe('watchImmediateDeep', () => {
  it('immediate 和 deep 都为 true 的 watch 方法', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    watch(a, watchFns.fn1);
    watch(a, watchFns.fn2, { immediate: true, deep: true });
    watchImmediateDeep(a, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    a.value.b = 2;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);

    a.value.b = 3;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveBeenCalledTimes(3);
  });

  it('重新传入 immediate 和 deep 选项是无效的', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    watchImmediateDeep(a, watchFns.fn1);
    watchImmediateDeep(a, watchFns.fn2, { immediate: false, deep: false } as any);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    a.value.b = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    a.value.b = 3;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveBeenCalledTimes(3);
  });
});
