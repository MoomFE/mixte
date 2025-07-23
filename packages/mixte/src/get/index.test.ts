import { get } from 'mixte';

describe('get', () => {
  const testObj = {
    a: {
      b: [
        { c: 3 },
        { d: 4 },
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
    expect(get(testObj, 'a.b')).toEqual([{ c: 3 }, { d: 4 }]);
  });

  it('获取数组元素', () => {
    expect(get(testObj, 'a.b[0].c')).toBe(3);
    expect(get(testObj, 'a.b[1].d')).toBe(4);
    expect(get(testObj, 'a.b[0]')).toEqual({ c: 3 });
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
    expect(get(testObj, '')).toBe(testObj);
    expect(get(testObj, undefined as any)).toBe(testObj);
    expect(get(testObj, null as any)).toBe(testObj);
  });

  it('复杂数组索引', () => {
    const complexObj = {
      users: [
        { name: 'Alice', scores: [100, 95, 88] },
        { name: 'Bob', scores: [90, 85, 92] },
      ],
    };

    expect(get(complexObj, 'users[0].name')).toBe('Alice');
    expect(get(complexObj, 'users[1].scores[2]')).toBe(92);
    expect(get(complexObj, 'users[2].name', 'Not Found')).toBe('Not Found');
  });
});
