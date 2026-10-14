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
      else if (type === 'array') {
        values.forEach((value) => {
          // 数组会原样返回, 保持同一引用
          expect(toArray(value)).toBe(value);
        });
      }
      else {
        values.forEach((value) => {
          expect(toArray(value)).toStrictEqual([value]);
        });
      }
    });
  });
});
