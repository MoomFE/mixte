import { nextTick, ref, watch } from 'vue-demi';
import { wheneverEffectScope, wheneverEffectScopeImmediate } from '@mixte/use';

describe('wheneverEffectScope', () => {
  test('监听传入值为 truthy 时, 创建一个 effect 作用域', async () => {
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
    expect(isScopeRun.value).toBe(false);
    expect(value2.value).toBeUndefined();
    await nextTick();
    expect(isScopeRun.value).toBe(true);
    expect(value2.value).toBe(1);

    // effect 作用域内的 watch 会在传入值变化时执行
    value.value = 2;
    expect(value2.value).toBe(1);
    await nextTick();
    expect(value2.value).toBe(2);

    // 当值变为 falsy 时, 停止之前创建的 effect 作用域
    source.value = false;
    expect(isScopeRun.value).toBe(true);
    expect(value2.value).toBe(2);
    await nextTick();
    expect(isScopeRun.value).toBe(false);
    expect(value2.value).toBe(2);

    // 已停止的 effect 作用域内的 watch 不会再执行
    value.value = 3;
    expect(value2.value).toBe(2);
    await nextTick();
    expect(value2.value).toBe(2);

    unWatch();
  });

  test('当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域', async () => {
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
    expect(isScopeRun.value).toBe(false);
    expect(scopeRunCount.value).toBe(0);
    expect(scopeDisposeCount.value).toBe(0);
    await nextTick();
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(1);
    expect(scopeDisposeCount.value).toBe(0);

    // 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
    source.value = 2;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(1);
    expect(scopeDisposeCount.value).toBe(0);
    await nextTick();
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(2);
    expect(scopeDisposeCount.value).toBe(1);

    // 当传入值改变但依旧为 truthy 时, 会停止之前创建的 effect 作用域并创建一个新的 effect 作用域
    source.value = 3;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(2);
    expect(scopeDisposeCount.value).toBe(1);
    await nextTick();
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(3);
    expect(scopeDisposeCount.value).toBe(2);

    // 当值变为 falsy 时, 停止之前创建的 effect 作用域
    source.value = false;
    expect(isScopeRun.value).toBe(true);
    expect(scopeRunCount.value).toBe(3);
    expect(scopeDisposeCount.value).toBe(2);
    await nextTick();
    expect(isScopeRun.value).toBe(false);
    expect(scopeRunCount.value).toBe(3);
    expect(scopeDisposeCount.value).toBe(3);

    unWatch();
  });

  test('当值变为 falsy 时, 将会停止之前创建的 effect 作用域', async () => {
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

  test('调用方法返回的 unWatch 方法, 会停止创建的 effect 作用域', async () => {
    const source = ref(1);
    const value = ref();
    const unWatch = wheneverEffectScope(source, (v) => {
      value.value = v;
    });

    expect(value.value).toBeUndefined();

    source.value = 2;
    expect(value.value).toBeUndefined();
    await nextTick();
    expect(value.value).toBe(2);

    source.value = 3;
    expect(value.value).toBe(2);
    await nextTick();
    expect(value.value).toBe(3);

    unWatch();

    source.value = 4;
    expect(value.value).toBe(3);
    await nextTick();
    expect(value.value).toBe(3);
  });

  test('本质上是创建一个 watch', async () => {
    const source = ref(1);
    const value = ref();
    const unWatch = wheneverEffectScope(source, (v) => {
      value.value = v;
    });

    expect(value.value).toBeUndefined();

    source.value = 2;
    expect(value.value).toBeUndefined();
    await nextTick();
    expect(value.value).toBe(2);

    source.value = 3;
    expect(value.value).toBe(2);
    await nextTick();
    expect(value.value).toBe(3);

    unWatch();

    source.value = 4;
    expect(value.value).toBe(3);
    await nextTick();
    expect(value.value).toBe(3);
  });

  test('为创建的 watch 传递 options', () => {
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
  test('immediate 默认为 true 的 wheneverEffectScope 方法', async () => {
    const source = ref<number | boolean>(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
      fn3: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');
    const fn3 = vi.spyOn(watchFns, 'fn3');

    wheneverEffectScope(source, watchFns.fn1);
    wheneverEffectScope(source, watchFns.fn2, { immediate: true });
    wheneverEffectScopeImmediate(source, watchFns.fn3);

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
  });

  test('重新传入 immediate 选项是无效的', async () => {
    const source = ref<number | boolean>(1);
    const watchFns = {
      fn1: () => {},
      fn2: () => {},
    };

    const fn1 = vi.spyOn(watchFns, 'fn1');
    const fn2 = vi.spyOn(watchFns, 'fn2');

    wheneverEffectScopeImmediate(source, watchFns.fn1);
    wheneverEffectScopeImmediate(source, watchFns.fn2, { immediate: false } as any);

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
  });
});
