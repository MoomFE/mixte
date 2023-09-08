import { defineArgs } from 'mixte';

describe('defineArgs', () => {
  test('提前定义方法的参数', () => {
    let args: number[] = [];

    const add = (a: number, b: number) => {
      args = [a, b];
      return a + b;
    };

    const next = defineArgs(add, { 0: 1 });
    const next2 = defineArgs(add, { 1: 1 });

    expect(next(0)).toBe(1);
    expect(args).toStrictEqual([1, 0]);
    expect(next(1)).toBe(2);
    expect(args).toStrictEqual([1, 1]);
    expect(next(2)).toBe(3);
    expect(args).toStrictEqual([1, 2]);

    expect(next2(0)).toBe(1);
    expect(args).toStrictEqual([0, 1]);
    expect(next2(1)).toBe(2);
    expect(args).toStrictEqual([1, 1]);
    expect(next2(2)).toBe(3);
    expect(args).toStrictEqual([2, 1]);
  });

  test('提前定义方法的多个参数', () => {
    let args: any[] = [];

    const record = (a: any, b: any, c: any, d: any, e: any) => {
      args = [a, b, c, d, e];
    };

    const next = defineArgs(record, {
      1: 333,
      3: 666,
    });

    next(1, 2, 3);
    expect(args).toStrictEqual([1, 333, 2, 666, 3]);
  });

  test('定义参数值时, 可以传入方法, 取值时, 会执行方法获取实时的值', () => {
    let index = 1;
    let args: number[] = [];

    const add = (a: number, b: number) => {
      args = [a, b];
      return a + b;
    };

    const next = defineArgs(add, {
      1: () => index++,
    });

    expect(next(0)).toBe(1);
    expect(args).toStrictEqual([0, 1]);

    expect(next(1)).toBe(3);
    expect(args).toStrictEqual([1, 2]);

    expect(next(2)).toBe(5);
    expect(args).toStrictEqual([2, 3]);
  });

  test('定义了指定位置的参数值, 如果前面的参数值没有传入, 那么会为 undefined', () => {
    let args: any[] = [];

    const record = (a: any, b: any, c: any, d: any) => {
      args = [a, b, c, d];
    };

    const wrapRecord = defineArgs(record, {
      2: 666,
    });

    wrapRecord(1);
    expect(args).toStrictEqual([1, undefined, 666, undefined]);
  });

  test('确保不会传入多余的参数', () => {
    let args: any[] = [];

    const record = (...userArgs: any[]) => {
      args = userArgs;
    };

    const wrapRecord = defineArgs(record, {
      2: 666,
    });

    wrapRecord();
    expect(args).toStrictEqual([undefined, undefined, 666]);

    wrapRecord(1);
    expect(args).toStrictEqual([1, undefined, 666]);

    wrapRecord(1, 2);
    expect(args).toStrictEqual([1, 2, 666]);

    wrapRecord(1, 2, 3);
    expect(args).toStrictEqual([1, 2, 666, 3]);
  });
});
