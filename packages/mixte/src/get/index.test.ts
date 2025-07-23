import { get, set } from 'mixte';

describe('get', () => {
  const testObj = {
    a: {
      b: [
        {
          c: 3,
          name: 'Alice',
          scores: [100, 95, 88],
        },
        {
          d: 4,
          name: 'Bob',
          scores: [90, 85, 92],
        },
      ],
    },
    e: {
      f: {
        g: 'hello',
      },
    },
    h: null,
    i: undefined,
    j: 0,
    k: false,
    l: '',
  };

  it('获取简单属性', () => {
    expect(get(testObj, 'j')).toBe(0);
    expect(get(testObj, 'k')).toBe(false);
    expect(get(testObj, 'l')).toBe('');
  });

  it('获取嵌套对象属性', () => {
    expect(get(testObj, 'e.f.g')).toBe('hello');
    expect(get(testObj, 'a.b')).toEqual([
      {
        c: 3,
        name: 'Alice',
        scores: [100, 95, 88],
      },
      {
        d: 4,
        name: 'Bob',
        scores: [90, 85, 92],
      },
    ]);
  });

  it('获取数组元素', () => {
    expect(get(testObj, 'a.b[0].c')).toBe(3);
    expect(get(testObj, 'a.b[1].d')).toBe(4);
    expect(get(testObj, 'a.b[0]')).toEqual({
      c: 3,
      name: 'Alice',
      scores: [100, 95, 88],
    });
    expect(get(testObj, 'a.b[0].name')).toBe('Alice');
    expect(get(testObj, 'a.b[1].scores[2]')).toBe(92);
    expect(get(testObj, 'a.b[2].name', 'Not Found')).toBe('Not Found');
  });

  it('路径不存在时返回默认值', () => {
    expect(get(testObj, 'x.y.z')).toBeUndefined();
    expect(get(testObj, 'x.y.z', 'default')).toBe('default');
    expect(get(testObj, 'a.b[2].c')).toBeUndefined();
    expect(get(testObj, 'a.b[2].c', 'default')).toBe('default');
  });

  it('属性值为 null 或 undefined 时的处理', () => {
    expect(get(testObj, 'h')).toBeNull();
    expect(get(testObj, 'i')).toBeUndefined();
    expect(get(testObj, 'i', 'default')).toBe('default');
    expect(get(testObj, 'h.x', 'default')).toBe('default');
  });

  it('传入 null 或 undefined 对象', () => {
    expect(get(null, 'a.b.c')).toBeUndefined();
    expect(get(undefined, 'a.b.c')).toBeUndefined();
    expect(get(null, 'a.b.c', 'default')).toBe('default');
    expect(get(undefined, 'a.b.c', 'default')).toBe('default');
  });

  it('空路径', () => {
    expect(get(testObj, '')).toBe(undefined);
    expect(get(testObj, undefined as any)).toBe(undefined);
    expect(get(testObj, null as any)).toBe(undefined);
    expect(get(testObj, '', 'default')).toBe('default');
    expect(get(testObj, undefined as any, 'default')).toBe('default');
    expect(get(testObj, null as any, 'default')).toBe('default');

    expect(get({ undefined: 1 }, undefined as any)).toBe(1);
    expect(get({ null: 1 }, null as any)).toBe(1);
  });
});

describe('set', () => {
  it('简单属性赋值', () => {
    const obj = {};
    set(obj, 'a.b', 5);
    expect(obj).toEqual({ a: { b: 5 } });
  });

  it('数组嵌套对象赋值', () => {
    const obj = {};
    set(obj, 'x.y[2].z', 'hello');
    expect(obj).toEqual({ x: { y: [undefined, undefined, { z: 'hello' }] } });
  });

  it('多层嵌套赋值', () => {
    const obj = { a: { b: [{ c: 1 }] } };
    set(obj, 'a.b[0].d.e', true);
    expect(obj).toEqual({ a: { b: [{ c: 1, d: { e: true } }] } });
  });

  it('覆盖已有值', () => {
    const obj = { a: { b: 1 } };
    set(obj, 'a.b', 2);
    expect(obj.a.b).toBe(2);
  });

  it('对 null/undefined 不操作', () => {
    expect(() => set(null as any, 'a.b', 1)).not.toThrow();
    expect(() => set(undefined as any, 'a.b', 1)).not.toThrow();
  });
});
