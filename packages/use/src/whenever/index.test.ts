import { whenever, wheneverDeep, wheneverImmediate, wheneverImmediateDeep } from '@mixte/use';
import { nextTick, ref } from 'vue';

describe('whenever', () => {
  it('监听值是 `truthy` 时执行回调函数', async () => {
    const a = ref<any>(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
      fn4: () => {},
      fn5: () => {},
      fn6: () => {},
      fn7: () => {},
      fn8: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');
    const fn4 = vi.spyOn(watchFns, 'fn4');
    const fn5 = vi.spyOn(watchFns, 'fn5');
    const fn6 = vi.spyOn(watchFns, 'fn6');
    const fn7 = vi.spyOn(watchFns, 'fn7');
    const fn8 = vi.spyOn(watchFns, 'fn8');

    whenever(a, watchFns.fn1);
    whenever(a, watchFns.fn2, { immediate: true });
    whenever(a, watchFns.fn3, { immediate: true, deep: true });
    whenever(a, watchFns.fn4, { immediate: true, once: true });
    whenever(a, watchFns.fn5, { immediate: true, deep: true, once: true });
    whenever(a, watchFns.fn6, { deep: true });
    whenever(a, watchFns.fn7, { deep: true, once: true });
    whenever(a, watchFns.fn8, { once: true });

    // 1: truthy
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1); // immediate
    expect(fn3).toHaveBeenCalledTimes(1); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).not.toHaveBeenCalled(); // deep
    expect(fn7).not.toHaveBeenCalled(); // deep + once
    expect(fn8).not.toHaveBeenCalled(); // once

    await nextTick();

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1); // immediate
    expect(fn3).toHaveBeenCalledTimes(1); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).not.toHaveBeenCalled(); // deep
    expect(fn7).not.toHaveBeenCalled(); // deep + once
    expect(fn8).not.toHaveBeenCalled(); // once

    // 2: truthy
    a.value = 2;
    await nextTick();

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2); // immediate
    expect(fn3).toHaveBeenCalledTimes(2); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).toHaveBeenCalledTimes(1); // deep
    expect(fn7).toHaveBeenCalledTimes(1); // deep + once
    expect(fn8).toHaveBeenCalledTimes(1); // once

    // 3: truthy
    a.value = 3;
    await nextTick();

    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(3); // immediate
    expect(fn3).toHaveBeenCalledTimes(3); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).toHaveBeenCalledTimes(2); // deep
    expect(fn7).toHaveBeenCalledTimes(1); // deep + once
    expect(fn8).toHaveBeenCalledTimes(1); // once

    // 0: falsy
    a.value = 0;
    await nextTick();

    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(3); // immediate
    expect(fn3).toHaveBeenCalledTimes(3); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).toHaveBeenCalledTimes(2); // deep
    expect(fn7).toHaveBeenCalledTimes(1); // deep + once
    expect(fn8).toHaveBeenCalledTimes(1); // once

    // { a: 1 }: truthy
    a.value = { a: 1 };
    await nextTick();

    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveBeenCalledTimes(4); // immediate
    expect(fn3).toHaveBeenCalledTimes(4); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).toHaveBeenCalledTimes(3); // deep
    expect(fn7).toHaveBeenCalledTimes(1); // deep + once
    expect(fn8).toHaveBeenCalledTimes(1); // once

    // { a: 2 }: truthy
    a.value.a = 2;
    await nextTick();

    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveBeenCalledTimes(4); // immediate
    expect(fn3).toHaveBeenCalledTimes(5); // immediate + deep
    expect(fn4).toHaveBeenCalledTimes(1); // immediate + once
    expect(fn5).toHaveBeenCalledTimes(1); // immediate + deep + once
    expect(fn6).toHaveBeenCalledTimes(4); // deep
    expect(fn7).toHaveBeenCalledTimes(1); // deep + once
    expect(fn8).toHaveBeenCalledTimes(1); // once
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
