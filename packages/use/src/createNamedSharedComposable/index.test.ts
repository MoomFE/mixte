import { delay } from 'mixte';

describe('createNamedSharedComposable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('传入函数, 返回一个新函数, 接收 name 参数和原有函数的所有参数', () => {
    const fn = (a: number, b: number) => [a, b];
    const newFn = createNamedSharedComposable(fn);

    expect(fn).not.toBe(newFn);

    expect(fn(1, 2)).toEqual([1, 2]);
    expect(newFn('name', 1, 2)).toEqual([1, 2]);
  });

  test('使用同样的 name 时, 多次调用, 返回首次调用的结果', () => {
    const fn = (obj?: any) => obj;
    const newFn = createNamedSharedComposable(fn);

    const obj = { a: 1 };
    const obj2 = { a: 2 };

    expect(newFn('name', obj)).toBe(obj);
    expect(newFn('name', obj2)).toBe(obj);
    expect(newFn('name', obj2)).toBe(obj);

    expect(newFn('name2', obj2)).toBe(obj2);
    expect(newFn('name2', obj)).toBe(obj2);
    expect(newFn('name2', obj2)).toBe(obj2);
  });

  test('包装异步函数', async () => {
    let result: any;

    const fn = async (a?: any) => {
      await delay(1000);
      return result = a;
    };
    const newFn = createNamedSharedComposable(fn);

    const obj = { a: 1 };
    const obj2 = { a: 2 };

    expect(vi.getTimerCount()).toBe(0);

    const res = newFn('name', obj);
    const res2 = newFn('name', obj2);

    expect(vi.getTimerCount()).toBe(1);
    expect(res).toBeInstanceOf(Promise);
    expect(res).toBe(res2);
    expect(result).toBeUndefined();

    vi.advanceTimersByTime(1000);
    await Promise.resolve();

    expect(vi.getTimerCount()).toBe(0);
    expect(result).toBe(obj);
    expect(await res).toBe(obj);
    expect(await res2).toBe(obj);
    expect(await newFn('name', obj2)).toBe(obj);
  });

  test('在 effect 作用域中使用时, 当作用域被注销, 缓存会被清除', () => {
    const fn = (obj?: any) => obj;
    const newFn = createNamedSharedComposable(fn);

    const obj = { a: 1 };
    const obj2 = { a: 2 };

    const scope = effectScope();
    const scope2 = effectScope();
    const scope3 = effectScope();
    const scope4 = effectScope();

    scope.run(() => {
      expect(newFn('name', obj)).toBe(obj);
    });
    scope2.run(() => {
      expect(newFn('name', obj2)).toBe(obj);
    });

    scope.stop();

    scope3.run(() => {
      expect(newFn('name', obj2)).toBe(obj);
    });

    scope2.stop();
    scope3.stop();

    scope4.run(() => {
      expect(newFn('name', obj2)).toBe(obj2);
    });
  });
});
