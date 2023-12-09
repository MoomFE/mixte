import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

describe('getFastestCDN', () => {
  test('获取在当前网络环境, 最快的 CDN 服务下的指定类库的根目录地址', async () => {
    const url = await getFastestCDN('mixte');

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/mixte');
    expect(url[url.length - 1]).not.toBe('/');
  });

  test('支持传入 version 参数', async () => {
    const url = await getFastestCDN('shiki', {
      version: '0.14.5',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/shiki');
    expect(url).toMatch('0.14.5');
    expect(url[url.length - 1]).not.toBe('/');
  });

  test('支持传入 file 参数', async () => {
    const url = await getFastestCDN('shiki', {
      file: '/languages/html.tmLanguage.json',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/shiki');
    expect(url).not.toMatch('html.tmLanguage.json');
    expect(url[url.length - 1]).not.toBe('/');
  });

  test('支持传入 version 和 file 参数', async () => {
    const url = await getFastestCDN('shiki', {
      version: '0.14.5',
      file: '/languages/html.tmLanguage.json',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/shiki');
    expect(url).toMatch('0.14.5');
    expect(url).not.toMatch('html.tmLanguage.json');
    expect(url[url.length - 1]).not.toBe('/');
  });

  test('传入错误的类库名称, version 或 file 参数时, 导致未获取到 CND 地址时, 会抛出异常', async () => {
    const result = await Promise.allSettled([
      // 错误的类库名称
      getFastestCDN('zhang-wei-666'),
      // 错误的 version 参数
      getFastestCDN('shiki', { version: '0.14.5678' }),
      // 错误的 file 参数
      getFastestCDN('shiki', { file: '/zhang-wei-666.json' }),
    ]);

    result.forEach((item) => {
      expect(item.status).toBe('rejected'); // @ts-expect-error
      expect(item.reason).toBeInstanceOf(Error);
    });
  }, Number.POSITIVE_INFINITY);
});
