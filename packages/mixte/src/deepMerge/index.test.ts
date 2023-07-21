import { deepMerge, isPlainObject } from 'mixte';
import { types } from '../is/testTypes';

describe('deepMerge', () => {
  test('目标对象不是普通对象和数组时, 会被直接返回', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        if (!Array.isArray(value) && isPlainObject(value))
          expect(deepMerge(value, { a: 1 })).toBe(value);
      });
    });
  });

  test('会合并所有传入参数的属性', () => {
    // 普通对象
    expect(deepMerge({ a: 1 })).toEqual({ a: 1 });
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 })).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });

    // 数组
    expect(deepMerge([1])).toEqual([1]);
    expect(deepMerge([1], [2])).toEqual([2]);
    expect(deepMerge([1], [2], [3])).toEqual([3]);
    expect(deepMerge([1], [2], [3], [4])).toEqual([4]);
    expect(deepMerge([1], [2], [3], [4], [5])).toEqual([5]);
  });

  test('合并时是将所有来源对象的属性合并到目标对象上', () => {
    // 普通对象
    const a = { aa: 1 };
    const b = { bb: 2 };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: 1, bb: 2 });
    expect(b).toEqual({ bb: 2 });
    expect(c).toBe(a);
    expect(c).not.toBe(b);

    // 数组
    const arr1 = [1];
    const arr2 = [2];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([2]);
    expect(arr2).toEqual([2]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
  });

  test('来源对象从左到右进行深拷贝, 后续的来源对象会覆盖之前拷贝的属性', () => {
    // 普通对象
    const a = { aa: 1 };
    const b = { aa: 2, bb: 3 };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: 2, bb: 3 });
    expect(b).toEqual({ aa: 2, bb: 3 });
    expect(c).toBe(a);
    expect(c).not.toBe(b);

    // 数组
    const arr1 = [1];
    const arr2 = [2, 3];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([2, 3]);
    expect(arr2).toEqual([2, 3]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
  });

  test('来源对象中值为 `undefined` 的属性会被跳过', () => {
    // 普通对象
    const a = { aa: 1 };
    const b = { aa: undefined, bb: 2 };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: 1, bb: 2 });
    expect(b).toEqual({ aa: undefined, bb: 2 });
    expect(c).toBe(a);
    expect(c).not.toBe(b);

    // 数组
    const arr1 = [1];
    const arr2 = [undefined, 2];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([1, 2]);
    expect(arr2).toEqual([undefined, 2]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
  });

  test('来源对象中普通对象将会递归合并', () => {
    // 普通对象
    const a = { aa: { aaa: 1, bbb: 2 } };
    const b = { aa: { aaa: undefined, bbb: 3, ccc: 4 } };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: { aaa: 1, bbb: 3, ccc: 4 } });
    expect(b).toEqual({ aa: { aaa: undefined, bbb: 3, ccc: 4 } });
    expect(c).toBe(a);
    expect(c).not.toBe(b);

    // 数组
    const arr1 = [{ aa: { aaa: 1, bbb: 2 } }];
    const arr2 = [{ aa: { aaa: undefined, bbb: 3, ccc: 4 } }];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([{ aa: { aaa: 1, bbb: 3, ccc: 4 } }]);
    expect(arr2).toEqual([{ aa: { aaa: undefined, bbb: 3, ccc: 4 } }]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
  });

  test('来源对象中数组会被深拷贝后继承', () => {
    // 普通对象
    const a = { aa: [1, 2] };
    const b = { aa: [undefined, 3, 4] };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: [undefined, 3, 4] });
    expect(b).toEqual({ aa: [undefined, 3, 4] });
    expect(c).toBe(a);
    expect(c).not.toBe(b);
    expect(a.aa).not.toBe(b.aa);

    // 数组
    const arr1 = [[1, 2], [3, 4]];
    const arr2 = [[undefined, 3, 4], [5, undefined, 6]];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([[undefined, 3, 4], [5, undefined, 6]]);
    expect(arr2).toEqual([[undefined, 3, 4], [5, undefined, 6]]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
    expect(arr1[0]).not.toBe(arr2[0]);
    expect(arr1[1]).not.toBe(arr2[1]);
  });

  test('来源对象中其他对象将会直接继承', () => {
    expect(/mixte/).not.toBe(/mixte/);

    // 普通对象
    const a = { aa: 1 };
    const b = { aa: /mixte/ };
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: /mixte/ });
    expect(b).toEqual({ aa: /mixte/ });
    expect(c).toBe(a);
    expect(c).not.toBe(b);
    expect(a.aa).toBe(b.aa);

    // 数组
    const arr1 = [1];
    const arr2 = [/mixte/];
    const arr3 = deepMerge(arr1, arr2);

    expect(arr1).toEqual([/mixte/]);
    expect(arr2).toEqual([/mixte/]);
    expect(arr3).toBe(arr1);
    expect(arr3).not.toBe(arr2);
    expect(arr1[0]).toBe(arr2[0]);
  });

  test('从数组合并到普通对象', () => {
    const a = { aa: 1 };
    const b = [2, 3, 4];
    const c = deepMerge(a, b);

    expect(a).toEqual({ aa: 1, 0: 2, 1: 3, 2: 4 });
    expect(b).toEqual([2, 3, 4]);
    expect(c).toBe(a);
    expect(c).not.toBe(b);
  });

  test('从普通对象合并到数组', () => {
    const a = [1, 2, 3];
    const b = { 3: 4 };
    const c = deepMerge(a, b);

    expect(a).toEqual([1, 2, 3, 4]);
    expect(b).toEqual({ 3: 4 });
    expect(c).toBe(a);
    expect(c).not.toBe(b);
  });

  // test('防御循环引用 ( 一 )', () => {
  //   // 普通对象
  //   const target = { a: 1 };
  //   const source = { a: 2, b: target, c: 2 };
  //   let cache = {} as any;

  //   expect(deepMerge(target, source)).toEqual({ a: 2, b: target, c: 2 });
  //   expect(deepMerge(cache, target, source)).toEqual({ a: 2, b: cache, c: 2 });

  //   // 数组
  //   const targetArr = [1] as any[];
  //   const sourceArr = [2, targetArr, 3];
  //   cache = [];

  //   expect(deepMerge(targetArr, sourceArr)).toEqual([2, targetArr, 3]);
  //   expect(deepMerge(cache, targetArr, sourceArr)).toEqual([2, cache, 3]);
  // });
});
