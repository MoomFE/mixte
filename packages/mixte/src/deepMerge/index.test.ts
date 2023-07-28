import { deepMerge, isPlainObject } from 'mixte';
import { types } from '../is/testTypes';

describe('deepMerge', () => {
  test('目标对象不是普通对象和数组时, 会被直接返回', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        if (!Array.isArray(value) && !isPlainObject(value)) {
          expect(deepMerge(value, { a: 1 })).toBe(value);
          expect(deepMerge(value, [{ a: 1 }])).toBe(value);
        }
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

  test('来源对象不是普通对象和数组时, 会被直接跳过', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        if (Array.isArray(value) || isPlainObject(value)) return;

        expect(deepMerge({}, value, { a: 1 })).toEqual({ a: 1 });
        expect(deepMerge([], value, [{ a: 1 }])).toEqual([{ a: 1 }]);
      });
    });
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

  test('来源对象中的普通对象和数组会覆盖目标对象中的同名不同类型的属性', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        if (Array.isArray(value)) {
          expect(deepMerge({ value }, { value: { a: 1 } })).toEqual({ value: { a: 1 } });
        }
        else if (isPlainObject(value)) {
          expect(deepMerge({ value }, { value: [1] })).toEqual({ value: [1] });
        }
        else {
          expect(deepMerge({ value }, { value: [1] })).toEqual({ value: [1] });
          expect(deepMerge({ value }, { value: { a: 1 } })).toEqual({ value: { a: 1 } });
        }
      });
    });
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

  test('防御循环引用 ( 一 )', () => {
    // 普通对象
    const target = {};
    const source = { target };
    const cache = {};

    expect(deepMerge(cache, target, source)).toEqual({ target: cache });
    expect(deepMerge(target, source)).toEqual({ target });

    // 数组
    const targetArr = [] as any[];
    const sourceArr = [targetArr];
    const cacheArr = [] as any[];

    expect(deepMerge(cacheArr, targetArr, sourceArr)).toEqual([cacheArr]);
    expect(deepMerge(targetArr, sourceArr)).toEqual([targetArr]);
  });

  test('防御循环引用 ( 二 )', () => {
    // 普通对象
    const target = {} as any;
    const source = {} as any;
    const cache = {};

    target.source = source;
    source.target = target;

    expect(deepMerge(cache, target, source)).toEqual({ source: cache, target: cache });
    expect(deepMerge(target, source)).toEqual({ source: { target }, target });

    // 数组
    const targetArr = [] as any[];
    const sourceArr = [] as any[];
    const cacheArr = [] as any[];

    targetArr.push(sourceArr);
    sourceArr.push(targetArr);

    expect(deepMerge(cacheArr, targetArr, sourceArr)).toEqual([cacheArr]);
    expect(deepMerge(targetArr, sourceArr)).toEqual([targetArr]);
  });
});
