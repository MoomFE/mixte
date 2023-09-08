import { deepClone, isPlainObject } from 'mixte';
import { types } from '../is/testTypes';

describe('deepClone', () => {
  test('深拷贝普通对象', () => {
    const obj = {
      a: 1,
      b: { c: 2 },
    };
    const result = deepClone(obj);

    expect(result).not.toBe(obj);
    expect(result).toStrictEqual(obj);

    expect(result.b).not.toBe(obj.b);
    expect(result.b).toStrictEqual(obj.b);
  });

  test('深拷贝数组', () => {
    const arr = [
      [1],
      { b: 2 },
    ];
    const result = deepClone(arr);

    expect(result).not.toBe(arr);
    expect(result).toStrictEqual(arr);

    expect(result[0]).not.toBe(arr[0]);
    expect(result[0]).toStrictEqual(arr[0]);

    expect(result[1]).not.toBe(arr[1]);
    expect(result[1]).toStrictEqual(arr[1]);
  });

  test('所有类型测试', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        let isArray = false;

        if (isPlainObject(value) || (isArray = Array.isArray(value))) {
          expect(deepClone(value)).not.toBe(value);

          if (isArray)
            expect(deepClone(value)).toStrictEqual(value);
          else
            expect(deepClone(value)).toEqual(value);
        }
        else {
          expect(deepClone(value)).toStrictEqual(value);
        }
      });
    });
  });

  test('防御循环引用', () => {
    interface Circular { a: Circular }
    type CircularArray = [CircularArray];

    // 普通对象
    const a: Circular = {} as Circular;
    a.a = a;

    const result = deepClone(a);

    expect(a).toBe(a.a);
    expect(a.a).toBe(a.a.a);
    expect(a.a.a).toBe(a.a.a.a);
    expect(result).toBe(result.a);
    expect(result.a).toBe(result.a.a);
    expect(result.a.a).toBe(result.a.a.a);
    expect(result).not.toBe(a);
    expect(result).toStrictEqual(a);

    // 数组
    const b = [] as unknown as CircularArray;
    b[0] = b;

    const result2 = deepClone(b);

    expect(b).toBe(b[0]);
    expect(b[0]).toBe(b[0][0]);
    expect(b[0][0]).toBe(b[0][0][0]);
    expect(result2).toBe(result2[0]);
    expect(result2[0]).toBe(result2[0][0]);
    expect(result2[0][0]).toBe(result2[0][0][0]);
    expect(result2).not.toBe(b);
    expect(result2).toStrictEqual(b);
  });
});
