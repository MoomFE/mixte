import { delay, leastRun } from 'mixte';

describe('leastRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('返回一个 Promise', () => {
    expect(leastRun(() => {})).toBeInstanceOf(Promise);
  });

  it('直接传递函数, 运行函数并且保证最少执行 1000ms 的时间', async () => {
    expect(vi.getTimerCount()).toBe(0);
    leastRun(() => {});

    // await fn
    expect(vi.getTimerCount()).toBe(0);
    await Promise.resolve();

    // await delay
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(999);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('仅传递执行时间', async () => {
    expect(vi.getTimerCount()).toBe(0);
    leastRun(2000);

    // await fn
    expect(vi.getTimerCount()).toBe(0);
    await Promise.resolve();

    // await delay
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1999);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('运行函数并且保证最少执行指定时间 ( 毫秒 )', async () => {
    const times = [1, 10, 20, 100, 200, 1000, 2000];

    for (const time of times) {
      expect(vi.getTimerCount()).toBe(0);
      leastRun(time, () => {});

      // await fn
      expect(vi.getTimerCount()).toBe(0);
      await Promise.resolve();

      // await delay
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(time - 1);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(1);
      expect(vi.getTimerCount()).toBe(0);
    }
  });

  it('传入的函数执行时间超过指定的时间时, 直接完成', async () => {
    expect(vi.getTimerCount()).toBe(0);

    leastRun(10, () => {
      return delay(1000);
    });

    // await fn
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(999);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(vi.getTimerCount()).toBe(0);

    // await delay
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
