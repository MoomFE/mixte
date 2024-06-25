import isInCi from 'is-in-ci';
import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

describe.skipIf(isInCi).concurrent('getFastestCDN', () => {
  it('获取在当前网络环境, 最快的 CDN 服务下的指定类库的根目录地址', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    const url = await getFastestCDN('mixte');

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/mixte');
    expect(url[url.length - 1]).not.toBe('/');
  });

  it('支持传入 version 参数', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    const url = await getFastestCDN('monaco-editor', {
      version: '0.43.0',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/monaco-editor');
    expect(url).toMatch('0.43.0');
    expect(url[url.length - 1]).not.toBe('/');
  });

  it('支持传入 file 参数', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    const url = await getFastestCDN('monaco-editor', {
      file: '/min/vs/basic-languages/yaml/yaml.js',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/monaco-editor');
    expect(url).not.toMatch('yaml.js');
    expect(url[url.length - 1]).not.toBe('/');
  });

  it('支持传入 version 和 file 参数', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    const url = await getFastestCDN('monaco-editor', {
      version: '0.43.0',
      file: '/min/vs/basic-languages/yaml/yaml.js',
    });

    expect(url).toBeTypeOf('string');
    expect(url).toMatch('/monaco-editor');
    expect(url).toMatch('0.43.0');
    expect(url).not.toMatch('yaml.js');
    expect(url[url.length - 1]).not.toBe('/');
  });

  it('传入错误的类库名称, 导致未获取到 CND 地址时, 会抛出异常', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    await expect(() => getFastestCDN('zhang-wei-666')).rejects.toThrow();
  });

  it('传入错误的 version 参数, 导致未获取到 CND 地址时, 会抛出异常', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    await expect(() => getFastestCDN('monaco-editor', { version: '0.14.5678' })).rejects.toThrow();
  });

  it('传入错误的 file 参数, 导致未获取到 CND 地址时, 会抛出异常', { timeout: Number.POSITIVE_INFINITY }, async ({ expect }) => {
    await expect(() => getFastestCDN('monaco-editor', { file: '/zhang-wei-666.json' })).rejects.toThrow();
  });
});
