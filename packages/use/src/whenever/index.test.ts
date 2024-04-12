import { nextTick, ref } from 'vue-demi';
import { whenever as vueuseWhenever } from '@vueuse/core';
import { whenever, wheneverDeep, wheneverImmediate, wheneverImmediateDeep } from '@mixte/use';

describe('whenever', () => {
  it('导出的 whenever 方法为 @vueuse/core 中的 whenever 方法', () => {
    expect(whenever).toBe(vueuseWhenever);
  });
});

describe('wheneverImmediate', () => {
  it('immediate 默认为 true 的 whenever 方法', async () => {
    const a = ref(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    whenever(a, watchFns.fn1);
    whenever(a, watchFns.fn2, { immediate: true });
    wheneverImmediate(a, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);

    a.value = 3;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveBeenCalledTimes(3);
  });

  it('重新传入 immediate 选项是无效的', async () => {
    const a = ref(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    wheneverImmediate(a, watchFns.fn1);
    wheneverImmediate(a, watchFns.fn2, { immediate: false } as any);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    a.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    a.value = 3;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveBeenCalledTimes(3);
  });
});

describe('wheneverDeep', () => {
  it('deep 默认为 true 的 whenever 方法', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    whenever(a, watchFns.fn1);
    whenever(a, watchFns.fn2, { deep: true });
    wheneverDeep(a, watchFns.fn3);

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

    wheneverDeep(a, watchFns.fn1);
    wheneverDeep(a, watchFns.fn2, { deep: false } as any);

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

describe('wheneverImmediateDeep', () => {
  it('immediate 和 deep 默认为 true 的 whenever 方法', async () => {
    const a = ref({ b: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    whenever(a, watchFns.fn1);
    whenever(a, watchFns.fn2, { immediate: true, deep: true });
    wheneverImmediateDeep(a, watchFns.fn3);

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

    wheneverImmediateDeep(a, watchFns.fn1);
    wheneverImmediateDeep(a, watchFns.fn2, { immediate: false, deep: false } as any);

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
