import { nextTick, ref, watch } from 'vue-demi';
import { wheneverEffectScope } from './index';

describe('wheneverEffectScope', () => {
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

  test('监听传入值为 truthy 时, 创建一个 effect 作用域', async () => {
    const source = ref(false);

    const isScopeRun = ref(false);

    const value = ref(1);
    const value2 = ref();

    wheneverEffectScope(source, (_, __, onCleanup) => {
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

    value.value = 3;
    expect(value2.value).toBe(2);
    await nextTick();
    expect(value2.value).toBe(2);
  });
});
