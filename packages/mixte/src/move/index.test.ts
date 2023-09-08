import { move, moveRange } from 'mixte';

describe('move', () => {
  test('移动数组内的某个元素到指定的下标位置', () => {
    const arr = [1, 2, 3, 4, 5, 6];

    expect(move(arr, 0, 5)).toStrictEqual([2, 3, 4, 5, 6, 1]);
    expect(move(arr, 5, 0)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(move(arr, 1, 4)).toStrictEqual([1, 3, 4, 5, 2, 6]);
    expect(move(arr, 4, 1)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(move(arr, 2, 3)).toStrictEqual([1, 2, 4, 3, 5, 6]);
    expect(move(arr, 3, 2)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(move(arr, 3, 3)).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test('方法修改的和返回的是原数组', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    expect(move(arr, 0, 5)).toBe(arr);
  });
});

describe('moveRange', () => {
  test('移动数组内一个范围内的元素到指定的下标位置', () => {
    const arr = [1, 2, 3, 4, 5, 6];

    expect(moveRange(arr, 0, 1, 5)).toStrictEqual([2, 3, 4, 5, 6, 1]);
    expect(moveRange(arr, 5, 1, 0)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(moveRange(arr, 1, 3, 3)).toStrictEqual([1, 5, 6, 2, 3, 4]);
    expect(moveRange(arr, 3, 3, 1)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(moveRange(arr, 2, 2, 3)).toStrictEqual([1, 2, 5, 3, 4, 6]);
    expect(moveRange(arr, 3, 2, 2)).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(moveRange(arr, 3, 3, 3)).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test('方法修改的和返回的是原数组', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    expect(moveRange(arr, 0, 1, 5)).toBe(arr);
  });
});
