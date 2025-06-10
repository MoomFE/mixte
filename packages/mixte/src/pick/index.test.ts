import { omit, pick } from 'mixte';

describe('pick', () => {
  it('从对象中选择指定属性', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    expect(pick(obj, ['a', 'c'])).toStrictEqual({ a: 1, c: 3 });
    expect(pick(obj, ['b', 'd'])).toStrictEqual({ b: 2, d: 4 });
    expect(pick(obj, ['a', 'b', 'c', 'd'])).toStrictEqual(obj);
    expect(pick(obj, [])).toStrictEqual({});
  });

  it('处理键不存在的情况', () => {
    const obj = { a: 1, b: 2 };

    // @ts-expect-error
    expect(pick(obj, ['a', 'c'])).toStrictEqual({ a: 1 });
    // @ts-expect-error
    expect(pick(obj, ['c', 'd'])).toStrictEqual({});
  });

  it('处理 null 或 undefined', () => {
    // @ts-expect-error
    expect(pick(null, ['a', 'b'])).toStrictEqual({});
    // @ts-expect-error
    expect(pick(undefined, ['a', 'b'])).toStrictEqual({});
  });

  it('返回的是新对象', () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ['a']);

    expect(result).not.toBe(obj);
  });

  it('类型测试', () => {
    const obj = { a: 1, b: '2', c: true };
    const result = pick(obj, ['a', 'c']);

    expectTypeOf(result).toEqualTypeOf<{ a: number; c: boolean }>();
    expectTypeOf(pick(obj, ['a'])).toEqualTypeOf<{ a: number }>();
  });

  it('支持传入单个字符串键', () => {
    const obj = { a: 1, b: 2, c: 3 };

    expect(pick(obj, 'a')).toStrictEqual({ a: 1 });
    expect(pick(obj, 'b')).toStrictEqual({ b: 2 });

    // @ts-expect-error
    expect(pick(obj, 'd')).toStrictEqual({});
  });
});

describe('omit', () => {
  it('从对象中排除指定属性', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    expect(omit(obj, ['a', 'c'])).toStrictEqual({ b: 2, d: 4 });
    expect(omit(obj, ['b', 'd'])).toStrictEqual({ a: 1, c: 3 });
    expect(omit(obj, ['a', 'b', 'c', 'd'])).toStrictEqual({});
    expect(omit(obj, [])).toStrictEqual(obj);
  });

  it('处理键不存在的情况', () => {
    const obj = { a: 1, b: 2 };

    // @ts-expect-error
    expect(omit(obj, ['a', 'c'])).toStrictEqual({ b: 2 });
    // @ts-expect-error
    expect(omit(obj, ['c', 'd'])).toStrictEqual(obj);
  });

  it('处理 null 或 undefined', () => {
    // @ts-expect-error
    expect(omit(null, ['a', 'b'])).toStrictEqual({});
    // @ts-expect-error
    expect(omit(undefined, ['a', 'b'])).toStrictEqual({});
  });

  it('返回的是新对象', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, ['a']);

    expect(result).not.toBe(obj);
  });

  it('类型测试', () => {
    const obj = { a: 1, b: '2', c: true };
    const result = omit(obj, ['a', 'c']);

    expectTypeOf(result).toEqualTypeOf<{ b: string }>();
    expectTypeOf(omit(obj, ['a'])).toEqualTypeOf<{ b: string; c: boolean }>();
  });

  it('支持传入单个字符串键', () => {
    const obj = { a: 1, b: 2, c: 3 };

    expect(omit(obj, 'a')).toStrictEqual({ b: 2, c: 3 });
    expect(omit(obj, 'b')).toStrictEqual({ a: 1, c: 3 });

    // @ts-expect-error
    expect(omit(obj, 'd')).toStrictEqual(obj);
  });
});
