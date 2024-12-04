import { wheneverEffectScope, wheneverEffectScopeDeep, wheneverEffectScopeImmediate, wheneverEffectScopeImmediateDeep } from '@mixte/use';
import { nextTick, ref, watch } from 'vue';

describe('wheneverEffectScope', () => {
  it('监听传入值为 truthy 时, 创建一个 effect 作用域', async () => {
    const source = ref(false);

    const isScopeRun = ref(false);

    const value = ref(1);
    const value2 = ref();

    const unWatch = wheneverEffectScope(source, (_, __, onCleanup) => {
      isScopeRun.value = true;

      watch(value, v => value2.value = v, {
        immediate: true,
      });

      onCleanup(() => {
        isScopeRun.value = false;
      });
    });

    expect(isScopeRun.value).toBe(false);
    expect(value2.value).toBeUndefined();

    // 当值变为 truthy 时, 创建 effect 作用域
    source.value = true;
    expect(isScopeRun.value).toBe(true);
    expect(value2.value).toBe(1);

    // effect 作用域内的 watch 会在传入值变化时执行
    value.value = 2;
    expect(value2.value).toBe(1);
    await nextTick();
    expect(value2.value).toBe(2);

    // 当值变为 falsy 时, 停止之前创建的 effect 作用域
    source.value = false;
    expect(isScopeRun.value).toBe(false);
    expect(value2.value).toBe(2);

    // 已停止的 effect 作用域内的 watch 不会再执行
    value.value = 3;
    expect(value2.value).toBe(2);
    await nextTick();
    expect(value2.value).toBe(2);

    unWatch();
  });

  it('当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域', async () => {
    const source = ref<number | boolean>(false);

    const isScopeRun = ref(false);
    const scopeRunCount = ref(0);
    const scopeDisposeCount = ref(0);

    const unWatch = wheneverEffectScope(source, (_, __, onCleanup) => {
      isScopeRun.value = true;
      scopeRunCount.value++;

      onCleanup(() => {
        isScopeRun.value = false;
        scopeDisposeCount.value++;
      });
    });

    expect(isScopeRun.value).toBe(false);
    expect(scopeRunCount.value).toBe(0);
    expect(scopeDisposeCount.value).toBe(0);

    // 当值变为 truthy 时, 创建 effect 作用域
    source.value = 1;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(1);
    expect(scopeDisposeCount.value).toBe(0);

    // 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
    source.value = 2;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(2);
    expect(scopeDisposeCount.value).toBe(1);

    // 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
    source.value = 3;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(3);
    expect(scopeDisposeCount.value).toBe(2);

    // 当值变为 falsy 时, 停止之前创建的 effect 作用域
    source.value = false;
    expect(isScopeRun.value).toBe(false);
    expect(scopeRunCount.value).toBe(3);
    expect(scopeDisposeCount.value).toBe(3);

    unWatch();
  });

  it('当值变为 falsy 时, 将会停止之前创建的 effect 作用域', async () => {
    const source = ref(false);

    const isScopeRun = ref(false);
    const scopeRunCount = ref(0);
    const scopeDisposeCount = ref(0);

    const unWatch = wheneverEffectScope(source, (_, __, onCleanup) => {
      isScopeRun.value = true;
      scopeRunCount.value++;

      onCleanup(() => {
        isScopeRun.value = false;
        scopeDisposeCount.value++;
      });
    });

    // 当值变为 truthy 时, 创建 effect 作用域
    source.value = true;
    await nextTick();
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(1);
    expect(scopeDisposeCount.value).toBe(0);

    // 当值变为 falsy 时, 停止之前创建的 effect 作用域
    source.value = false;
    await nextTick();
    expect(isScopeRun.value).toBe(false);
    expect(scopeRunCount.value).toBe(1);
    expect(scopeDisposeCount.value).toBe(1);

    unWatch();
  });

  it('调用方法返回的 unWatch 方法, 会停止创建的 effect 作用域', async () => {
    const source = ref(1);
    const value = ref();
    const unWatch = wheneverEffectScope(source, (v) => {
      value.value = v;
    });

    expect(value.value).toBeUndefined();

    source.value = 2;
    expect(value.value).toBe(2);

    source.value = 3;
    expect(value.value).toBe(3);

    unWatch();

    source.value = 4;
    expect(value.value).toBe(3);
  });

  it('本质上是创建一个 watch', async () => {
    const source = ref(1);
    const value = ref();
    const unWatch = wheneverEffectScope(source, (v) => {
      value.value = v;
    });

    expect(value.value).toBeUndefined();

    source.value = 2;
    expect(value.value).toBe(2);

    source.value = 3;
    expect(value.value).toBe(3);

    unWatch();

    source.value = 4;
    expect(value.value).toBe(3);
  });

  it('为创建的 watch 传递 options', () => {
    const source = ref(1);
    const value = ref();
    const unWatch = wheneverEffectScope(source, (v) => {
      value.value = v;
    }, {
      flush: 'sync',
      immediate: true,
    });

    expect(value.value).toBe(1);

    source.value = 2;
    expect(value.value).toBe(2);

    source.value = 3;
    expect(value.value).toBe(3);

    unWatch();

    source.value = 4;
    expect(value.value).toBe(3);
  });
});

describe('wheneverEffectScopeImmediate', () => {
  it('immediate 默认为 true 的 wheneverEffectScope 方法', async () => {
    const source = ref<number | boolean>(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    const unWatch = wheneverEffectScope(source, watchFns.fn1);
    const unWatch2 = wheneverEffectScope(source, watchFns.fn2, { immediate: true });
    const unWatch3 = wheneverEffectScopeImmediate(source, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    source.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);

    source.value = false;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);

    unWatch();
    unWatch2();
    unWatch3();
  });

  it('重新传入 immediate 选项是无效的', async () => {
    const source = ref<number | boolean>(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    const unWatch = wheneverEffectScopeImmediate(source, watchFns.fn1);
    const unWatch2 = wheneverEffectScopeImmediate(source, watchFns.fn2, { immediate: false } as any);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    source.value = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    source.value = false;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    unWatch();
    unWatch2();
  });
});

describe('wheneverEffectScopeDeep', () => {
  it('deep 默认为 true 的 wheneverEffectScope 方法', async () => {
    const source = ref({ a: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    const unWatch = wheneverEffectScope(source, watchFns.fn1);
    const unWatch2 = wheneverEffectScope(source, watchFns.fn2, { deep: true });
    const unWatch3 = wheneverEffectScopeDeep(source, watchFns.fn3);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
    expect(fn3).not.toHaveBeenCalled();

    source.value.a = 2;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    source.value = { a: 3 };
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);

    source.value.a = 4;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveBeenCalledTimes(3);

    unWatch();
    unWatch2();
    unWatch3();
  });

  it('重新传入 deep 选项是无效的', async () => {
    const source = ref({ a: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    const unWatch = wheneverEffectScopeDeep(source, watchFns.fn1);
    const unWatch2 = wheneverEffectScopeDeep(source, watchFns.fn2, { deep: false } as any);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    source.value.a = 2;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    source.value = { a: 3 };
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);

    source.value.a = 4;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveBeenCalledTimes(3);

    unWatch();
    unWatch2();
  });
});

describe('wheneverEffectScopeImmediateDeep', () => {
  it('immediate 和 deep 默认为 true 的 wheneverEffectScope 方法', async () => {
    const source = ref({ a: 1 });
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
      fn4: () => {},
      fn5: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');
    const fn4 = vi.spyOn(watchFns, 'fn4');
    const fn5 = vi.spyOn(watchFns, 'fn5');

    const unWatch = wheneverEffectScope(source, watchFns.fn1);
    const unWatch2 = wheneverEffectScope(source, watchFns.fn2, { immediate: true });
    const unWatch3 = wheneverEffectScope(source, watchFns.fn3, { deep: true });
    const unWatch4 = wheneverEffectScope(source, watchFns.fn4, { immediate: true, deep: true });
    const unWatch5 = wheneverEffectScopeImmediateDeep(source, watchFns.fn5);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).not.toHaveBeenCalled();
    expect(fn4).toHaveBeenCalledTimes(1);
    expect(fn5).toHaveBeenCalledTimes(1);

    source.value.a = 2;
    await nextTick();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(fn4).toHaveBeenCalledTimes(2);
    expect(fn5).toHaveBeenCalledTimes(2);

    source.value = { a: 3 };
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);
    expect(fn4).toHaveBeenCalledTimes(3);
    expect(fn5).toHaveBeenCalledTimes(3);

    source.value.a = 4;
    await nextTick();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(3);
    expect(fn4).toHaveBeenCalledTimes(4);
    expect(fn5).toHaveBeenCalledTimes(4);

    unWatch();
    unWatch2();
    unWatch3();
    unWatch4();
    unWatch5();
  });
});
