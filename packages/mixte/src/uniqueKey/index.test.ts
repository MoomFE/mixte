import { uniqueKey, uniqueKeyCustomizer } from 'mixte';

describe('uniqueKey', () => {
  test('使用传入方法为数组中对象的某个字段生成一个唯一的 key', () => {
    let arr: { key: any }[] = [];
    let index = 0;
    expect(uniqueKey(arr, 'key', () => index++)).toEqual(0);

    // ------

    arr = [{ key: 0 }, { key: 1 }, { key: 2 }];
    index = 0;
    expect(uniqueKey(arr, 'key', () => index++)).toEqual(3);

    // ------

    arr = [{ key: 'id:0' }, { key: 'id:1' }, { key: 'id:2' }];
    index = 0;
    expect(uniqueKey(arr, 'key', () => `id:${index++}`)).toEqual('id:3');
  });

  test('第三个参数为空时, 使用默认的 key 生成器', () => {
    const arr: { key: string }[] = [];

    for (let i = 0; i < 3600; i++) {
      const key = uniqueKey(arr, 'key');

      expect(key).match(/^[a-zA-Z][a-zA-Z0-9]{17}$/);
      expect(arr.some(item => item.key === key)).toBeFalsy();

      arr.push({ key });
    }
  });

  test('第二个参数为空时, 默认使用 id 作为 key', () => {
    const arr: { id: string }[] = [];

    for (let i = 0; i < 3600; i++) {
      const id = uniqueKey(arr);

      expect(id).match(/^[a-zA-Z][a-zA-Z0-9]{17}$/);
      expect(arr.some(item => item.id === id)).toBeFalsy();

      arr.push({ id });
    }
  });
});

describe('uniqueKeyCustomizer', () => {
  test('返回长度为 18 且首字母不为数字的字符串', () => {
    for (let i = 0; i < 3600; i++)
      expect(uniqueKeyCustomizer()).match(/^[a-zA-Z][a-zA-Z0-9]{17}$/);
  });
});
