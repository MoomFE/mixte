import { omit, pick, pickDeep } from 'mixte';

describe('pick', () => {
  it('从对象中选择指定属性', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    expect(pick(obj, ['a', 'c'])).toStrictEqual({ a: 1, c: 3 });
    expect(pick(obj, ['b', 'd'])).toStrictEqual({ b: 2, d: 4 });
    expect(pick(obj, ['a', 'b', 'c', 'd'])).toStrictEqual(obj);
    expect(pick(obj, [])).toStrictEqual({});
  });

  it('支持传入单个字符串键', () => {
    const obj = { a: 1, b: 2, c: 3 };

    expect(pick(obj, 'a')).toStrictEqual({ a: 1 });
    expect(pick(obj, 'b')).toStrictEqual({ b: 2 });
    expect(pick(obj, 'd')).toStrictEqual({});
  });

  it('处理键不存在的情况', () => {
    const obj = { a: 1, b: 2 };

    expect(pick(obj, ['a', 'c'])).toStrictEqual({ a: 1 });
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
});

describe('omit', () => {
  it('从对象中排除指定属性', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    expect(omit(obj, ['a', 'c'])).toStrictEqual({ b: 2, d: 4 });
    expect(omit(obj, ['b', 'd'])).toStrictEqual({ a: 1, c: 3 });
    expect(omit(obj, ['a', 'b', 'c', 'd'])).toStrictEqual({});
    expect(omit(obj, [])).toStrictEqual(obj);
  });

  it('支持传入单个字符串键', () => {
    const obj = { a: 1, b: 2, c: 3 };

    expect(omit(obj, 'a')).toStrictEqual({ b: 2, c: 3 });
    expect(omit(obj, 'b')).toStrictEqual({ a: 1, c: 3 });
    expect(omit(obj, 'd')).toStrictEqual(obj);
  });

  it('处理键不存在的情况', () => {
    const obj = { a: 1, b: 2 };

    expect(omit(obj, ['a', 'c'])).toStrictEqual({ b: 2 });
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
});

describe('pickDeep', () => {
  it('从对象中选择指定的深层属性', () => {
    const obj = {
      a: {
        b: 2,
        c: 3,
      },
      d: {
        e: 4,
        f: 5,
      },
    };

    expect(pickDeep(obj, ['a.b', 'd.e'])).toStrictEqual({
      a: { b: 2 },
      d: { e: 4 },
    });
    expect(pickDeep(obj, ['a.c'])).toStrictEqual({
      a: { c: 3 },
    });
  });

  it('支持传入单个路径字符串', () => {
    const obj = {
      user: {
        profile: {
          name: 'mixte',
        },
      },
    };

    expect(pickDeep(obj, 'user.profile.name')).toStrictEqual({
      user: {
        profile: { name: 'mixte' },
      },
    });
  });

  it('支持数组路径的选择', () => {
    const obj = {
      list: [
        { id: 1, value: 'foo' },
        { id: 2, value: 'bar' },
      ],
    };

    expect(pickDeep(obj, 'list.0.id')).toStrictEqual({
      list: [{ id: 1 }],
    });
    expect(pickDeep(obj, 'list[1].value')).toStrictEqual({
      list: [
        undefined,
        { value: 'bar' },
      ],
    });
  });

  it('处理路径不存在的情况', () => {
    const obj = { a: { b: 1 } };

    expect(pickDeep(obj, ['a.c'])).toStrictEqual({
      a: { c: undefined },
    });
    expect(pickDeep(obj, ['x.y'])).toStrictEqual({
      x: { y: undefined },
    });
  });

  it('处理 null 或 undefined', () => {
    // @ts-expect-error
    expect(pickDeep(null, ['a.b'])).toStrictEqual({});
    // @ts-expect-error
    expect(pickDeep(undefined, ['a.b'])).toStrictEqual({});
  });

  it('返回的是新对象并且不修改原对象', () => {
    const obj = { a: { b: 1 } };
    const result = pickDeep(obj, ['a.b']);

    expect(result).not.toBe(obj);
    expect(obj).toStrictEqual({
      a: { b: 1 },
    });
  });

  it('类型测试', () => {
    const obj = {
      a: { b: 1, c: true },
      d: { e: 'mixte' },
    };

    expectTypeOf(pickDeep(obj, ['a.b', 'd.e'])).toEqualTypeOf<{
      a: { b: number };
      d: { e: string };
    }>();
    expectTypeOf(pickDeep(obj, 'a.c')).toEqualTypeOf<{
      a: { c: boolean };
    }>();
  });
});
