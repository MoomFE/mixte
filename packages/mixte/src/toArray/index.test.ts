import { toArray } from 'mixte';
import { types } from '../is/testTypes';

describe('toArray', () => {
  it('传入数组, 会直接返回', () => {
    const array = [1, 2, 3];
    expect(toArray(array)).toBe(array);
  });

  it('传入 undefined 或 null, 会返回空数组', () => {
    expect(toArray(undefined)).toStrictEqual([]);
    expect(toArray(null)).toStrictEqual([]);
  });

  it('所有类型测试', () => {
    Object.entries(types).forEach(([type, values]) => {
      if (['undefined', 'null'].includes(type)) {
        values.forEach((value) => {
          expect(toArray(value)).toStrictEqual([]);
        });
      }
      else {
        values.forEach((value) => {
          expect(toArray(value)).toStrictEqual(Array.isArray(value) ? value : [value]);
        });
      }
    });
  });
});
