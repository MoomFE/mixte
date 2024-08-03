import { uniqueKey, uniqueKeyCustomizer } from 'mixte';

describe('uniqueKey', () => {
  it('使用传入方法为数组中对象的某个字段生成一个唯一的 key', () => {
    let arr: { key: any }[] = [];
    let index = 0;
    expect(uniqueKey(arr, 'key', () => index++)).toStrictEqual(0);

    // ------

    arr = [{ key: 0 }, { key: 1 }, { key: 2 }];
    index = 0;
    expect(uniqueKey(arr, 'key', () => index++)).toStrictEqual(3);

    // ------

    arr = [{ key: 'id:0' }, { key: 'id:1' }, { key: 'id:2' }];
    index = 0;
    expect(uniqueKey(arr, 'key', () => `id:${index++}`)).toStrictEqual('id:3');
  });

  it('第三个参数为空时, 使用默认的 key 生成器', () => {
    const arr: { key: string }[] = [];

    for (let i = 0; i < 3600; i++) {
      const key = uniqueKey(arr, 'key');

      expect(key).match(/^[a-z][a-z0-9]{17}$/i);
      expect(arr.some(item => item.key === key)).toBeFalsy();

      arr.push({ key });
    }
  });

  it('第二个参数为空时, 默认使用 id 作为 key', () => {
    const arr: { id: string }[] = [];

    for (let i = 0; i < 3600; i++) {
      const id = uniqueKey(arr);

      expect(id).match(/^[a-z][a-z0-9]{17}$/i);
      expect(arr.some(item => item.id === id)).toBeFalsy();

      arr.push({ id });
    }
  });

  it('第一个参数不是数组时, 抛出错误', () => {
    expect(() => uniqueKey(undefined as any)).toThrow('???');
    expect(() => uniqueKey(null as any)).toThrow('???');
    expect(() => uniqueKey('' as any)).toThrow('???');
    expect(() => uniqueKey(0 as any)).toThrow('???');
    expect(() => uniqueKey(true as any)).toThrow('???');
    expect(() => uniqueKey(false as any)).toThrow('???');
    expect(() => uniqueKey(Number.NaN as any)).toThrow('???');
    expect(() => uniqueKey(Symbol('') as any)).toThrow('???');
    expect(() => uniqueKey(0n as any)).toThrow('???');
    expect(() => uniqueKey((() => {}) as any)).toThrow('???');
    expect(() => uniqueKey({} as any)).toThrow('???');
    expect(() => uniqueKey(/^🌟$/ as any)).toThrow('???');
    expect(() => uniqueKey(Promise.resolve() as any)).toThrow('???');
  });
});

describe('uniqueKeyCustomizer', () => {
  it('返回长度为 18 且首字母不为数字的字符串', () => {
    for (let i = 0; i < 3600; i++)
      expect(uniqueKeyCustomizer()).match(/^[a-z][a-z0-9]{17}$/i);
  });
});
