import { getFastestCDN } from '@mixte/snippets/getFastestCDN';
import isInCi from 'is-in-ci';

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
      file: '/min/vs/basic-languages/monaco.contribution.js',
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

describe('getFastestCDN ( 模拟请求 )', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('所有 CND 均无响应时, 会在超时后中断请求并抛出异常', async () => {
    const signals: AbortSignal[] = [];

    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => {
      const signal = options.signal as AbortSignal;
      signals.push(signal);

      // 永不主动 resolve, 仅在中断时 reject
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    }));

    const promise = getFastestCDN('mixte', { timeout: 1000 });
    const assertion = expect(promise).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(1000);

    await assertion;

    expect(signals.length).toBeGreaterThan(0);
    expect(signals.every(signal => signal.aborted)).toBe(true);
  });

  it('请求成功后, 会中断其余仍在进行中的请求', async () => {
    const signals: AbortSignal[] = [];
    let pendingCount = 0;

    vi.stubGlobal('fetch', vi.fn((url: string, options: RequestInit) => {
      const signal = options.signal as AbortSignal;
      signals.push(signal);

      if (url.includes('unpkg'))
        return Promise.resolve({ ok: true } as Response);

      pendingCount++;
      return new Promise(() => {});
    }));

    const url = await getFastestCDN('mixte');

    expect(url).toContain('unpkg');
    expect(pendingCount).toBeGreaterThan(0);
    expect(signals.every(signal => signal.aborted)).toBe(true);
  });
});
